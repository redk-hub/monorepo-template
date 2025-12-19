import React, { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const Home = lazy(() => import('../pages/Home'));
const RoleList = lazy(() => import('../pages/RoleList'));
const ListLayout = lazy(() => import('../pages/User/ListLayout'));
const UserDetail = lazy(() => import('../pages/User/Detail'));

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

      {
        path: 'role',
        label: '角色管理',
        auth: 'role:view',
        children: [
          { index: true, element: <Navigate to="list" replace /> },
          {
            path: 'list',
            label: '角色列表',
            auth: 'role:list',
            element: <RoleList />,
          },
        ],
      },
    ],
  },
];
