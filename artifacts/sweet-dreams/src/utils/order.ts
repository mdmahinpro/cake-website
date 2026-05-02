import type { Settings } from "../store/useStore";

export function buildWhatsAppUrl(
  number: string,
  caption: string,
  category?: string
): string {
  const msg = encodeURIComponent(
    `Cake Order Request!\n\nI want to order a cake.\nCake: ${caption}\nCategory: ${category || "Custom"}\n\nPlease let me know the price and availability. Thank you!`
  );
  return `https://wa.me/${number}?text=${msg}`;
}

export function buildFacebookUrl(pageUrl: string, _caption: string): string {
  const pageName = pageUrl
    .replace(/https?:\/\/(www\.)?facebook\.com\//, "")
    .replace(/\/$/, "");
  return `https://m.me/${pageName}`;
}

export function openOrderChannel(
  settings: Settings,
  caption: string,
  category?: string
): void {
  if (settings.orderChannel === "whatsapp") {
    window.open(
      buildWhatsAppUrl(settings.whatsappNumber, caption, category),
      "_blank"
    );
  } else {
    window.open(buildFacebookUrl(settings.facebookPageUrl, caption), "_blank");
  }
}
