import React from 'react';
import ReactDOM from 'react-dom/client';
import { AliveScope } from 'react-activation';
import App from './App'; // 引入 App.js
// import './index.css'; // 全局样式

ReactDOM.createRoot(document.getElementById('root')).render(
  <AliveScope>
    <App />
  </AliveScope>,
);
