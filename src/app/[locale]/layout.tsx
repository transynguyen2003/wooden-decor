import React from "react";
import { notFound } from "next/navigation";
import { isValidLocale, getDictionary, Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import Navbar from "@/components/client/Navbar";
import Footer from "@/components/client/Footer";
import FloatingContact from "@/components/client/FloatingContact";
import BackgroundMusic from "@/components/client/BackgroundMusic";
import AIChatbot from "@/components/client/AIChatbot";

export const revalidate = 60;

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export default async function ClientLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const siteConfig = await getSiteConfig(locale);

  return (
    <div className="theme-canvas min-h-screen flex flex-col bg-wood-white text-wood-charcoal transition-colors duration-300">
      <Navbar
        locale={locale}
        dict={dict.nav}
        brandName={siteConfig.brandName}
        logoUrl={siteConfig.logoUrl}
        phone={siteConfig.phone}
      />
      <main className="flex-1">{children}</main>
      <Footer locale={locale} siteConfig={siteConfig} dict={dict} />
      <FloatingContact
        phone={siteConfig.phone}
        zalo={siteConfig.zalo}
        locale={locale}
      />
      <AIChatbot
        locale={locale}
        brandName={siteConfig.brandName}
        phone={siteConfig.phone}
      />
      <BackgroundMusic locale={locale} />
    </div>
  );
}
