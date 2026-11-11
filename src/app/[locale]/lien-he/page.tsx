import React from "react";
import { MapPin, Clock, Phone, Mail, MessageCircle } from "lucide-react";
import { getDictionary, isValidLocale, Locale } from "@/lib/i18n";
import { getSiteConfig } from "@/lib/settings";
import InquiryForm from "@/components/client/InquiryForm";

export const dynamic = "force-dynamic";

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
  const cleanZalo = siteConfig.zalo.replace(/\D/g, "") || cleanPhone.replace(/\D/g, "");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="bg-wood-cream rounded-3xl p-8 sm:p-12 border border-wood-light/50 space-y-3">
        <span className="text-xs uppercase tracking-[0.2em] text-wood-medium font-semibold">
          {siteConfig.brandName}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-wood-dark">
          {dict.nav.contact}
        </h1>
        <p className="text-sm sm:text-base text-wood-charcoal/80 max-w-2xl">
          {dict.home.contactBannerSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cột thông tin liên hệ & bản đồ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-wood-white rounded-2xl p-6 sm:p-8 border border-wood-light/60 space-y-5 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-wood-dark">
              {siteConfig.brandName}
            </h2>

            <div className="flex items-start gap-3.5 text-sm">
              <MapPin className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-wood-dark">{dict.footer.address}</p>
                <p className="text-wood-charcoal/80 mt-0.5">{siteConfig.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-sm">
              <Clock className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-wood-dark">{dict.footer.openingHours}</p>
                <p className="text-wood-charcoal/80 mt-0.5">{siteConfig.openingHours}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 text-sm">
              <Phone className="w-5 h-5 text-wood-medium shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-wood-dark">{dict.footer.hotline}</p>
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
                <p className="font-semibold text-wood-dark">Email</p>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-wood-charcoal/80 hover:text-wood-dark"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>

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
                <MessageCircle className="w-4 h-4 text-wood-medium" />
                <span>{dict.nav.chatZalo}</span>
              </a>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-wood-light/60 h-72 bg-wood-cream">
            <iframe
              src={siteConfig.mapEmbedUrl}
              title="Wooden Decor Map"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* Cột Form gửi yêu cầu tư vấn */}
        <div className="lg:col-span-7">
          <InquiryForm dict={dict.inquiry} />
        </div>
      </div>
    </div>
  );
}
