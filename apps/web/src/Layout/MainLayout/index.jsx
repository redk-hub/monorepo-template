import { Layout, Button, Switch } from 'antd';
import { useUserStore } from '@my-repo/hooks'; // 统一入口引入
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { routes } from '../../router/routeConfig';
import { RouteBreadcrumb, SideMenu } from '@my-repo/pc-ui';
import { TopMenu } from '@my-repo/pc-ui';
import { usePermission, useCurMenu } from '@my-repo/hooks';
import styles from './index.module.less';

// import theme files (global overrides for antd). These define .theme-light and .theme-dark classes
import './theme-light.less';
import './theme-dark.less';

import { useEffect, useState } from 'react';

const { Header, Sider, Content } = Layout;

const LayoutWrapper = () => {
  const location = useLocation();
  const isLogin = useUserStore((state) => state.isLogin);
  const { topMenuChildren } = useCurMenu(routes);

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

        <TopMenu routes={routes} />

        <Switch
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          checkedChildren="深色"
          unCheckedChildren="浅色"
        />
      </Header>
      <Layout>
        {!!topMenuChildren && (
          <Sider collapsible>
            <SideMenu routes={routes} />
          </Sider>
        )}
        <Layout>
          {!!topMenuChildren && (
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
