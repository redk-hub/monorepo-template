import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useUserStore } from '@my-repo/hooks';
import { setNavigateLogin } from '@my-repo/utils';

// 导入 mock 接口（仅在开发/演示中使用）
import './mocks/mockApi';

// 模拟初始化，从缓存恢复登录状态
useUserStore.getState();

// 注册跳转登录逻辑（如果后端返回 401，request 会调用此函数）
setNavigateLogin(() => {
  // 简单跳转到 /login
  window.location.href = '/login';
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
