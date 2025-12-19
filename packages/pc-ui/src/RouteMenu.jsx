// RouteMenu.jsx
// 该文件负责根据路由配置构建侧边栏菜单并处理选中、高亮与导航逻辑

import React, { useMemo } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermission } from '@my-repo/hooks'; // 统一入口引入

// buildMenuItems: 将 routes 转换为 antd Menu 可用的 items 结构
// - 过滤权限 (hasPermission)
// - 忽略没有 path/label 或 hideInMenu 的项
// - 递归处理 children
const buildMenuItems = (list, hasPermission, parent = '') => {
  const items = list
    .filter(
      (item) =>
        hasPermission(item.auth) &&
        !!item.path &&
        !!item.label &&
        !item.hideInMenu,
    )
    .map((item) => {
      const fullPath = item.path.startsWith('/')
        ? item.path
        : `${parent}/${item.path}`.replace(/\/+/g, '/');
      return {
        key: fullPath,
        label: item.label,
        children: item.children
          ? buildMenuItems(item.children, hasPermission, fullPath)
          : null,
      };
    });
  return items?.length ? items : null;
};

// flattenRoutes: 将 routes 扁平化为一个数组，便于匹配当前路径并向上查找父路由
// 结果项包含：fullPath, hideInMenu, parent
const flattenRoutes = (list, parent = '') => {
  const entries = [];
  list.forEach((r) => {
    if (r.index) return; // 忽略 index 路由
    if (!r.path) return;
    const fullPath = r.path.startsWith('/')
      ? r.path
      : `${parent}/${r.path}`.replace(/\/+/g, '/');
    entries.push({
      fullPath,
      hideInMenu: !!r.hideInMenu,
      parent: parent || '/',
    });
    if (r.children) entries.push(...flattenRoutes(r.children, fullPath));
  });
  return entries;
};

// RouteMenu 组件
// props:
// - routes: 路由配置
// 通过 usePermission 获取 hasPermission 并用于构建菜单
export const RouteMenu = ({ routes = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();

  // 点击菜单的导航处理器
  const handleNavigate = ({ key }) => {
    if (!key || key === location.pathname) return;
    navigate(key);
  };

  // menuItems: antd Menu 所需的数据结构（受权限与 hideInMenu 控制）
  const menuItems = useMemo(
    () => buildMenuItems(routes, hasPermission),
    [routes, hasPermission],
  );

  // routeEntries: 扁平化后的路由表，用于匹配当前路径并向上查找可见的父路由
  const routeEntries = useMemo(() => flattenRoutes(routes), [routes]);

  // selectedKey: 计算当前应该高亮的菜单 key
  // - 首先通过正则匹配支持参数化路由（例如 /user/:id）
  // - 选择最精确（最长路径）的匹配
  // - 若没有直接匹配，逐级向上裁剪当前路径尝试精确匹配
  // - 如果匹配到的路由被 hideInMenu，则向上查找最近的非 hideInMenu 父路由并选中它
  // - 最后兜底选择首个路径段作为选中项
  const selectedKey = useMemo(() => {
    const path = location.pathname;
    const candidates = routeEntries.filter((e) => {
      try {
        const pattern = e.fullPath.replace(/:[^/]+/g, '[^/]+');
        return new RegExp(`^${pattern}$`).test(path);
      } catch (err) {
        return false;
      }
    });

    // 选最具体的匹配（路径最长）
    let match = candidates.sort(
      (a, b) => b.fullPath.length - a.fullPath.length,
    )[0];

    // 如果没有候选项，尝试通过裁剪路径段查找前缀匹配
    if (!match) {
      const parts = path.split('/').filter(Boolean);
      for (let i = parts.length; i > 0; i--) {
        const url = '/' + parts.slice(0, i).join('/');
        match = routeEntries.find((e) => e.fullPath === url);
        if (match) break;
      }
    }

    // 如果匹配项被隐藏于菜单，则向上查找最近可见的父级
    while (match && match.hideInMenu) {
      match = routeEntries.find((e) => e.fullPath === match.parent);
    }

    if (match) return match.fullPath;

    // 兜底：选中首级路径段（例如 /system）
    const firstSeg = '/' + (location.pathname.split('/')[1] || '');
    return firstSeg || location.pathname;
  }, [location.pathname, routeEntries]);

  // defaultOpenKeys: 根据 selectedKey 展开左侧一级菜单（保留原有行为）
  const defaultOpenKeys = useMemo(() => {
    if (!selectedKey) return [];
    const parts = selectedKey.split('/').filter(Boolean);
    if (parts.length === 0) return ['/'];
    return ['/' + parts[0]];
  }, [selectedKey]);

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      defaultOpenKeys={defaultOpenKeys}
      items={menuItems}
      onClick={handleNavigate}
    />
  );
};

export default RouteMenu;
