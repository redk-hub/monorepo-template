import React, { Suspense, lazy } from 'react';
import {
  createBrowserRouter,
  Navigate,
  useLocation,
  Outlet,
} from 'react-router-dom';
import { KeepAliveWrapper } from '@my-repo/pc-ui';
import AuthGuard from './AuthGuard';

const Layout = lazy(() => import('../layout'));
const Login = lazy(() => import('../pages/Login'));
const Home = lazy(() => import('../pages/Home'));
const List = lazy(() => import('../pages/List'));
const RoleList = lazy(() => import('../pages/RoleList'));
const UserDetail = lazy(() => import('../pages/UserDetail'));

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
    path: 'system',
    label: '系统管理',
    auth: 'system:view',
    children: [
      {
        path: 'user',
        label: '用户管理',
        auth: 'user:view',
        keepAlive: true,
        element: <List />,
      },
      {
        // 动态路由参数 :id
        path: 'user/detail/:id',
        label: '用户详情',
        element: <UserDetail />,
        keepAlive: false,
        auth: 'user:detail',
      },
      {
        path: 'role',
        label: '角色管理',
        auth: 'role:view',
        keepAlive: true,
        element: <RoleList />,
      },
    ],
  },
];

/**
 * 递归处理路由配置
 * 将自定义属性转换为 React Router 标准格式，并注入守卫和缓存
 */
const renderRoutes = (routes, parentPath = '') => {
  const newRoutes = routes.map((route) => {
    const { element, children, path, auth, keepAlive, label } = route;

    // 处理绝对路径，用于给 KeepAlive 做 cacheKey
    const fullPath = path.startsWith('/')
      ? path
      : `${parentPath}/${path}`.replace(/\/+/g, '/');

    // 封装一个内部组件，用于获取 location 并包裹功能组件
    const PageWrapper = () => {
      const location = useLocation();
      return (
        <AuthGuard auth={auth}>
          <KeepAliveWrapper
            active={keepAlive}
            cacheKey={location.pathname} // 使用当前完整路径作为缓存 Key
          >
            {element}
          </KeepAliveWrapper>
        </AuthGuard>
      );
    };

    return {
      path: path,
      // 如果有页面组件，就用包装器（权限+缓存）
      // 如果没有页面组件（它是父级路径），就必须渲染 Outlet，否则子页面显示不出来
      element: element ? <PageWrapper /> : <Outlet />,
      children: children ? renderRoutes(children, fullPath) : undefined,
    };
  });
  console.log('newRoutes', newRoutes);
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
      { index: true, element: <Navigate to="/login" replace /> },
    ],
  },
  {
    path: '/login',
    element: <Login />, // 独立于 Layout 的登录页
  },
  {
    path: '*',
    element: <Navigate to="/home" replace />,
  },
]);
