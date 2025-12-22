// SideMenu.jsx
// 该文件负责根据路由配置构建侧边栏菜单并处理选中、高亮与导航逻辑

import React, { useMemo } from 'react';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePermission, useCurMenu } from '@my-repo/hooks'; // 统一入口引入

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

// SideMenu 组件
// props:
// - routes: 路由配置
// 行为调整：只展示当前顶部选中一级路由的 children（如果有），否则展示根级可见路由
export const SideMenu = ({ routes = [] }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { topMenuPath, topMenuChildren } = useCurMenu(routes);

  // menuItems: 仅基于 childSource 构建侧边菜单
  const menuItems = useMemo(
    () =>
      buildMenuItems(
        topMenuChildren || [],
        hasPermission,
        topMenuPath === '/' ? '' : topMenuPath,
      ),
    [topMenuChildren, hasPermission, topMenuPath],
  );

  // routeEntries: 扁平化后的路由表，用于匹配当前路径并向上查找可见的父路由
  const routeEntries = useMemo(() => flattenRoutes(routes), [routes]);

  // selectedKey: 计算当前应该高亮的菜单 key（仍从整个路由表中寻找匹配，然后若匹配项在 hideInMenu 则向上寻找）
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
    return match?.hideInMenu ? match?.parent : match?.fullPath;
  }, [location.pathname, routeEntries]);

  // defaultOpenKeys: 根据 selectedKey 展开左侧一级菜单（保留原有行为）
  const defaultOpenKeys = useMemo(() => {
    if (!selectedKey) return [];
    const keys = [];

    const findParentPath = (keys, key) => {
      const parent = routeEntries.find((item) => item.fullPath == key)?.parent;
      if (parent) {
        keys.push(parent);
        findParentPath(keys, parent);
      }
    };
    findParentPath(keys, selectedKey);

    return keys;
  }, [selectedKey, routeEntries]);

  const handleNavigate = ({ key }) => {
    if (!key || key === location.pathname) return;
    navigate(key);
  };

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

export default SideMenu;
