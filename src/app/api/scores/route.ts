import { NextResponse } from "next/server";

// ─── In-memory cache (resets on redeploy) ─────────────
let cachedData: MatchData[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// ─── Fallback hardcoded data ──────────────────────────
const fallbackMatches: MatchData[] = [
  {
    date: "Dom 14 Jun",
    title: "Costa de Marfil vs Ecuador",
    venue: "Filadelfia, EE.UU.",
    time: "18:00",
    result: "0-1",
    played: true,
  },
  {
    date: "Sáb 20 Jun",
    title: "Ecuador vs Curazao",
    venue: "Kansas City, EE.UU.",
    time: "21:00",
    result: null,
    played: false,
  },
  {
    date: "Jue 25 Jun",
    title: "Ecuador vs Alemania",
    venue: "Estadio por confirmar",
    time: "15:00",
    result: null,
    played: false,
  },
];

interface MatchData {
  date: string;
  title: string;
  venue: string;
  time: string;
  result: string | null;
  played: boolean;
}

/**
 * Merge live API data with fallback data.
 * Strategy: Keep fallback's venue/time/date/title (which are more accurate),
 * but use live result/played status (which is what actually changes).
 */
function mergeWithFallback(live: MatchData[], fallback: MatchData[]): MatchData[] {
  // Track which fallback matches have been used to avoid duplicate matching
  const usedFallbacks = new Set<number>();

  return live.map((liveMatch) => {
    const liveLower = liveMatch.title.toLowerCase();
    const liveTeams = liveLower.split(" vs ").map((t) => t.trim());

    let bestMatchIdx = -1;
    let bestScore = 0;

    // Find the BEST matching fallback (not just the first)
    fallback.forEach((fb, idx) => {
      if (usedFallbacks.has(idx)) return; // Skip already-matched fallbacks

      const fbLower = fb.title.toLowerCase();
      const fbTeams = fbLower.split(" vs ").map((t) => t.trim());

      if (liveTeams.length === 2 && fbTeams.length === 2) {
        // Count how many team names match (in any order)
        let score = 0;
        if (fbLower.includes(liveTeams[0]) || liveLower.includes(fbTeams[0])) score++;
        if (fbLower.includes(liveTeams[1]) || liveLower.includes(fbTeams[1])) score++;

        // Bonus: exact match on both teams (even if swapped)
        const sortedLive = [...liveTeams].sort().join("|");
        const sortedFb = [...fbTeams].sort().join("|");
        if (sortedLive === sortedFb) score += 10;

        if (score > bestScore) {
          bestScore = score;
          bestMatchIdx = idx;
        }
      }
    });

    if (bestMatchIdx === -1) return liveMatch;

    // Mark this fallback as used
    usedFallbacks.add(bestMatchIdx);
    const fallbackMatch = fallback[bestMatchIdx];

    // Use fallback's structured data, but live's result/play status
    return {
      date: isPlaceholder(liveMatch.date) ? fallbackMatch.date : liveMatch.date,
      title: fallbackMatch.title, // Always use fallback title (consistent formatting)
      venue: isPlaceholder(liveMatch.venue) ? fallbackMatch.venue : liveMatch.venue,
      time: isPlaceholder(liveMatch.time) ? fallbackMatch.time : liveMatch.time,
      result: liveMatch.result,
      played: liveMatch.played,
    };
  });
}

/** Check if a value looks like a placeholder from the LLM */
function isPlaceholder(val: string): boolean {
  if (!val) return true;
  const placeholders = ["ciudad, país", "hh:mm", "tbd", "por confirmar", "n/a", "xxx"];
  return placeholders.some((p) => val.toLowerCase().includes(p));
}

export async function GET() {
  // Return cached data if still fresh
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return NextResponse.json({
      matches: cachedData,
      source: "cache",
      updated: new Date(cacheTime).toISOString(),
    });
  }

  try {
    // Dynamic import to avoid bundling issues
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    // Step 1: Search for Ecuador World Cup 2026 scores
    const searchResults = await zai.functions.invoke("web_search", {
      query: "Ecuador mundial 2026 resultado partido Grupo E FIFA",
      num: 8,
      recency_days: 7,
    });

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error("No search results found");
    }

    // Step 2: Use LLM to parse search results into structured match data
    const searchContext = searchResults
      .slice(0, 6)
      .map(
        (r: { name: string; snippet: string; date: string }, i: number) =>
          `${i + 1}. ${r.name}\n   ${r.snippet}\n   Publicado: ${r.date}`
      )
      .join("\n\n");

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content:
            "Eres un asistente deportivo experto en fútbol. Extraes datos precisos de partidos de fútbol. Responde SOLO con JSON válido, sin texto adicional ni markdown.",
        },
        {
          role: "user",
          content: `A continuación tienes resultados de búsqueda web sobre los partidos de Ecuador en el Mundial FIFA 2026 Grupo E.

RESULTADOS DE BÚSQUEDA:
${searchContext}

DATOS CONOCIDOS (usa estos como referencia, actualízalos si la búsqueda tiene info más reciente):
1. Costa de Marfil vs Ecuador — Dom 14 Jun, Filadelfia, 18:00 Ecuador
2. Ecuador vs Curazao — Sáb 20 Jun, Kansas City, 21:00 Ecuador
3. Ecuador vs Alemania — Jue 25 Jun, 15:00 Ecuador

Extrae la información de cada partido. IMPORTANTE:
- Si un partido ya se jugó, incluye el resultado exacto (goles) en "result"
- Si NO se ha jugado todavía, result debe ser null y played false
- Los campos venue y time deben tener valores reales, NO placeholders como "Ciudad, País" o "HH:MM"
- Usa los datos conocidos de arriba para venue/time/date si la búsqueda no tiene mejor info
- El campo result es lo MÁS IMPORTANTE — si el partido se jugó, dame el marcador

Responde con este JSON exacto (sin backticks ni markdown):
{
  "matches": [
    {
      "date": "Día DD Mes",
      "title": "Equipo1 vs Equipo2",
      "venue": "Ciudad, País",
      "time": "HH:MM",
      "result": "X-Y" o null,
      "played": true o false
    }
  ]
}`,
        },
      ],
      thinking: { type: "disabled" },
    });

    const content = completion.choices[0]?.message?.content?.trim();

    if (!content) {
      throw new Error("Empty LLM response");
    }

    // Parse the JSON response (handle potential markdown code blocks)
    let cleanContent = content;
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleanContent);

    if (parsed.matches && Array.isArray(parsed.matches) && parsed.matches.length > 0) {
      // Validate and normalize match data
      const rawMatches: MatchData[] = parsed.matches.map((m: MatchData) => ({
        date: String(m.date || ""),
        title: String(m.title || ""),
        venue: String(m.venue || ""),
        time: String(m.time || ""),
        result: m.result ? String(m.result) : null,
        played: Boolean(m.played),
      }));

      // Smart merge: use live result data, keep fallback venue/time accuracy
      const matches = mergeWithFallback(rawMatches, fallbackMatches);

      // Cache the results
      cachedData = matches;
      cacheTime = Date.now();

      return NextResponse.json({
        matches,
        source: "live",
        updated: new Date(cacheTime).toISOString(),
      });
    }

    throw new Error("Invalid parsed data structure");
  } catch (error) {
    console.error("Scores API error:", error);

    // Return fallback data if API fails
    return NextResponse.json({
      matches: cachedData || fallbackMatches,
      source: "fallback",
      updated: new Date(cacheTime || Date.now()).toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
