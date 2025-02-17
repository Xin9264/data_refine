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
  },

  // 模块
  modules: [
    '@nuxt/devtools'
  ],

  // 应用配置
  app: {
    head: {
      title: '视频分析系统',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
      link: [
        { 
          rel: 'stylesheet', 
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css'
        }
      ]
    }
  }
})
