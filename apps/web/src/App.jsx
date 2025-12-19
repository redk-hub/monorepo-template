import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN'; // 设置中文
import { router } from './router';
import 'antd/dist/antd.css';

const App = () => {
  console.log('App render');

  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
