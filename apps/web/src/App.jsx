import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN'; // 设置中文
import { router } from './router';
import { useUserStore } from '@my-repo/hooks'; // 引入公共 hooks 包里的 store
import 'antd/dist/antd.css';

const App = () => {
  const setAuth = useUserStore((state) => state.setAuth);
  // 模拟初始化：从缓存恢复登录状态
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedPerms = localStorage.getItem('permissions');

    if (savedUser && savedPerms) {
      setAuth(JSON.parse(savedUser), JSON.parse(savedPerms));
    }
  }, [setAuth]);

  return (
    <ConfigProvider locale={zhCN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
