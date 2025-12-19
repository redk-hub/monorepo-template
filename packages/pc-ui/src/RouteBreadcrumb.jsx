// RouteBreadcrumb.jsx
// 该文件负责根据路由配置动态生成面包屑（Breadcrumb）
// 说明：
// - 从 routes 中读取 label 与 path，构建一个 path -> { label, clickable } 的映射
// - 根据当前 location.pathname 拆分路径片段，逐级在映射中查找对应 label
// - 支持参数化路径（例如 /user/:id）匹配
// - 对最后一项或不可点击项不渲染 Link

import React, { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

// generateBreadcrumbMap: 将 routes 转为一个扁平的映射表，key 为完整路径，value 为显示文本与是否可点击
// - routes: 路由配置数组
// - parentPath: 用于递归拼接父路径
// 返回值示例: { '/system/user': { label: '用户管理', clickable: true }, ... }
const generateBreadcrumbMap = (routes, parentPath = '') => {
  let map = {};
  routes.forEach((route) => {
    if (!route.label) return; // 没有 label 的路由不参与面包屑
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/');

    // clickable: 当该路由有 element（渲染组件）时，认为面包屑可以点击
    map[fullPath] = { label: route.label, clickable: !!route.element };

    if (route.children) {
      // 递归合并子路由映射
      Object.assign(map, generateBreadcrumbMap(route.children, fullPath));
    }
  });
  return map;
};

// RouteBreadcrumb 组件
// props:
// - routes: 路由配置，用于生成面包屑映射
// 行为：基于当前 location.pathname 渲染一组 Breadcrumb.Item
export const RouteBreadcrumb = ({ routes = [] }) => {
  const location = useLocation();

  // 使用 useMemo 缓存由 routes 生成的映射，避免每次渲染都重建
  const breadcrumbNameMap = useMemo(
    () => generateBreadcrumbMap(routes),
    [routes],
  );

  // 计算要渲染的 breadcrumb items
  const breadcrumbItems = useMemo(() => {
    // findRoute: 根据给定路径在映射中查找匹配项，支持参数化路径匹配
    const findRoute = (path, map) => {
      if (map[path]) return map[path];

      // 如果没有直接命中，遍历 map 的 key，使用正则替换参数部分进行匹配
      const targetKey = Object.keys(map).find((key) => {
        const regexPath = key.replace(/:[^/]+/g, '[^/]+');
        return new RegExp(`^${regexPath}$`).test(path);
      });
      return map[targetKey];
    };

    // 将当前路径拆分为各级片段（去除空字符串）
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const items = pathSnippets
      .map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSnippets.length - 1;

        // 从映射中获取 label 与 clickable 信息
        const { label, clickable } = findRoute(url, breadcrumbNameMap) || {};
        if (!label) return null; // 没有 label 的片段不展示面包屑

        // 最后一项或不可点击项直接渲染文本，否则渲染为可点击的 Link
        return isLast || !clickable ? (
          <Breadcrumb.Item key={url}>{label}</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={url}>
            <Link to={url}>{label}</Link>
          </Breadcrumb.Item>
        );
      })
      .filter(Boolean);

    return items;
  }, [location.pathname, breadcrumbNameMap]);

  // 如果没有任何面包屑项则不渲染组件
  if (!breadcrumbItems || breadcrumbItems.length === 0) return null;

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
};

export default RouteBreadcrumb;
