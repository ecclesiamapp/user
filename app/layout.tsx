import type { Metadata, Viewport } from "next";
import { Sora, Suez_One } from "next/font/google";
import "./globals.css";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const suezOne = Suez_One({
  variable: "--font-suez-one",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#8B1E22",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Catedral do Sagrado Coração de Jesus • Diocese de Colatina",
  description: "Portal Oficial da Catedral do Sagrado Coração de Jesus - Horários de Missas, CEBs, Confissões e Dízimo PIX.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Catedral",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${suezOne.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}

