// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxthub/core", "@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],

  hub: {
    database: true,
    remote: true,
  },

  runtimeConfig: {
    public: {
      api: process.env.API || "",
    },
    session: {
      maxAge: 60 * 60 * 24 * 7, // 1 week
    },
  },

  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },

  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
      ],
    },
  },

  compatibilityDate: "2024-07-09",
});