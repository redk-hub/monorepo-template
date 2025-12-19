import { Layout, Button } from 'antd';
import { useUserStore } from '@my-repo/hooks'; // 统一入口引入
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { routes } from '../../router/routeConfig';
import { RouteBreadcrumb, RouteMenu } from '@my-repo/pc-ui';
import styles from './index.less';

const { Header, Sider, Content } = Layout;

const LayoutWrapper = () => {
  const location = useLocation();
  const isLogin = useUserStore((state) => state.isLogin);
  // 1. 判断登录状态：如果未登录，重定向到登录页
  // state 记录当前路径，方便登录后跳回
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Layout className={styles.mainLayout}>
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
        <RouteMenu routes={routes} />
      </Sider>

      <Layout>
        <Header className={styles.sysMenu}>
          {/*TODO 系统菜单 */}

          <div style={{ marginLeft: 'auto' }}>
            <Button type="link">个人中心</Button>
          </div>
        </Header>

        <Header className={styles.breadcrumb}>
          <RouteBreadcrumb routes={routes} />
        </Header>

        <Content className={styles.content}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
