// app/router.options.ts
import type { RouterConfig } from "@nuxt/schema";

export default {
  // 自定义路由表（覆盖 Nuxt 自动生成的路由）
  routes: (_routes) => [
    // 根路由：重定向到 /chat（核心需求）
    {
      name: "root",
      path: "/",
      redirect: { name: "chat" }, // 直接重定向到聊天页
    },

    // 聊天页（需要登录校验）
    {
      name: "chat",
      path: "/chat",
      redirect: "/chat/conversation/new",
      component: () => import("~/pages/chat/index.vue"),
      children: [
        {
          name: "chat-conversation",
          path: "conversation",
          component: () => import("~/pages/chat/conversation/index.vue"),
          children: [
            {
              name: "chat-conversation-old",
              path: ":id",
              component: () => import("~/pages/chat/conversation/[id].vue"),
              props: (route) => ({
                id: route.params.id, // 无 id 时传 null
              }),
            },
            {
              name: "chat-conversation-new",
              path: "new",
              component: () => import("~/pages/chat/conversation/new.vue"),
            },
          ],
        },
        {
          name: "chat-user",
          path: "user",
          component: () => import("~/pages/chat/user.vue"),
        },
        {
          name: "chat-setting",
          path: "setting",
          component: () => import("~/pages/chat/setting.vue"),
        },
        {
          name: "chat-dashboard",
          path: "dashboard",
          component: () => import("~/pages/chat/dashboard/index.vue"),

          children: [
            {
              name: "chat-dashboard-dailyReport",
              path: "dailyReport",
              component: () => import("~/pages/chat/dashboard/dailyReport.vue"),
            },
            {
              name: "chat-dashboard-weeklyReport",
              path: "weeklyReport",
              component: () =>
                import("~/pages/chat/dashboard/weeklyReport.vue"),
            },
            {
              name: "chat-dashboard-monthlyReport",
              path: "monthlyReport",
              component: () =>
                import("~/pages/chat/dashboard/monthlyReport.vue"),
            },
            {
              name: "chat-dashboard-annualReport",
              path: "annualReport",
              component: () =>
                import("~/pages/chat/dashboard/annualReport.vue"),
            },
            //....
          ],
        },
      ],
      meta: { requiresAuth: true, layout: "nav" }, // 标记需要登录
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
