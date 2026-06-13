import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ServiceWorkerRegistrar } from "@/components/service-worker-registrar";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#1a1408",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Ismisa Wellington | Terraza Bar en Guayaquil — Billar, Tragos y Música en Vivo",
  description:
    "Terraza bar premium en Guayaquil con billar, tragos artesanales y música en vivo. El mejor ambiente nocturno los fines de semana. ¡Reserva tu mesa por WhatsApp!",
  keywords: [
    "bar Guayaquil",
    "terraza Guayaquil",
    "billar Guayaquil",
    "música en vivo Guayaquil",
    "tragos artesanales",
    "bar nocturno Ecuador",
    "Ismisa Wellington",
    "terraza bar",
  ],
  authors: [{ name: "Jimbra", url: "https://jimbra.net" }],
  creator: "Jimbra",
  publisher: "Jimbra",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/icon-192x192.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Ismisa Wellington | Terraza Bar en Guayaquil",
    description:
      "Terraza bar premium en Guayaquil con billar, tragos artesanales y música en vivo. ¡Reserva tu mesa!",
    url: "https://ismisa.jimbra.net",
    siteName: "Ismisa Wellington",
    locale: "es_EC",
    type: "website",
    images: [
      {
        url: "/images/hero.png",
        width: 1344,
        height: 768,
        alt: "Ismisa Wellington - Terraza Bar en Guayaquil",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ismisa Wellington | Terraza Bar en Guayaquil",
    description:
      "Terraza bar premium con billar, tragos artesanales y música en vivo. ¡Reserva tu mesa!",
    images: ["/images/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Ismisa" />
      </head>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  );
}
