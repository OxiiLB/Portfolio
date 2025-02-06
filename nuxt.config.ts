import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  modules: ["@nuxt/icon", "nuxt-graphql-request"],
  runtimeConfig: {
    githubToken: process.env.GITHUB_TOKEN,
    public: {
    },
  },
  graphql: {
    clients: {
      default: {
        endpoint: "https://api.github.com/graphql",
        options: {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        },
      },
    },
    includeNodeModules: true,
  },

  icon: {
    serverBundle: {
      collections: ["uil", "mdi"],
    },
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: "Portfolio",
      titleTemplate: "%s - Romain Giraud's Portfolio",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Portfolio",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=VT323&display=swap",
        },
      ],
    },
  },
});
