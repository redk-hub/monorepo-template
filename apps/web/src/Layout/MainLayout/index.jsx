import { Layout } from 'antd';
import { useUserStore } from '@my-repo/hooks'; // 统一入口引入
import { useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { routes } from '../../router/routeConfig';
import { RouteBreadcrumb, SideMenu } from '@my-repo/pc-ui';
import { TopMenu } from '@my-repo/pc-ui';
import { useCurMenu } from '@my-repo/hooks';
import styles from './index.module.less';
import { useEffect } from 'react';
import { setNavigateLogin } from '@my-repo/utils';

const { Header, Sider, Content } = Layout;

const LayoutWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useUserStore((state) => !!state.userInfo);
  const { topMenuChildren } = useCurMenu(routes);

  useEffect(() => {
    setNavigateLogin(() =>
      navigate('/login', { state: { from: location }, replace: true }),
    );
  }, [location]);

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
      </Header>
      <Layout>
        {!!topMenuChildren && (
          <Sider collapsible className={styles.sider}>
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
