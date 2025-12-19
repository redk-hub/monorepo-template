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
  const [openKeys, setOpenKeys] = useState([]);

  const { hasPermission } = usePermission();

  // --- 1. 处理导航 ---
  const handleNavigate = (path, isMenuClick = false) => {
    if (!path || path === location.pathname) return;

    // 如果是通过侧边栏或面包屑“跳转”，通常希望清理旧的缓存，开启新任务
    // 尤其是在返回上级时，清理掉当前/下级页面的缓存
    // drop(location.pathname);

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
          selectedKeys={[location.pathname]}
          defaultOpenKeys={['/' + location.pathname.split('/')[1]]}
          items={menuItems}
          onClick={({ key }) => handleNavigate(key, true)}
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
