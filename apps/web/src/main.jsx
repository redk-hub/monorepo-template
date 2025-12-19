import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // 引入 App.js
import { useUserStore } from '@my-repo/hooks';
// import './index.css'; // 全局样式

// 模拟初始化，从缓存恢复登录状态
useUserStore.getState();

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
