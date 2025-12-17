import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { KeepAliveWrapper } from '@my-repo/pc-ui';
import AuthGuard from './AuthGuard';

const Layout = lazy(() => import('../layout'));
const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const List = lazy(() => import('../pages/List'));

// 路由配置表：增加 keepAlive 属性
export const routes = [
  {
    path: 'home',
    label: '首页',
    element: <Home />,
    auth: 'home:view',
    keepAlive: true,
  },
  {
    path: 'list',
    label: '列表',
    element: <List />,
    auth: 'list:view',
    keepAlive: true,
  },
  { path: 'login', label: '登录', element: <Login />, keepAlive: false },
];

// 包装函数：将路由配置转换为带缓存逻辑的 Element
const wrapRoute = (route) => {
  const Component = route.element;

  // 内部辅助组件，用来获取当前的 location
  const RouteElement = () => {
    const location = useLocation();
    return (
      <AuthGuard auth={route.auth}>
        <KeepAliveWrapper active={route.keepAlive} cacheKey={location.pathname}>
          {Component}
        </KeepAliveWrapper>
      </AuthGuard>
    );
  };

  return <RouteElement />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={null}>
        <Layout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      ...routes.map((r) => ({
        path: r.path,
        element: wrapRoute(r),
      })),
    ],
  },
]);
