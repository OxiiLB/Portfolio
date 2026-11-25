import { LOCALES } from "~/data/profile";

// One URL per language, each listing every language version (hreflang), plus
// x-default pointing at English. Keep in step with the i18n locales in
// nuxt.config.ts: English at /, the others at /<code>.
const HREFLANG: Record<string, string> = { en: "en-US", fr: "fr-FR" };

export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public;
  const base = siteUrl || getRequestURL(event).origin;
  const path = (code: string) => (code === "en" ? `${base}/` : `${base}/${code}`);
  const alternates = [
    ...LOCALES.map((c) => `    <xhtml:link rel="alternate" hreflang="${HREFLANG[c] ?? c}" href="${path(c)}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${path("en")}"/>`,
  ].join("\n");
  const urls = LOCALES.map((c) => `  <url>\n    <loc>${path(c)}</loc>\n${alternates}\n  </url>`).join("\n");

  setHeader(event, "content-type", "application/xml; charset=utf-8");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
});
