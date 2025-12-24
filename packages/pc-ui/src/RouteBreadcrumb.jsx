// RouteBreadcrumb.jsx
// 该文件负责根据路由配置动态生成面包屑（Breadcrumb）

import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation, useMatches } from 'react-router-dom';

// RouteBreadcrumb 组件
// props:
// - routes: 路由配置，用于生成面包屑映射
// 行为：基于当前 location.pathname 渲染一组 Breadcrumb.Item
export const RouteBreadcrumb = ({ className }) => {
  const location = useLocation();
  const matches = useMatches();
  console.log('Breadcrumb matches:', matches);

  const items = matches
    .map((match, index) => {
      const title = match.handle?.title;
      if (title) {
        return {
          path: match.pathname,
          title,
        };
      }
      return null;
    })
    .filter(Boolean);

  const itemRender = (currentRoute, params, items, paths) => {
    const isLast = currentRoute?.path === items[items.length - 1]?.path;

    return isLast ? (
      <span>{currentRoute.title}</span>
    ) : (
      <Link to={currentRoute.path}>{currentRoute.title}</Link>
    );
  };

  return (
    <Breadcrumb className={className} items={items} itemRender={itemRender} />
  );
};

export default RouteBreadcrumb;
