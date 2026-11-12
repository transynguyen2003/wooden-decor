import React from "react";
import type { Metadata } from "next";
import { MapPin, Phone, Mail } from "lucide-react";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import InquiryForm from "@/components/client/InquiryForm";
import LazyMap from "@/components/client/LazyMap";
import { ZaloIcon } from "@/components/client/SocialIcons";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";

  const title =
    locale === "en"
      ? "Contact & Custom Wood Decor Orders | Wooden Decor"
      : "Liên Hệ Đặt Đóng Đồ Decor Gỗ Thủ Công | Wooden Decor";

  const description =
    locale === "en"
      ? "Contact Wooden Decor workshop in Bac Ninh via Hotline/Zalo 0328990001 for custom handcrafted wood decor and bespoke solid wood furniture orders."
      : "Liên hệ xưởng Wooden Decor Thiên An tại Bắc Ninh qua Hotline/Zalo 0328990001 để đặt đóng đồ decor gỗ thủ công, nội thất gỗ tự nhiên theo kích thước.";

  return buildPageMetadata({
    locale,
    path: "/lien-he",
    title,
    description,
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isValidLocale(rawLocale) ? rawLocale : "vi";
  const dict = getDictionary(locale);
  const siteConfig = await getSiteConfig(locale);

  const cleanPhone = siteConfig.phone.replace(/\s+/g, "");
  const cleanZalo =
    siteConfig.zalo.replace(/\D/g, "") || cleanPhone.replace(/\D/g, "");

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-16">
      <header className="bg-wood-cream rounded-3xl p-6 sm:p-10 lg:p-12 border border-wood-light/50 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
          {siteConfig.brandName}
        </span>
        <h1 className="font-serif text-[1.75rem] leading-tight sm:text-4xl lg:text-5xl font-bold text-wood-dark">
          {dict.nav.contact}
        </h1>
        <p className="text-sm sm:text-base text-wood-charcoal/80 max-w-2xl">
          {dict.home.contactBannerSubtitle}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Cột thông tin liên hệ & bản đồ */}
        <section
          aria-labelledby="contact-info-heading"
          className="lg:col-span-5 space-y-6"
        >
          <div className="bg-wood-white rounded-2xl p-5 sm:p-8 border border-wood-light/60 space-y-5 shadow-sm">
            <h2
              id="contact-info-heading"
              className="font-serif text-2xl font-bold text-wood-dark"
            >
              {siteConfig.brandName}
            </h2>

            <address className="not-italic space-y-5">
              <div className="flex items-start gap-3.5 text-sm">
                <MapPin className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-wood-dark">
                    {dict.footer.address}
                  </h3>
                  <p className="text-wood-charcoal/80 mt-0.5">
                    {siteConfig.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm">
                <Phone className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-wood-dark">
                    {dict.footer.hotline}
                  </h3>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-lg font-bold text-wood-medium hover:text-wood-dark"
                  >
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm">
                <Mail className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-wood-dark">Email</h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-wood-charcoal/80 hover:text-wood-dark break-all"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </address>

            <div className="pt-2 grid grid-cols-2 gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="flex items-center justify-center gap-2 bg-wood-dark hover:bg-wood-medium text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>{dict.nav.callNow}</span>
              </a>
              <a
                href={`https://zalo.me/${cleanZalo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-wood-cream hover:bg-wood-light/50 text-wood-dark border border-wood-medium text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                <ZaloIcon className="w-4 h-4 shrink-0" />
                <span>{dict.nav.chatZalo}</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-wood-light/60 h-72 bg-wood-cream">
            <LazyMap src={siteConfig.mapEmbedUrl} title="Wooden Decor Map" />
          </div>
        </section>

        {/* Cột Form gửi yêu cầu tư vấn */}
        <section
          aria-label="Form gửi yêu cầu tư vấn đặt đóng đồ gỗ"
          className="lg:col-span-7"
        >
          <InquiryForm dict={dict.inquiry} />
        </section>
      </div>
    </article>
  );
}
