import React, { useMemo } from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const generateBreadcrumbMap = (routes, parentPath = '') => {
  let map = {};
  routes.forEach((route) => {
    if (!route.label) return;
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/');

    map[fullPath] = { label: route.label, clickable: !!route.element };

    if (route.children) {
      Object.assign(map, generateBreadcrumbMap(route.children, fullPath));
    }
  });
  return map;
};

export const RouteBreadcrumb = ({ routes = [] }) => {
  const location = useLocation();

  const breadcrumbNameMap = useMemo(
    () => generateBreadcrumbMap(routes),
    [routes],
  );

  const breadcrumbItems = useMemo(() => {
    const findRoute = (path, map) => {
      if (map[path]) return map[path];

      const targetKey = Object.keys(map).find((key) => {
        const regexPath = key.replace(/:[^/]+/g, '[^/]+');
        return new RegExp(`^${regexPath}$`).test(path);
      });
      return map[targetKey];
    };

    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const items = pathSnippets
      .map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSnippets.length - 1;
        const { label, clickable } = findRoute(url, breadcrumbNameMap) || {};
        if (!label) return null;
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

  if (!breadcrumbItems || breadcrumbItems.length === 0) return null;

  return <Breadcrumb>{breadcrumbItems}</Breadcrumb>;
};
