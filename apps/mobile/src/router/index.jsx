import React, { Suspense, lazy } from 'react';
import { createHashRouter } from 'react-router-dom';
import { Result, Button } from 'antd-mobile';
import { routes } from './routeConfig';
const Layout = lazy(() => import('../Layout/MainLayout/index'));
const Login = lazy(() => import('../pages/Login'));

// 简单的路由错误边界，使用 react-router 的 useRouteError
//eslint-disable-next-line
function RouteErrorBoundary() {
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
    children: routes,
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
