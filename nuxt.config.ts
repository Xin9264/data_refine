// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // 设置兼容性日期
  compatibilityDate: '2025-02-17',
  
  // 开发工具
  devtools: { enabled: true },
  
  // 代理配置
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://54.190.160.106:7777',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
