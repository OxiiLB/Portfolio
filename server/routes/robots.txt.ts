// robots.txt is served here rather than from public/ so the Sitemap line can
// use the absolute site URL (NUXT_PUBLIC_SITE_URL).
export default defineEventHandler((event) => {
  const { siteUrl } = useRuntimeConfig(event).public;
  setHeader(event, "content-type", "text/plain; charset=utf-8");
  const lines = ["User-agent: *", "Allow: /", "Disallow: /api/"];
  if (siteUrl) lines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
  return lines.join("\n") + "\n";
});
