import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
const Home = lazy(() => import('../pages/Home'));
const ListLayout = lazy(() => import('../pages/User/ListLayout'));
const UserDetail = lazy(() => import('../pages/User/Detail'));
const Message = lazy(() => import('../pages/Message'));

// 路由配置表
export const routes = [
  { index: true, element: <Navigate to="home" replace /> },
  {
    path: 'home',
    label: '首页',
    element: <Home />,
    auth: 'home:view',
  },
  {
    path: 'message',
    label: '首页',
    element: <Message />,
    auth: 'message:view',
  },
  {
    path: 'system',
    label: '系统管理',
    auth: 'system:view',
    children: [
      {
        index: true,
        element: <Navigate to="user" replace />,
      },
      {
        path: 'user',
        label: '用户管理',
        auth: 'user:view',
        element: <ListLayout />,
        children: [
          {
            index: true,
            element: null, // 列表由 Layout 自己渲染
          },
          {
            label: '用户详情',
            path: ':id',
            auth: 'user:detail',
            hideInMenu: true,
            element: <UserDetail />,
          },
        ],
      },
    ],
  },
];
