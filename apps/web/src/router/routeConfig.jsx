import React, { lazy } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
const Home = lazy(() => import('../pages/Home'));
const RoleList = lazy(() => import('../pages/User/RoleList'));
const ListLayout = lazy(() => import('../pages/User/ListLayout'));
const UserDetail = lazy(() => import('../pages/User/Detail'));

// react-query example pages
const RQIndex = lazy(() => import('../pages/react-query'));
const BasicQuery = lazy(() => import('../pages/react-query/BasicQuery'));
const Mutations = lazy(() => import('../pages/react-query/Mutations'));
const Pagination = lazy(() => import('../pages/react-query/Pagination'));
const Infinite = lazy(() => import('../pages/react-query/Infinite'));
const DependentParallel = lazy(
  () => import('../pages/react-query/DependentParallel'),
);
const PrefetchInvalidate = lazy(
  () => import('../pages/react-query/PrefetchInvalidate'),
);

// 路由配置表
export const routes = [
  { index: true, element: <Navigate to="home" replace /> },
  {
    path: 'home',
    handle: { title: '首页' },
    element: <Home />,
    auth: 'home:view',
  },
  {
    path: 'react-query',
    handle: { title: 'React Query 示例' },
    // no element -> render children via Outlet
    children: [
      { index: true, element: <Navigate to="basic" replace /> },
      { path: '', element: <RQIndex /> },
      { path: 'basic', handle: { title: '基础查询' }, element: <BasicQuery /> },
      {
        path: 'mutations',
        handle: { title: '变更与乐观更新' },
        element: <Mutations />,
      },
      {
        path: 'pagination',
        handle: { title: '分页' },
        element: <Pagination />,
      },
      {
        path: 'infinite',
        handle: { title: '无限分页' },
        element: <Infinite />,
      },
      {
        path: 'dependent-parallel',
        handle: { title: '依赖与并行' },
        element: <DependentParallel />,
      },
      {
        path: 'prefetch',
        handle: { title: '预取与失效' },
        element: <PrefetchInvalidate />,
      },
    ],
    auth: null,
  },
  {
    path: 'system',
    handle: { title: '系统管理' },
    auth: 'system:view',
    children: [
      {
        index: true,
        element: <Navigate to="user" replace />,
      },
      {
        path: 'user',
        handle: { title: '用户管理' },
        auth: 'user:view',
        element: <ListLayout />,
        children: [
          {
            index: true,
            element: null, // 列表由 Layout 自己渲染
          },
          {
            handle: { title: '用户详情' },
            path: ':id',
            auth: 'user:detail',
            hideInMenu: true,
            element: <UserDetail />,
          },
        ],
      },

      {
        path: 'role',
        handle: { title: '角色管理' },
        auth: 'role:view',
        children: [
          { index: true, element: <Navigate to="list" replace /> },
          {
            path: 'list',
            handle: { title: '角色列表' },
            auth: 'role:list',
            element: <RoleList />,
          },
        ],
      },
    ],
  },
];
