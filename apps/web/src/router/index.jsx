import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  createHashRouter,
  Navigate,
  Outlet,
  useRouteError,
} from 'react-router-dom';
import AuthGuard from './AuthGuard';
import { Result, Button } from 'antd';
import { routes } from './routeConfig';
const Layout = lazy(() => import('../Layout/MainLayout/index'));
const Login = lazy(() => import('../pages/Login'));

/**
 * 递归处理路由配置
 * 将自定义属性转换为 React Router 标准格式，并注入守卫等逻辑
 */
const renderRoutes = (routes) => {
  const newRoutes = routes.map((route) => {
    const { element, children, path, auth, index, handle } = route;
    if (index) return route;
    return {
      path,
      handle,
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

// 简单的路由错误边界，使用 react-router 的 useRouteError
function RouteErrorBoundary() {
  const error = useRouteError();

  return (
    <Result
      status="warning"
      title="页面出错，请稍后重试！"
      extra={
        <Button type="primary" onClick={() => window.location.reload()}>
          重新加载
        </Button>
      }
    />
  );
}

export const router = createHashRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={null}>
        <Layout />
      </Suspense>
    ),
    // 根路由错误边界
    errorElement: <RouteErrorBoundary />,
    children: [
      ...renderRoutes(routes),
      // { index: true, element: <Navigate to="/login" replace /> },
    ],
  },
  {
    path: '/login',
    element: <Login />, // 独立于 Layout 的登录页
    errorElement: <RouteErrorBoundary />,
  },
  // {
  //   path: '*',
  //   element: <Navigate to="/home" replace />,
  // },
]);
