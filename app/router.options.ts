// app/router.options.ts
import type { RouterConfig } from "@nuxt/schema";

export default {
  // 自定义路由表（覆盖 Nuxt 自动生成的路由）
  routes: (_routes) => [
    // 根路由：重定向到 /chat（核心需求）
    {
      name: "root",
      path: "/",
      redirect: "/chat", // 直接重定向到聊天页
    },

    // 聊天页（需要登录校验）
    {
      name: "chat",
      path: "/chat",
      component: () => import("~/pages/chat/index.vue"),
      meta: { requiresAuth: true }, // 标记需要登录
    },

    // 登录页
    {
      name: "login",
      path: "/login",
      component: () => import("~/pages/login/index.vue"),
    },

    // 忘记密码（父路由）- 嵌套子路由
    {
      name: "login-forget",
      path: "/login/forget",
      component: () => import("~/pages/login/forget/index.vue"),
      children: [
        {
          name: "login-forget-verify",
          path: "verify",
          component: () => import("~/pages/login/forget/verify.vue"),
        },
        {
          name: "login-forget-modify",
          path: "modify",
          meta: {
            middleware: "forget-pwd",
          },
          component: () => import("~/pages/login/forget/modify.vue"),
        },
        {
          name: "login-forget/success",
          path: "success",
          meta: {
            middleware: "forget-pwd",
          },
          component: () => import("~/pages/login/forget/success.vue"),
        },
      ],
    },
  ],

  // 可选：Vue Router 全局配置
  strict: true, // 严格匹配路径（不忽略末尾斜杠）
  sensitive: false, // 路径大小写不敏感
} satisfies RouterConfig;
