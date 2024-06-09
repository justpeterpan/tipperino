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
  },
  nitro: {
    experimental: {
      // Enable Server API documentation within NuxtHub
      openAPI: true,
    },
  },
});
