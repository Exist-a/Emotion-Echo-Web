// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      // 在这里添加 link 标签
      link: [
        // 字体预加载标签
        {
          rel: "preload",
          href: "/fonts/LuoGuoChengMaoBiXiaoXingJianTi-2.ttf",
          as: "font",
          type: "font/ttf",
          crossorigin: "",
          media: "all",
        },
      ],
      // title: "你的项目标题",
      // meta: [{ name: "description", content: "项目描述" }]
    },
  },
  compatibilityDate: "2025-07-15",
  modules: ["@element-plus/nuxt", "@pinia/nuxt", "nuxt-echarts"],
  devtools: { enabled: true },
  css: ["~/assets/scss/global.scss"],
  elementPlus: {
    defaultLocale: "zh-cn",
  },
  routeRules: {
    "/": { redirect: { to: "/chat", statusCode: 301 } },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "~/assets/scss/variables.scss" as *;`,
        },
      },
    },
  },
  echarts: {
    renderer: ["canvas", "svg"],
    charts: ["BarChart", "LineChart", "PieChart"],
    components: [
      "DatasetComponent",
      "GridComponent",
      "TooltipComponent",
      "LegendComponent",
      "TitleComponent",
    ],
  },
});
