import { NavBar, TabBar, SafeArea } from 'antd-mobile';
import { AppOutline, MessageOutline, UserOutline } from 'antd-mobile-icons';
import { useUserStore } from '@my-repo/hooks'; // 统一入口引入
import { useLocation, Outlet, Navigate, useNavigate } from 'react-router-dom';
import styles from './index.module.less';
import { useEffect } from 'react';
import { setNavigateLogin } from '@my-repo/utils';

const LayoutWrapper = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = useUserStore((state) => state.isLogin);

  useEffect(() => {
    setNavigateLogin(() =>
      navigate('/login', { state: { from: location }, replace: true }),
    );
  }, []);

  // 1. 判断登录状态：如果未登录，重定向到登录页
  // state 记录当前路径，方便登录后跳回
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className={styles.mainLayout}>
      {/* 1. 顶部导航 */}
      <NavBar
        className={styles.navBar}
        back={location.pathname == '/home' ? null : ''}
        onBack={() => navigate(-1)}
      >
        页面标题
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
          <TabBar.Item key="/system/user" icon={<UserOutline />} title="我的" />
        </TabBar>
        {/* 适配全面屏底部底部距离 */}
        <SafeArea position="bottom" />
      </div>
    </div>
  );
};

export default LayoutWrapper;
