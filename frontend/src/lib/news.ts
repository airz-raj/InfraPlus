import type { Locale } from "@/lib/i18n";

export type NewsItem = {
  id: string;
  locale: Locale;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  imageUrl: string;
  imageAlt: string;
};

const NEWS: NewsItem[] = [
  {
    id: "en-water",
    locale: "en",
    title: "Ward pumps scheduled for overnight maintenance",
    summary:
      "Municipal water board crews will flush and repair community pumps in low-pressure zones after repeated citizen reports.",
    source: "City Utilities Desk",
    publishedAt: "2026-09-26",
    imageUrl:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Water infrastructure pipes at a treatment facility",
  },
  {
    id: "en-power",
    locale: "en",
    title: "Grid upgrade aims to cut evening outages",
    summary:
      "A feeder-line reinforcement project is underway in high-complaint districts, aligned with national electrification budgets.",
    source: "Energy Ministry Brief",
    publishedAt: "2026-09-24",
    imageUrl:
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "High-voltage power lines against a dusk sky",
  },
  {
    id: "hi-road",
    locale: "hi",
    title: "मानसून के बाद सड़क मरम्मत अभियान",
    summary:
      "नागरिक शिकायतों वाले इलाकों में गड्ढे भरे जाएँगे। रिपोर्ट भेजने से प्राथमिकता तय करने में मदद मिलती है।",
    source: "नगर निगम अपडेट",
    publishedAt: "2026-09-25",
    imageUrl:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "शहर की सड़क पर निर्माण कार्य",
  },
  {
    id: "hi-water",
    locale: "hi",
    title: "पेयजल टैंकर रात्रि मार्ग पर",
    summary:
      "सूखे वार्डों में रात के समय अतिरिक्त टैंकर चलाए जाएँगे जब तक पंप लाइन बहाल नहीं होती।",
    source: "जल बोर्ड",
    publishedAt: "2026-09-23",
    imageUrl:
      "https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=800&q=80",
    imageAlt: "पानी की टंकी और पाइपलाइन",
  },
  {
    id: "pt-transit",
    locale: "bn",
    title: "Obras em corredor de ônibus após relatos de buracos",
    summary:
      "A prefeitura priorizou o recapeamento onde a densidade de reclamações cidadãs mais cresceu neste trimestre.",
    source: "Secretaria de Mobilidade",
    publishedAt: "2026-09-25",
    imageUrl:
      "https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Avenida urbana com ônibus e tráfego",
  },
  {
    id: "pt-power",
    locale: "mr",
    title: "Reforço da rede reduz apagões no fim da tarde",
    summary:
      "Investimento em transformadores locais segue o mapa de demanda gerado pelos relatos de voz e texto.",
    source: "Agência de Energia",
    publishedAt: "2026-09-22",
    imageUrl:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Painéis solares e rede elétrica",
  },
];

export function getLocalizedNews(locale: Locale): NewsItem[] {
  const local = NEWS.filter((item) => item.locale === locale);
  return local.length > 0 ? local : NEWS.filter((item) => item.locale === "en");
}
