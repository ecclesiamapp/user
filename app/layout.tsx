import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans, Cormorant_Garamond, Cinzel, Suez_One } from "next/font/google";
import "./globals.css";
import { PwaInstallPrompt } from "@/components/pwa/PwaInstallPrompt";
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
      className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${cinzel.variable} ${suezOne.variable} font-sans h-full antialiased`}
    >
      <head>
        <style
          id="dynamic-brand-theming"
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --primary: ${colors.primary} !important;
                --primary-hover: ${colors.primary_hover} !important;
                --dash-bg: ${colors.background} !important;
                --dash-surface: ${colors.surface} !important;
                --dash-text-primary: ${colors.text_primary} !important;
                --dash-text-secondary: ${colors.text_secondary} !important;
                --brand-gold-500: ${colors.secondary} !important;
                --whatsapp: ${colors.action_pix} !important;
              }
            `.replace(/\s+/g, ' ').trim(),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Script
          id="suppress-extension-errors"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('unhandledrejection', function(event) {
                  var text = (event && event.reason) ? (event.reason.stack || event.reason.message || String(event.reason)) : '';
                  if (text.indexOf('chrome-extension://') !== -1 || text.indexOf('chrome:') !== -1 || text.indexOf('moz-extension://') !== -1) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                  }
                });
                window.addEventListener('error', function(event) {
                  var file = (event && event.filename) || '';
                  if (file.indexOf('chrome-extension://') !== -1 || file.indexOf('moz-extension://') !== -1) {
                    event.stopImmediatePropagation();
                    event.preventDefault();
                  }
                });
              }
            `,
          }}
        />
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}

