import { Layout, Button, Switch } from 'antd';
import { useUserStore } from '@my-repo/hooks'; // 统一入口引入
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { routes } from '../../router/routeConfig';
import { RouteBreadcrumb, RouteMenu } from '@my-repo/pc-ui';
import { SysMenu } from '@my-repo/pc-ui';
import { usePermission } from '@my-repo/hooks';
import styles from './index.module.less';

// import theme files (global overrides for antd). These define .theme-light and .theme-dark classes
import './theme-light.less';
import './theme-dark.less';

import { useEffect, useState } from 'react';

const { Header, Sider, Content } = Layout;

const LayoutWrapper = () => {
  const location = useLocation();
  const isLogin = useUserStore((state) => state.isLogin);
  const { hasPermission } = usePermission();

  // theme: 'light' or 'dark'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('app-theme') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    // apply theme class to documentElement so antd components get overridden globally
    const el = document.documentElement;
    el.classList.remove('theme-light', 'theme-dark');
    el.classList.add(`theme-${theme}`);
    try {
      localStorage.setItem('app-theme', theme);
    } catch (e) {}
  }, [theme]);

  // 判断当前顶部选中一级路由是否有可见子路由（基于权限和 hideInMenu）
  const shouldShowSider = (() => {
    try {
      const parts = location.pathname.split('/').filter(Boolean);
      const first = parts.length ? `/${parts[0]}` : '/';

      // 找到对应的顶级路由对象
      const top = (routes || []).find((r) => {
        const fp = r.path?.startsWith('/') ? r.path : `/${r.path}`;
        return fp === first || `/${r.path}` === first;
      });

      if (!top) return false;

      if (!Array.isArray(top.children) || top.children.length === 0)
        return false;

      // 判断子路由中是否存在至少一个应该展示的项
      const visible = top.children.some(
        (c) => c && c.path && c.label && !c.hideInMenu && hasPermission(c.auth),
      );
      return visible;
    } catch (e) {
      return false;
    }
  })();

  // 1. 判断登录状态：如果未登录，重定向到登录页
  // state 记录当前路径，方便登录后跳回
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout className={styles.mainLayout}>
      <Header className={styles.sysMenu}>
        <div
          style={{
            height: 32,
            marginRight: 16,
            display: 'flex',
            alignItems: 'center',
            lineHeight: '32px',
            fontWeight: 600,
          }}
        >
          LOGO
        </div>

        <SysMenu routes={routes} />

        <Switch
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          checkedChildren="深色"
          unCheckedChildren="浅色"
        />
      </Header>
      <Layout>
        {shouldShowSider && (
          <Sider collapsible>
            <RouteMenu routes={routes} />
          </Sider>
        )}
        <Layout>
          {shouldShowSider && (
            <RouteBreadcrumb className={styles.breadcrumb} routes={routes} />
          )}
          <Content className={styles.content}>
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
