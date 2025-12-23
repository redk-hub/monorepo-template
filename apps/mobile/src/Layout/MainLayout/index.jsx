import { NavBar, TabBar, SafeArea } from 'antd-mobile';
import { AppOutline, MessageOutline, UserOutline } from 'antd-mobile-icons';
import { useUserStore } from '@my-repo/hooks'; // 统一入口引入
import {
  useLocation,
  Outlet,
  Navigate,
  useNavigate,
  useMatches,
} from 'react-router-dom';
import styles from './index.module.less';
import { useEffect } from 'react';
import { setNavigateLogin } from '@my-repo/utils';

const LayoutWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const matches = useMatches();
  const isLogin = useUserStore((state) => !!state.userInfo);
  useEffect(() => {
    setNavigateLogin(() =>
      navigate('/login', { state: { from: location }, replace: true }),
    );
  }, [location, navigate]);

  // 1. 判断登录状态：如果未登录，重定向到登录页
  // state 记录当前路径，方便登录后跳回
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 获取当前匹配路由中定义的 title
  const currentMatch = matches.find((m) => m.handle?.title);
  const title = currentMatch?.handle?.title || '';

  return (
    <div className={styles.mainLayout}>
      {/* 1. 顶部导航 */}
      <NavBar
        className={styles.navBar}
        back={location.pathname == '/home' ? null : ''}
        onBack={() => navigate(-1)}
      >
        {title}
      </NavBar>

      {/* 2. 中间内容区（滚动区域） */}
      <div className={styles.layoutContent}>
        <Outlet />
      </div>

      {/* 3. 底部菜单和安全区适配 */}
      <div className={styles.layoutFooter}>
        <TabBar
          onChange={(value) => navigate(value)}
          activeKey={'/' + location.pathname.split('/')[1]}
        >
          <TabBar.Item key="/home" icon={<AppOutline />} title="首页" />
          <TabBar.Item key="/message" icon={<MessageOutline />} title="消息" />
          <TabBar.Item key="/system" icon={<UserOutline />} title="我的" />
        </TabBar>
        {/* 适配全面屏底部底部距离 */}
        <SafeArea position="bottom" />
      </div>
    </div>
  );
};

export default LayoutWrapper;
