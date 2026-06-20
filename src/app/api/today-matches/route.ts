import { NextResponse } from "next/server";

// ─── In-memory cache ──────────────────────────────────
let cachedData: TodayMatch[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface TodayMatch {
  time: string;
  home: string;
  away: string;
  homeFlag: string;
  awayFlag: string;
  score: string | null;
  status: "played" | "live" | "upcoming";
  group: string;
  venue: string;
}

export async function GET() {
  // Return cached data if still fresh
  if (cachedData && Date.now() - cacheTime < CACHE_TTL) {
    return NextResponse.json({
      matches: cachedData,
      date: new Date().toLocaleDateString("es-EC", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      source: "cache",
      updated: new Date(cacheTime).toISOString(),
    });
  }

  try {
    const ZAI = (await import("z-ai-web-dev-sdk")).default;
    const zai = await ZAI.create();

    // Search for today's World Cup matches
    const today = new Date().toLocaleDateString("es-EC", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const searchResults = await zai.functions.invoke("web_search", {
      query: `Mundial FIFA 2026 partidos hoy ${today} resultados en vivo`,
      num: 10,
      recency_days: 1,
    });

    if (!Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error("No search results found");
    }

    // Use LLM to extract structured match data
    const searchContext = searchResults
      .slice(0, 8)
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
            "Eres un asistente deportivo experto en fútbol. Extraes datos precisos de partidos del día. Responde SOLO con JSON válido, sin texto adicional ni markdown.",
        },
        {
          role: "user",
          content: `A continuación tienes resultados de búsqueda web sobre los partidos del Mundial FIFA 2026 que se juegan HOY.

RESULTADOS DE BÚSQUEDA:
${searchContext}

Extrae TODOS los partidos del Mundial 2026 que se juegan hoy. Para cada partido necesito:
- Hora del partido en hora de Ecuador (UTC-5)
- Selecciones con sus banderas (emoji)
- Marcador si ya se jugó o está en juego (ej: "2-1"), o null si no ha empezado
- Estado: "played" (terminado), "live" (en juego), "upcoming" (por jugar)
- Grupo (ej: "Grupo E", "Grupo A")
- Ciudad/sede

IMPORTANTE:
- Si un partido está EN VIVO ahora mismo, status debe ser "live" y score el marcador actual
- Los partidos de Ecuador deben tener home="Ecuador" con bandera 🇪🇨
- Las horas deben estar en hora Ecuador (UTC-5)
- Si hoy NO hay partidos del Mundial, devuelve array vacío

Responde con este JSON exacto (sin backticks ni markdown):
{
  "matches": [
    {
      "time": "HH:MM",
      "home": "Nombre país",
      "away": "Nombre país",
      "homeFlag": "🏳️",
      "awayFlag": "🏳️",
      "score": "X-Y" o null,
      "status": "played" | "live" | "upcoming",
      "group": "Grupo X",
      "venue": "Ciudad"
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

    // Parse JSON (handle markdown code blocks)
    let cleanContent = content;
    if (cleanContent.startsWith("```")) {
      cleanContent = cleanContent
        .replace(/^```(?:json)?\n?/, "")
        .replace(/\n?```$/, "");
    }

    const parsed = JSON.parse(cleanContent);

    if (parsed.matches && Array.isArray(parsed.matches)) {
      const matches: TodayMatch[] = parsed.matches.map(
        (m: Record<string, unknown>) => ({
          time: String(m.time || ""),
          home: String(m.home || ""),
          away: String(m.away || ""),
          homeFlag: String(m.homeFlag || "🏳️"),
          awayFlag: String(m.awayFlag || "🏳️"),
          score: m.score ? String(m.score) : null,
          status: (["played", "live", "upcoming"].includes(String(m.status))
            ? String(m.status)
            : "upcoming") as TodayMatch["status"],
          group: String(m.group || ""),
          venue: String(m.venue || ""),
        })
      );

      // Cache the results
      cachedData = matches;
      cacheTime = Date.now();

      return NextResponse.json({
        matches,
        date: new Date().toLocaleDateString("es-EC", {
          weekday: "long",
          day: "numeric",
          month: "long",
        }),
        source: "live",
        updated: new Date(cacheTime).toISOString(),
      });
    }

    throw new Error("Invalid parsed data structure");
  } catch (error) {
    console.error("Today matches API error:", error);

    return NextResponse.json({
      matches: cachedData || [],
      date: new Date().toLocaleDateString("es-EC", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      source: "fallback",
      updated: new Date(cacheTime || Date.now()).toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
