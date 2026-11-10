import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Cinzel, Suez_One } from "next/font/google";
import "./globals.css";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
import { ExtensionErrorSuppressor } from "@/components/layout/ExtensionErrorSuppressor";
import { AdminGlobalFloatingReturnBar } from "@/components/layout/AdminGlobalFloatingReturnBar";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { getParishBrandIdentity } from "@/lib/brand";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const brandIdentity = await getParishBrandIdentity();
  const colors = brandIdentity.colors;

  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${cinzel.variable} ${suezOne.variable} font-sans h-full antialiased overflow-x-hidden`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('ecclesiam_theme');
                  var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `.replace(/\s+/g, ' ').trim(),
          }}
        />
        <style
          id="dynamic-brand-theming"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary: ${colors.primary} !important;
                --primary-hover: ${colors.primary_hover} !important;
                --brand-gold-500: ${colors.secondary} !important;
                --whatsapp: ${colors.action_pix} !important;
              }
              :root:not(.dark) {
                --dash-bg: ${colors.background} !important;
                --dash-surface: ${colors.surface} !important;
                --dash-text-primary: ${colors.text_primary} !important;
                --dash-text-secondary: ${colors.text_secondary} !important;
              }
            `.replace(/\s+/g, ' ').trim(),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <ThemeProvider>
          <ExtensionErrorSuppressor />
          {children}
          <AdminGlobalFloatingReturnBar />
          <PwaInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}

