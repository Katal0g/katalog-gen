// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-07-20",
  css: ["~/assets/css/main.css"],
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    [
      "@nuxtjs/i18n",
      {
        i18n: {
          vueI18n: "./i18n.config.ts",
        },
      },
    ],
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@nuxtjs/mdc",
    "@nuxt/image",
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    MISTRAL_AGENT_ID: process.env.MISTRAL_AGENT_ID,
  },
  ui: {
    icons: ["mdi", "heroicons"],
  },
});
