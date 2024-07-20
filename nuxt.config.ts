// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: "light",
  },
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: [
    "@unocss/nuxt",
    "@nuxt/ui",
    [
      "@nuxtjs/i18n",
      {
        i18n: {
          vueI18n: "./i18n.config.ts",
        },
      },
    ],
  ],
  runtimeConfig: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },
  ui: {
    icons: ["mdi", "heroicons"],
  },
});
