import { Layout, Button } from 'antd';
import { useUserStore } from '@my-repo/hooks'; // 统一入口引入
import { useLocation, Outlet, Navigate } from 'react-router-dom';
import { routes } from '../router/routeConfig';
import { RouteBreadcrumb, RouteMenu } from '@my-repo/pc-ui';

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
        <RouteMenu routes={routes} />
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
