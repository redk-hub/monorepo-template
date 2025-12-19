import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Menu, Button, message } from 'antd';
import { usePermission, useUserStore } from '@my-repo/hooks'; // 统一入口引入
import {
  useNavigate,
  useLocation,
  Outlet,
  Link,
  Navigate,
} from 'react-router-dom';
import { routes } from '../router/routeConfig';
import { RouteBreadcrumb } from '@my-repo/pc-ui';

const { Header, Sider, Content } = Layout;

const LayoutWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useUserStore((state) => state.isLogin);
  // 1. 判断登录状态：如果未登录，重定向到登录页
  // state 记录当前路径，方便登录后跳回
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- 1. 侧边栏状态处理 ---
  const [openMenus, setOpenMenus] = useState([]);

  const { hasPermission } = usePermission();

  // --- 1. 处理导航 ---
  const handleNavigate = (path) => {
    if (!path || path === location.pathname) return;
    navigate(path);
  };

  // --- 3. 构造侧边栏菜单 ---
  const menuItems = useMemo(() => {
    const filterMenu = (list, parentPath = '') => {
      const newList = list
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
            : `${parentPath}/${item.path}`.replace(/\/+/g, '/');
          return {
            key: fullPath,
            label: item.label,
            children: item.children
              ? filterMenu(item.children, fullPath)
              : null,
          };
        });

      return newList?.length ? newList : null;
    };
    return filterMenu(routes);
  }, [hasPermission]);

  // --- 4. 计算菜单选中的 key ---
  const routeEntries = useMemo(() => {
    const entries = [];
    const traverse = (list, parent = '') => {
      list.forEach((r) => {
        if (r.index || !r.path) return;
        const fullPath = r.path.startsWith('/')
          ? r.path
          : `${parent}/${r.path}`.replace(/\/+/g, '/');
        entries.push({
          fullPath,
          hideInMenu: !!r.hideInMenu,
          parent: parent || '/',
        });
        if (r.children) traverse(r.children, fullPath);
      });
    };
    traverse(routes);
    return entries;
  }, [routes]);

  const selectedKey = useMemo(() => {
    const path = location.pathname;

    // find candidates matching the current path (supporting params)
    const candidates = routeEntries.filter((e) => {
      try {
        const pattern = e.fullPath.replace(/:[^/]+/g, '[^/]+');
        const re = new RegExp(`^${pattern}$`);
        return re.test(path);
      } catch (err) {
        return false;
      }
    });

    // choose the most specific match (longest path)
    let match = candidates.sort(
      (a, b) => b.fullPath.length - a.fullPath.length,
    )[0];

    // fallback: try to match by progressively trimming the path
    if (!match) {
      const parts = path.split('/').filter(Boolean);
      for (let i = parts.length; i > 0; i--) {
        const url = '/' + parts.slice(0, i).join('/');
        match = routeEntries.find((e) => e.fullPath === url);
        if (match) break;
      }
    }

    // if matched route is hidden in menu, climb to nearest visible parent
    while (match && match.hideInMenu) {
      match = routeEntries.find((e) => e.fullPath === match.parent);
    }

    if (match) return match.fullPath;

    // last resort: select top-level segment
    const firstSeg = '/' + location.pathname.split('/')[1];
    return firstSeg || location.pathname;
  }, [location.pathname, routeEntries]);

  console.log('aaaaaaa', routeEntries, selectedKey);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div
          style={{
            height: 32,
            margin: 16,
            background: 'rgba(255,255,255,.2)',
            color: '#fff',
            textAlign: 'center',
            lineHeight: '32px',
          }}
        >
          LOGO
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
          items={menuItems}
          onClick={({ key }) => handleNavigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          }}
        >
          <RouteBreadcrumb routes={routes} />

          <div>
            <Button
              type="link"
              onClick={() => {
                window.location.reload();
              }}
            >
              重置应用
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
