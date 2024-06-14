// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxthub/core", "@nuxt/eslint", "@nuxt/ui", "nuxt-auth-utils"],
  hub: {
    database: true,
    remote: true,
  },
  $development: {
    nitro: {
      storage: {
        matchesCache: {
          driver: "fs",
          base: "matchesCache",
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      api: process.env.API || "",
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
});
