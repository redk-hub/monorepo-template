import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { useUserStore } from '@my-repo/hooks';

if (import.meta.env.MODE === 'development') {
  // 导入 mock 接口（仅在开发/演示中使用）
  import('./mocks/mockApi').then((m) => m.setupMock());
}

// 模拟初始化，从缓存恢复登录状态
useUserStore.getState();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
