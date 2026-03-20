// plugins/axios.ts
import axios from 'axios';
import type{AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { defineNuxtPlugin, useRuntimeConfig } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  // 读取 Nuxt 环境配置（对应 .env 中的变量）
  const runtimeConfig = useRuntimeConfig();
  const { public: PublicRuntimeConfig } = runtimeConfig;

  // 1. 创建 Axios 核心实例（仅处理普通请求）
  const axiosInstance = axios.create({
    baseURL: PublicRuntimeConfig.API_BASE_URL as string, // 复用 .env 中的 NUXT_PUBLIC_API_BASE_URL
    timeout: Number(PublicRuntimeConfig.REQUEST_TIMEOUT) || 10000, // 复用 .env 中的超时时间
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      // 通用请求头（Axios/fetch 共用的基础头）
      'X-Request-From': 'nuxt-client',
    },
  });

  // 2. 请求拦截器：统一处理鉴权、请求头、loading 等
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig):InternalAxiosRequestConfig => {
      // 仅在客户端执行（避免服务端 SSR 时访问 localStorage 报错）
      if (import.meta.client) {
        // 统一添加鉴权 Token（和 fetch 流式请求复用同一套 Token 存储逻辑）
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // 可选：添加请求取消令牌（避免重复请求）
        // 这里可扩展：比如维护请求池，取消重复的 GET 请求
      }

      return config;
    },
    (error: AxiosError) => {
      // 请求拦截器错误处理（如参数错误、取消请求）
      return Promise.reject(error);
    }
  );

  // 3. 响应拦截器：统一解析响应、处理错误、格式化数据
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse): any => {
      // 普通请求自动解析响应体（无需手动取 data）
      const { data } = response;

      // 业务码统一处理（适配常见的后端返回格式：{ code, data, msg }）
      if (data.code === 200 || data.code === 0) {
        return data.data; // 只返回核心业务数据，简化组件使用
      } else {
        // 移除 hook 调用，仅保留 Promise.reject
        return Promise.reject(new Error(data.msg || '业务请求失败'));
      }
    },
    (error: AxiosError): Promise<never> => {
      // 网络/HTTP 错误统一处理
      let errorMsg = '网络异常，请稍后重试';
      if (error.response) {
        // HTTP 状态码错误（4xx/5xx）
        const status = error.response.status;
        switch (status) {
          case 401:
            errorMsg = '登录状态过期，请重新登录';
            // 401 统一跳转登录页（仅客户端）
            if (import.meta.client) {
              localStorage.removeItem('auth_token');
              const router = useRouter()
              router.push('/login');
            }
            break;
          case 403:
            errorMsg = '暂无权限访问该资源';
            break;
          case 404:
            errorMsg = '请求资源不存在';
            break;
          case 500:
            errorMsg = '服务器内部错误';
            break;
          default:
            errorMsg = `请求失败（${status}）`;
        }
      } else if (error.request) {
        // 请求已发送但无响应（网络超时/断网）
        errorMsg = '请求超时，请检查网络';
      }

      // 移除 hook 调用，仅保留 Promise.reject
      return Promise.reject(new Error(errorMsg));
    }
  );

  // 4. 挂载到 Nuxt 全局上下文，组件中可通过 useNuxtApp().$axios 访问
  nuxtApp.provide('axios', axiosInstance);

  return {
    provide: {
      axios: axiosInstance,
    },
  };
});