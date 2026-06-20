"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Music,
  Wine,
  CircleDot,
  TreePalm,
  MessageCircle,
  ChevronDown,
  Star,
  Calendar,
  Instagram,
  Facebook,
  ExternalLink,
  Menu,
  X,
  Mail,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// ─── Config ──────────────────────────────────────────
const WHATSAPP_ISMISA = "593994226390";
const WHATSAPP_JIMBRA = "593994226390"; // TODO: Replace with Isaac's real number
const INSTAGRAM_URL = "https://instagram.com/ismisa_rooftop"; // TODO: Replace with real
const FACEBOOK_URL = "https://facebook.com/ismisatour"; // Based on WhatsApp Business info
const EMAIL_ISMISA = "wellfamite@gmail.com";
const ADDRESS = "Ciudadela Villa Bonita, Guayaquil, Ecuador";
const MAPS_COORDS = "-2.17,-79.93"; // Approximate Guayaquil center

const whatsappLink = (number: string, text: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

// ─── Data ────────────────────────────────────────────
const galleryItems = [
  {
    image: "/images/billar.png",
    title: "Billar",
    description: "Mesas profesionales para desafiar a tus amigos",
    icon: CircleDot,
  },
  {
    image: "/images/tragos.png",
    title: "Tragos",
    description: "Cócteles artesanales con sabores únicos",
    icon: Wine,
  },
  {
    image: "/images/musica.png",
    title: "Música en Vivo",
    description: "Artistas locales cada fin de semana",
    icon: Music,
  },
  {
    image: "/images/terraza.png",
    title: "Rooftop",
    description: "El mejor ambiente en las alturas de Guayaquil",
    icon: TreePalm,
  },
];

const menuItems = [
  {
    name: "La Tricolor 🇪🇨",
    description: "Aguardiente, limón, hierbabuena, soda — el trago de la selección",
    tag: "Mundial",
  },
  {
    name: "El Canarinho 🇧🇷",
    description: "Cachaça, lima, azúcar, frutas tropicales — espíritu brasileño",
    tag: "Mundial",
  },
  {
    name: "La Albiceleste 🇦🇷",
    description: "Fernet, cola artesanal, hielo — clásico argentino en el rooftop",
    tag: "Mundial",
  },
  {
    name: "Wellington Sour",
    description: "Whisky, limón, clara de huevo, amargo de angostura",
    tag: "Signature",
  },
  {
    name: "Mojito Tropical",
    description: "Ron blanco, hierbabuena, lima, soda tropical",
    tag: "Favorito",
  },
  {
    name: "Pisco Amazónico",
    description: "Pisco, maracuyá, camu camu, hielo fresco",
    tag: "Exclusivo",
  },
  {
    name: "Negroni Ecuatoriano",
    description: "Gin local, campari, vermut rojo, twist de naranja",
    tag: "Premium",
  },
  {
    name: "Cerveza Artesanal",
    description: "Selección de cervezas locales y de importación",
    tag: "Clásico",
  },
];

// ─── Mundial 2026 — Grupo E (fallback, overridden by API) ──
interface MatchData {
  date: string;
  title: string;
  venue: string;
  time: string;
  result: string | null;
  played: boolean;
}

const ecuadorMatchesFallback: MatchData[] = [
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

const upcomingEvents = [
  {
    date: "Sáb 20 Jun",
    title: "Ecuador vs Curazao — En vivo",
    artist: "Pantalla gigante · Tragos mundialistas · Ambiente de selección",
    time: "21:00",
  },
  {
    date: "Jue 25 Jun",
    title: "Ecuador vs Alemania — En vivo",
    artist: "La Tri busca la clasificación · Reservá tu mesa",
    time: "15:00",
  },
  {
    date: "Vie 27 Jun",
    title: "Noche de Salsa",
    artist: "DJ Carlos Rivera + Orquesta La Clave",
    time: "21:00",
  },
  {
    date: "Sáb 28 Jun",
    title: "Acústico en el Rooftop",
    artist: "Valentina Mora — Voz y Guitarra",
    time: "20:30",
  },
];

const hours = [
  { day: "Jueves", time: "18:00 – 00:00" },
  { day: "Viernes", time: "18:00 – 02:00" },
  { day: "Sábado", time: "18:00 – 02:00" },
  { day: "Domingo", time: "17:00 – 23:00" },
];

// ─── Animation Helpers ───────────────────────────────
function FadeInSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Floating WhatsApp Button ────────────────────────
function FloatingWhatsApp({ hidden }: { hidden?: boolean }) {
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (hidden) return null;

  return (
    <a
      href={whatsappLink(
        WHATSAPP_ISMISA,
        "Hola ISMISA! Quisiera hacer una reserva 🍸"
      )}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <span
        className={`flex items-center justify-center w-14 h-14 ${pulse ? "animate-pulse" : ""}`}
      >
        <MessageCircle className="w-7 h-7" />
      </span>
      <span className="max-w-0 overflow-hidden group-hover:max-w-40 transition-all duration-300 whitespace-nowrap pr-4 font-medium text-sm">
        Reservar mesa
      </span>
    </a>
  );
}

// ─── Navbar ──────────────────────────────────────────
function Navbar({ menuOpen, onToggleMenu }: { menuOpen: boolean; onToggleMenu: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const navLinks = [
    { href: "#inicio", label: "Inicio" },
    { href: "#mundial", label: "⚽ Mundial" },
    { href: "#galeria", label: "Galería" },
    { href: "#eventos", label: "Eventos" },
    { href: "#menu", label: "Menú" },
    { href: "#nosotros", label: "Nosotros" },
    { href: "#ubicacion", label: "Ubicación" },
  ];

  const handleNavClick = (href: string) => {
    onToggleMenu();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  return (
    <>
      {/* Header bar */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || menuOpen
            ? "bg-[oklch(0.12_0.008_80)]/95 backdrop-blur-md shadow-lg shadow-black/30 border-b border-gold/10"
            : "bg-transparent"
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="#inicio"
            onClick={(e) => {
              e.preventDefault();
              if (menuOpen) onToggleMenu();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-3 group"
          >
            <img
              src="/images/logo-ismisa.png"
              alt="ISMISA Logo"
              className="w-10 h-10 rounded-full border border-primary/30 group-hover:border-primary/60 transition-colors"
            />
            <span className="font-[var(--font-playfair)] text-xl sm:text-2xl font-bold text-gold-gradient tracking-wide">
              ISMISA
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary/50"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="ml-2">
              <a
                href={whatsappLink(
                  WHATSAPP_ISMISA,
                  "Hola ISMISA! Quisiera hacer una reserva 🍸"
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Reservar
                </Button>
              </a>
            </li>
          </ul>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors z-[60] relative"
            onClick={onToggleMenu}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile nav — Full screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-[oklch(0.12_0.008_80)]/98 backdrop-blur-lg"
            onClick={onToggleMenu}
          >
            <div
              className="flex flex-col items-center justify-center h-full pt-16 pb-8 px-6"
              onClick={(e) => e.stopPropagation()}
            >
              <ul className="w-full max-w-sm space-y-1">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      className="block px-5 py-4 text-lg text-foreground/90 hover:text-primary hover:bg-secondary/50 rounded-xl transition-colors font-medium active:bg-secondary/80 active:scale-[0.98]"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navLinks.length * 0.05 + 0.1 }}
                  className="pt-4"
                >
                  <a
                    href={whatsappLink(
                      WHATSAPP_ISMISA,
                      "Hola ISMISA! Quisiera hacer una reserva 🍸"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                    onClick={() => onToggleMenu()}
                  >
                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14 text-base glow-gold">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Reservar por WhatsApp
                    </Button>
                  </a>
                </motion.li>
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Hero Section ────────────────────────────────────
function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      />
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0.008_80)]/70 via-[oklch(0.12_0.008_80)]/50 to-[oklch(0.12_0.008_80)]" />

      {/* Decorative glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Logo in hero */}
          <div className="mb-6 flex justify-center">
            <img
              src="/images/logo-ismisa.png"
              alt="ISMISA Logo"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-primary/40 shadow-lg shadow-primary/20"
            />
          </div>
          <Badge
            variant="outline"
            className="mb-4 border-primary/40 text-primary bg-primary/10 px-4 py-1.5 text-sm"
          >
            <Star className="w-3.5 h-3.5 mr-1.5" />
            Rooftop Bar Premium en Guayaquil
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-[var(--font-playfair)] text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-gold-gradient">ISMISA</span>
        </motion.h1>

        {/* Mundial 2026 Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mb-6"
        >
          <a href="#mundial">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border border-primary/40 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 cursor-pointer hover:border-primary/70 transition-all duration-300 group">
              <span className="text-lg">⚽</span>
              <span className="text-primary font-semibold text-sm sm:text-base group-hover:text-primary/90">
                Viví el Mundial en ISMISA
              </span>
              <span className="text-muted-foreground text-xs sm:text-sm">
                — Próximo: Ecuador vs Curazao · Sáb 21:00
              </span>
            </div>
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed"
        >
          Billar, tragos artesanales y música en vivo.
          <br className="hidden sm:block" /> El rooftop donde Guayaquil vive la
          noche.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={whatsappLink(
              WHATSAPP_ISMISA,
              "Hola ISMISA! Quisiera hacer una reserva 🍸"
            )}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base px-8 h-14 glow-gold transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Reservar Mesa
            </Button>
          </a>
          <a href="#galeria">
            <Button
              size="lg"
              variant="outline"
              className="border-primary/40 text-primary hover:bg-primary/10 font-semibold text-base px-8 h-14 transition-all duration-300"
            >
              Ver Ambiente
              <ChevronDown className="w-4 h-4 ml-2 animate-bounce" />
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}

// ─── Today's match data type ──────────────────────────
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

// ─── World Cup Section (auto-refreshing) ─────────────
function WorldCupSection() {
  const [matches, setMatches] = useState<MatchData[]>(ecuadorMatchesFallback);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [liveSource, setLiveSource] = useState<string>("fallback");

  // Today's matches state
  const [todayMatches, setTodayMatches] = useState<TodayMatch[]>([]);
  const [todayDate, setTodayDate] = useState<string>("");
  const [todaySource, setTodaySource] = useState<string>("fallback");

  // Fetch Ecuador's group scores
  const fetchScores = async () => {
    try {
      const res = await fetch("/api/scores");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (data.matches && Array.isArray(data.matches) && data.matches.length > 0) {
        setMatches(data.matches);
        setLastUpdated(data.updated);
        setLiveSource(data.source);
      }
    } catch {
      // Keep fallback data on error
    }
  };

  // Fetch today's matches
  const fetchTodayMatches = async () => {
    try {
      const res = await fetch("/api/today-matches");
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setTodayMatches(data.matches || []);
      setTodayDate(data.date || "");
      setTodaySource(data.source || "fallback");
    } catch {
      // Keep empty on error
    }
  };

  // Auto-fetch on mount + every 3 minutes
  useEffect(() => {
    fetchScores();
    fetchTodayMatches();
    const interval = setInterval(() => {
      fetchScores();
      fetchTodayMatches();
    }, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Check if any Ecuador match is today
  const ecuadorToday = todayMatches.some(
    (m) => m.home === "Ecuador" || m.away === "Ecuador"
  );

  return (
    <section id="mundial" className="py-20 sm:py-28 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeInSection>
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              <span className="mr-1.5">⚽</span>
              Mundial 2026 — Grupo E
            </Badge>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold">
              Viví el <span className="text-gold-gradient">Mundial</span> en ISMISA
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Pantalla gigante, tragos de selección y el ambiente que se siente
            </p>
          </div>
        </FadeInSection>

        {/* Ecuador's Group E Match cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {matches.map((match, i) => (
            <FadeInSection key={match.title} delay={i * 0.1}>
              <Card className={`group border-border/50 bg-card hover:border-primary/30 transition-all duration-300 h-full ${match.played ? "opacity-70" : "hover:shadow-lg hover:shadow-primary/10"}`}>
                <CardContent className="p-5 sm:p-6 text-center">
                  <p className="text-primary text-sm font-semibold mb-2">
                    {match.date}
                  </p>
                  <h3 className="font-semibold text-foreground text-base mb-1">
                    {match.title}
                  </h3>
                  <p className="text-muted-foreground text-xs mb-3">
                    {match.venue}
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm text-primary font-medium">
                      {match.time} Ecuador
                    </span>
                  </div>
                  {match.played && match.result && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">Resultado</span>
                      <p className="text-foreground font-bold text-lg">{match.result}</p>
                    </div>
                  )}
                  {!match.played && (
                    <div className="mt-3 pt-3 border-t border-border/30">
                      <a
                        href={whatsappLink(
                          WHATSAPP_ISMISA,
                          `Hola ISMISA! Quiero reservar mesa para ${match.title} ⚽`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold w-full glow-gold"
                        >
                          <MessageCircle className="w-4 h-4 mr-1.5" />
                          Reservar mesa
                        </Button>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>

        {/* ─── Partidos de Hoy ────────────────────────────── */}
        {todayMatches.length > 0 && (
          <FadeInSection delay={0.3}>
            <div className="mt-14 max-w-3xl mx-auto">
              {/* Section header */}
              <div className="text-center mb-6">
                <Badge
                  variant="outline"
                  className="mb-3 border-primary/30 text-primary"
                >
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Partidos de Hoy
                </Badge>
                <h3 className="font-[var(--font-playfair)] text-xl sm:text-2xl font-bold text-foreground">
                  {todayDate && (
                    <span className="capitalize">{todayDate}</span>
                  )}
                </h3>
              </div>

              {/* Match list */}
              <Card className="border-border/50 bg-card overflow-hidden">
                <CardContent className="p-0">
                  <div className="divide-y divide-border/30">
                    {todayMatches.map((match, i) => {
                      const isEcuador = match.home === "Ecuador" || match.away === "Ecuador";
                      return (
                        <div
                          key={`${match.home}-${match.away}-${i}`}
                          className={`px-4 sm:px-6 py-3.5 transition-colors ${
                            isEcuador
                              ? "bg-primary/10 hover:bg-primary/15"
                              : "hover:bg-secondary/30"
                          }`}
                        >
                          {/* Mobile layout (stacked) */}
                          <div className="flex sm:hidden items-center gap-3">
                            {/* Time / Live badge */}
                            <div className="shrink-0 w-12 text-center">
                              {match.status === "live" ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                  VIVO
                                </span>
                              ) : (
                                <span className="text-xs text-primary font-semibold">
                                  {match.time}
                                </span>
                              )}
                            </div>

                            {/* Teams + Score (stacked) */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-base">{match.homeFlag}</span>
                                  <span className={`text-sm font-semibold truncate ${isEcuador && match.home === "Ecuador" ? "text-primary" : "text-foreground"}`}>
                                    {match.home}
                                  </span>
                                </div>
                                {match.score && (
                                  <span className={`font-bold text-sm shrink-0 ${match.status === "live" ? "text-red-400" : "text-foreground"}`}>
                                    {match.score.split("-")[0]}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between gap-2 mt-0.5">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-base">{match.awayFlag}</span>
                                  <span className={`text-sm font-semibold truncate ${isEcuador && match.away === "Ecuador" ? "text-primary" : "text-foreground"}`}>
                                    {match.away}
                                  </span>
                                </div>
                                {match.score ? (
                                  <span className={`font-bold text-sm shrink-0 ${match.status === "live" ? "text-red-400" : "text-foreground"}`}>
                                    {match.score.split("-")[1]}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-muted-foreground shrink-0">
                                    {match.time}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Group badge */}
                            <span className="text-[10px] text-muted-foreground shrink-0">
                              {match.group}
                            </span>
                          </div>

                          {/* Desktop layout (horizontal) */}
                          <div className="hidden sm:flex items-center">
                            {/* Time */}
                            <div className="w-16 shrink-0 text-center">
                              {match.status === "live" ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-red-400">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                  VIVO
                                </span>
                              ) : (
                                <span className="text-sm text-primary font-semibold">
                                  {match.time}
                                </span>
                              )}
                            </div>

                            {/* Teams + Score */}
                            <div className="flex-1 min-w-0 flex items-center justify-center gap-3">
                              {/* Home team */}
                              <div className="flex items-center gap-1.5 justify-end flex-1 min-w-0">
                                <span className={`text-sm font-semibold truncate ${isEcuador && match.home === "Ecuador" ? "text-primary" : "text-foreground"}`}>
                                  {match.home}
                                </span>
                                <span className="text-lg">{match.homeFlag}</span>
                              </div>

                              {/* Score or vs */}
                              <div className="w-16 shrink-0 text-center">
                                {match.score ? (
                                  <span className={`font-bold text-base ${match.status === "live" ? "text-red-400" : "text-foreground"}`}>
                                    {match.score}
                                  </span>
                                ) : (
                                  <span className="text-xs text-muted-foreground font-medium">vs</span>
                                )}
                              </div>

                              {/* Away team */}
                              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                                <span className="text-lg">{match.awayFlag}</span>
                                <span className={`text-sm font-semibold truncate ${isEcuador && match.away === "Ecuador" ? "text-primary" : "text-foreground"}`}>
                                  {match.away}
                                </span>
                              </div>
                            </div>

                            {/* Group */}
                            <div className="w-20 shrink-0 text-right">
                              <span className="text-xs text-muted-foreground">
                                {match.group}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Ecuador today CTA */}
              {ecuadorToday && (
                <div className="text-center mt-5">
                  <a
                    href={whatsappLink(
                      WHATSAPP_ISMISA,
                      "Hola ISMISA! Quiero reservar mesa para el partido de Ecuador hoy ⚽🇪🇨"
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-gold transition-all duration-300 hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      🇪🇨 Reservar para Ecuador hoy
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </FadeInSection>
        )}

        {/* No matches today message */}
        {todayMatches.length === 0 && todaySource !== "fallback" && (
          <FadeInSection delay={0.3}>
            <div className="mt-12 text-center max-w-md mx-auto">
              <Card className="border-border/50 bg-card">
                <CardContent className="p-6">
                  <p className="text-3xl mb-2">🏐</p>
                  <p className="text-muted-foreground text-sm">
                    Hoy no hay partidos del Mundial
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    Volvé mañana para más acción ⚽
                  </p>
                </CardContent>
              </Card>
            </div>
          </FadeInSection>
        )}

        {/* CTA + live indicator */}
        <FadeInSection delay={0.4}>
          <div className="text-center mt-10">
            <p className="text-muted-foreground text-sm mb-4">
              🇪🇨 Cada partido de Ecuador · Pantalla gigante · Tragos mundialistas
            </p>
            {/* Live status indicator */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className={`inline-block w-2 h-2 rounded-full ${liveSource === "live" || todaySource === "live" ? "bg-green-500 animate-pulse" : liveSource === "cache" || todaySource === "cache" ? "bg-yellow-500" : "bg-muted-foreground/50"}`} />
              <span className="text-xs text-muted-foreground">
                {(liveSource === "live" || todaySource === "live")
                  ? "Resultados en vivo"
                  : (liveSource === "cache" || todaySource === "cache")
                  ? "Última actualización cacheada"
                  : "Datos por defecto"}
                {lastUpdated && (
                  <span className="ml-1">
                    · {new Date(lastUpdated).toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </span>
            </div>
            <a
              href={whatsappLink(
                WHATSAPP_ISMISA,
                "Hola ISMISA! Quiero reservar mesa para el próximo partido de Ecuador ⚽🇪🇨"
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-gold transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Reservar para el Mundial
              </Button>
            </a>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── Gallery Section ─────────────────────────────────
function GallerySection() {
  return (
    <section id="galeria" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              <TreePalm className="w-3.5 h-3.5 mr-1.5" />
              Nuestro Espacio
            </Badge>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="text-gold-gradient">Vive</span> la Experiencia
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Un rooftop diseñado para noches memorables
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {galleryItems.map((item, i) => (
            <FadeInSection key={item.title} delay={i * 0.1}>
              <Card className="group relative overflow-hidden border-border/50 bg-card hover:border-primary/30 transition-all duration-500 cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.12_0.008_80)] via-[oklch(0.12_0.008_80)]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-5 h-5 text-primary" />
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold text-primary">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-foreground/80 text-sm">{item.description}</p>
                </div>
                {/* Always visible label */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-[oklch(0.12_0.008_80)]/80 backdrop-blur-sm text-primary border-primary/30">
                    {item.title}
                  </Badge>
                </div>
                <CardContent className="p-4 sm:hidden">
                  <div className="flex items-center gap-2">
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="font-semibold text-sm">{item.title}</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Events Section ──────────────────────────────────
function EventsSection() {
  return (
    <section id="eventos" className="py-20 sm:py-28 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              <Music className="w-3.5 h-3.5 mr-1.5" />
              Agenda Musical
            </Badge>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold">
              Música en <span className="text-gold-gradient">Vivo</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Cada fin de semana, una razón nueva para visitarnos
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {upcomingEvents.map((event, i) => (
            <FadeInSection key={event.title} delay={i * 0.1}>
              <Card className="group border-border/50 bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary mb-0.5" />
                      <span className="text-xs text-primary font-medium">
                        {event.date.split(" ").slice(0, 1)}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        {event.date.split(" ").slice(1).join(" ")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-base group-hover:text-primary transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mt-1">
                        {event.artist}
                      </p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs text-primary font-medium">
                          {event.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={0.4}>
          <div className="text-center mt-10">
            <a
              href={whatsappLink(
                WHATSAPP_ISMISA,
                "Hola ISMISA! Quisiera reservar mesa para un evento 🎶"
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold glow-gold transition-all duration-300 hover:scale-105"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Reservar para Evento
              </Button>
            </a>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── Menu Section ────────────────────────────────────
function MenuSection() {
  return (
    <section id="menu" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              <Wine className="w-3.5 h-3.5 mr-1.5" />
              Carta de Tragos
            </Badge>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold">
              Nuestros <span className="text-gold-gradient">Tragos</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">
              Cócteles artesanales con alma ecuatoriana
            </p>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {menuItems.map((item, i) => (
            <FadeInSection key={item.name} delay={i * 0.08}>
              <Card className="group border-border/50 bg-card hover:border-primary/30 transition-all duration-300 h-full">
                <CardContent className="p-5 sm:p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-[var(--font-playfair)] text-lg font-semibold group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <Badge
                      variant="outline"
                      className="border-primary/30 text-primary text-[10px] shrink-0"
                    >
                      {item.tag}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </FadeInSection>
          ))}
        </div>

        <FadeInSection delay={0.3}>
          <div className="text-center mt-10">
            <p className="text-muted-foreground text-sm">
              Consulta nuestra carta completa en el local
            </p>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

// ─── About Section ───────────────────────────────────
function AboutSection() {
  return (
    <section id="nosotros" className="py-20 sm:py-28 bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <FadeInSection>
            <div className="relative">
              <img
                src="/images/about.png"
                alt="Barman preparando cócteles en ISMISA Rooftop"
                className="rounded-2xl shadow-2xl shadow-black/30 w-full"
                loading="lazy"
              />
              {/* Decorative border */}
              <div className="absolute -inset-1 rounded-2xl border border-primary/20 pointer-events-none" />
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div>
              <Badge
                variant="outline"
                className="mb-4 border-primary/30 text-primary"
              >
                Sobre Nosotros
              </Badge>
              <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl font-bold mb-6">
                Más que un bar, una{" "}
                <span className="text-gold-gradient">experiencia</span>
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  <strong className="text-foreground">ISMISA</strong> nació de
                  la pasión por crear un espacio donde la noche de Guayaquil
                  encuentra su mejor expresión. Nuestro rooftop es el lugar donde
                  los amigos se reúnen, la música se siente y cada trago cuenta
                  una historia.
                </p>
                <p>
                  Con mesas de billar profesionales, una carta de cócteles
                  artesanales pensada para sorprender, y música en vivo cada fin
                  de semana, nos hemos convertido en el punto de encuentro de
                  quienes buscan algo más que una noche cualquiera.
                </p>
                <p>
                  Ubicados en Guayaquil, abrimos de jueves a domingo para
                  ofrecerte la mejor atmósfera nocturna de la ciudad.
                </p>
              </div>
              <div className="flex gap-3 mt-8">
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de ISMISA"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                </a>
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de ISMISA"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                </a>
                <a
                  href={whatsappLink(
                    WHATSAPP_ISMISA,
                    "Hola ISMISA! Quiero saber más sobre el rooftop 🍸"
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </a>
                <a
                  href={`mailto:${EMAIL_ISMISA}`}
                  aria-label="Email de ISMISA"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50"
                  >
                    <Mail className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// ─── Location & Hours Section ────────────────────────
function LocationSection() {
  return (
    <section id="ubicacion" className="py-20 sm:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInSection>
          <div className="text-center mb-14">
            <Badge
              variant="outline"
              className="mb-4 border-primary/30 text-primary"
            >
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Encuéntranos
            </Badge>
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="text-gold-gradient">Ubicación</span> y Horarios
            </h2>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Map */}
          <FadeInSection>
            <Card className="overflow-hidden border-border/50 bg-card h-full">
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full min-h-[300px]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3986.8!2d-79.93!3d-2.17!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x902f72612bca3917%3A0x1a98508e5b51e4e5!2sGuayaquil%2C%20Ecuador!5e0!3m2!1ses!2sec!4v1700000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de ISMISA Rooftop en Guayaquil"
                  className="w-full h-full"
                />
              </div>
            </Card>
          </FadeInSection>

          {/* Hours & Info */}
          <FadeInSection delay={0.2}>
            <div className="space-y-6">
              {/* Address */}
              <Card className="border-border/50 bg-card">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Dirección
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {ADDRESS}
                      </p>
                      <a
                        href={whatsappLink(
                          WHATSAPP_ISMISA,
                          "Hola ISMISA! Me pueden enviar la dirección exacta?"
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-primary text-sm mt-2 hover:underline"
                      >
                        Pedir dirección exacta
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-border/50 bg-card">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Email
                      </h3>
                      <a
                        href={`mailto:${EMAIL_ISMISA}`}
                        className="text-primary text-sm hover:underline"
                      >
                        {EMAIL_ISMISA}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hours */}
              <Card className="border-border/50 bg-card">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">
                        Horarios
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        Abierto fines de semana
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {hours.map((h) => (
                      <div
                        key={h.day}
                        className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
                      >
                        <span className="text-foreground font-medium text-sm">
                          {h.day}
                        </span>
                        <span className="text-primary text-sm font-semibold">
                          {h.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <a
                href={whatsappLink(
                  WHATSAPP_ISMISA,
                  "Hola ISMISA! Quisiera hacer una reserva 🍸"
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12 text-base glow-gold transition-all duration-300 hover:scale-[1.02]">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Reservar por WhatsApp
                </Button>
              </a>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-secondary/30 border-t border-border/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-ismisa.png"
              alt="ISMISA Logo"
              className="w-10 h-10 rounded-full border border-primary/30"
            />
            <div className="text-center sm:text-left">
              <h3 className="font-[var(--font-playfair)] text-xl font-bold text-gold-gradient">
                ISMISA
              </h3>
              <p className="text-muted-foreground text-sm mt-0.5">
                Rooftop Bar en Guayaquil — Billar, Tragos y Música en Vivo
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${EMAIL_ISMISA}`}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div className="section-divider my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ISMISA. Todos los derechos
            reservados.
          </p>
          <p>
            Hecho por{" "}
            <a
              href="https://jimbra.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Jimbra
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Page ───────────────────────────────────────
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(!menuOpen)} />
      <main className="flex-1">
        <HeroSection />
        <div className="section-divider" />
        <WorldCupSection />
        <div className="section-divider" />
        <GallerySection />
        <div className="section-divider" />
        <EventsSection />
        <div className="section-divider" />
        <MenuSection />
        <div className="section-divider" />
        <AboutSection />
        <div className="section-divider" />
        <LocationSection />
      </main>
      <Footer />
      <FloatingWhatsApp hidden={menuOpen} />
    </div>
  );
}
