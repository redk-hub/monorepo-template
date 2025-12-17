/**
 * 代理配置中心
 * 根据 mode 切换不同的目标服务器
 */
const targets = {
  development: {
    api: 'http://test-api.example.com',
    auth: 'http://test-auth.example.com',
    upload: 'http://test-upload.example.com'
  },
  production: {
    api: 'http://prod-api.example.com',
    auth: 'http://prod-auth.example.com',
    upload: 'http://prod-upload.example.com'
  }
};

export const createProxy = (mode) => {
  const targetMap = targets[mode] || targets.development;
  
  return {
    '/api': {
      target: targetMap.api,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    },
    '/auth-service': {
      target: targetMap.auth,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/auth-service/, '')
    },
    '/upload': {
      target: targetMap.upload,
      changeOrigin: true
    }
  };
};
