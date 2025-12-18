import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import AuthGuard from './AuthGuard';
import { routes } from './routeConfig';
const Layout = lazy(() => import('../layout'));
const Login = lazy(() => import('../pages/Login'));

/**
 * 递归处理路由配置
 * 将自定义属性转换为 React Router 标准格式，并注入守卫等逻辑
 */
const renderRoutes = (routes) => {
  const newRoutes = routes.map((route) => {
    const { element, children, path, auth } = route;

    return {
      path: path,
      element: element ? (
        <AuthGuard auth={auth}>{element}</AuthGuard>
      ) : (
        <Outlet />
      ),
      children: children ? renderRoutes(children) : undefined,
    };
  });
  return newRoutes;
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
      ...renderRoutes(routes),
      // { index: true, element: <Navigate to="/login" replace /> },
    ],
  },
  {
    path: '/login',
    element: <Login />, // 独立于 Layout 的登录页
  },
  // {
  //   path: '*',
  //   element: <Navigate to="/home" replace />,
  // },
]);
