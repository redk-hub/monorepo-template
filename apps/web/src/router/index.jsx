import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import AuthGuard from './AuthGuard';
const Layout = lazy(() => import('../layout'));

const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const List = lazy(() => import('../pages/List'));
const RoleList = lazy(() => import('../pages/RoleList'));
const UserDetail = lazy(() => import('../pages/UserDetail'));

// 路由配置表
export const routes = [
  {
    path: 'home',
    label: '首页',
    element: <Home />,
    auth: 'home:view',
  },
  {
    path: 'system',
    label: '系统管理',
    auth: 'system:view',
    children: [
      {
        path: 'user',
        label: '用户管理',
        auth: 'user:view',
        element: <List />,
      },
      {
        // 动态路由参数 :id
        path: 'user/detail/:id',
        label: '用户详情',
        element: <UserDetail />,
        auth: 'user:detail',
      },
      {
        path: 'role',
        label: '角色管理',
        auth: 'role:view',
        element: <RoleList />,
      },
    ],
  },
];

/**
 * 递归处理路由配置
 * 将自定义属性转换为 React Router 标准格式，并注入守卫等逻辑
 */
const renderRoutes = (routes) => {
  const newRoutes = routes.map((route) => {
    const { element, children, path, auth, label } = route;

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
