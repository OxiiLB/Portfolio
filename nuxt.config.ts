export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  modules: ["@nuxtjs/i18n"],

  i18n: {
    // English at /, French at /fr. UI strings live in i18n/locales/*.json;
    // profile content (projects, services…) is translated in data/profile.ts.
    locales: [
      { code: "en", language: "en-US", name: "English", file: "en.json" },
      { code: "fr", language: "fr-FR", name: "Français", file: "fr.json" },
    ],
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: { useCookie: true, cookieKey: "i18n_lang", redirectOn: "root" },
  },

  nitro: {
    // Markdown files in server/knowledge/ are bundled and indexed by the assistant.
    serverAssets: [{ baseName: "knowledge", dir: "./knowledge" }],
  },

  app: {
    head: {
      title: "Romain Giraud · Freelance AI engineer",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        {
          name: "description",
          content:
            "Romain Giraud, freelance AI engineer. RAG assistants, LLM agents and AI features for your business. Ask my assistant anything about my work.",
        },
        { name: "theme-color", content: "#09080F" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300..800&family=JetBrains+Mono:wght@400;500;600&display=swap",
        },
      ],
    },
  },
});
