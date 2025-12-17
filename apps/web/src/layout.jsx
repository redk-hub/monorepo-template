import React, { useEffect } from 'react';
import { Layout, Menu, Tabs, Button, Dropdown } from 'antd';
import { useAliveController } from 'react-activation';
import { usePermission, usePageStore } from '@my-repo/hooks'; // 统一入口引入
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { routes } from './router';

const { Header, Sider, Content } = Layout;

const LayoutWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { tabs, addTab, closeTab } = usePageStore();
  const { hasPermission } = usePermission();

  const { dropByCacheKey } = useAliveController();

  // 监听路由变化：自动同步标签页
  useEffect(() => {
    const currentPath = location.pathname;
    const label = routes.find((item) => item.path === currentPath)?.label;
    addTab({ key: currentPath, label });
  }, [location.pathname, addTab]);

  // 处理 Tab 编辑（主要是删除）
  const onEdit = (targetKey, action) => {
    if (action === 'remove') {
      // 核心：关闭 Tab 时立刻销毁 react-activation 里的缓存
      dropByCacheKey(targetKey);

      // 如果关闭的是当前页，自动跳到前一个标签
      if (targetKey === location.pathname) {
        const currentIndex = tabs.findIndex((t) => t.key === targetKey);
        const nextPath = tabs[currentIndex - 1]?.key || '/home';
        navigate(nextPath);
      }

      closeTab(targetKey);
    }
  };

  // 刷新当前页
  const refreshPage = () => {
    dropByCacheKey(location.pathname);
    window.location.reload();
  };

  const menuItems = routes
    .filter((item) => !item.auth || hasPermission(item.auth))
    .map((item) => ({
      key: item.path,
      label: item.label,
    }));

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
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ color: '#888' }}>
            后台管理系统 /
            {menuItems.find((item) => item.key === location.pathname)?.label ||
              '首页'}
          </div>
          <Button size="small" onClick={refreshPage}>
            刷新当前页
          </Button>
        </Header>

        {/* 3. 多标签页栏 */}
        <div style={{ background: '#f0f2f5', padding: '10px 16px 0' }}>
          <Tabs
            type="editable-card"
            hideAdd
            activeKey={location.pathname}
            onEdit={onEdit}
            onChange={(key) => navigate(key)}
            items={tabs.map((tab) => ({
              key: tab.key,
              label: tab.label,
              closable: tab.key !== 'home', // 首页通常设置不可关闭
            }))}
          />
        </div>

        <Content
          style={{
            margin: '0 16px 16px',
            padding: 24,
            background: '#fff',
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutWrapper;
