import React, { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const Home = lazy(() => import('../pages/Home'));
const ListLayout = lazy(() => import('../pages/User/ListLayout'));
const UserDetail = lazy(() => import('../pages/User/Detail'));
const Message = lazy(() => import('../pages/Message'));

// 路由配置表
export const routes = [
  { index: true, element: <Navigate to="home" replace /> },
  {
    path: 'home',
    handle: { title: '首页' },
    element: <Home />,
  },
  {
    path: 'message',
    handle: { title: '消息' },
    element: <Message />,
  },
  {
    path: 'system',
    handle: { title: '个人中心' },
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <Navigate to="user" replace />,
      },
      {
        path: 'user',
        label: '用户管理',
        element: <ListLayout />,
        children: [
          {
            index: true,
            element: null, // 列表由 Layout 自己渲染
          },
          {
            label: '用户详情',
            path: ':id',
            element: <UserDetail />,
          },
        ],
      },
    ],
  },
];
