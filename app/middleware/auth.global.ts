export default defineNuxtRouteMiddleware((to, from) => {
  // 1. 配置无需校验的路由（核心：排除登录页，可扩展其他白名单路由）
  const whiteList = ["/login"]; // 白名单路由，无需校验令牌
  const isInWhiteList =
    whiteList.includes(to.path) || to.path.startsWith("/login/"); // 支持登录页子路由（如 /login/reset）

  // 2. 获取令牌（根据你的存储方式选择，推荐 HttpOnly Cookie）
  const token = useCookie("token").value; // Cookie 存储（Nuxt 内置，支持 SSR）
  // const token = usePiniaStore().token // 若存在 Pinia 内存中（需确保 SSR 兼容）
  // const token = useLocalStorage('token').value // 不推荐，仅作示例

  // 3. 核心校验逻辑
  if (isInWhiteList) {
    // 白名单路由（如登录页）：直接放行
    return;
  }

  // if (!token) {
  //   // 非白名单路由 + 无令牌：重定向到登录页
  //   // 使用 navigateTo 而非 Vue Router 的 next()，Nuxt 推荐且支持 SSR
  //   return navigateTo("/login", {
  //     replace: true, // 替换历史记录，避免用户回退时重复触发重定向
  //   });
  // }

  // 有令牌：正常放行（无需返回值，Nuxt 会自动继续导航）

  // 可选优化：已登录用户访问登录页，重定向到首页/核心页（如 /chat）
  if (isInWhiteList && token) {
    return navigateTo("/chat", { replace: true });
  }
});
