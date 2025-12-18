import React, { useEffect, useMemo, useState } from 'react';
import { Layout, Menu, Button, Breadcrumb, message } from 'antd';
import { usePermission, useUserStore } from '@my-repo/hooks'; // 统一入口引入
import {
  useNavigate,
  useLocation,
  Outlet,
  Link,
  Navigate,
} from 'react-router-dom';
import { routes } from './router';

const { Header, Sider, Content } = Layout;

/**
 * 将嵌套路由配置拍平为面包屑映射表
 * 输出格式: { '/home': '控制台', '/system/user': '用户列表' }
 */
const generateBreadcrumbMap = (routes, parentPath = '') => {
  let map = {};
  routes.forEach((route) => {
    if (!route.label) return;
    // 处理路径拼接，确保格式为 /path/subpath
    const fullPath = route.path.startsWith('/')
      ? route.path
      : `${parentPath}/${route.path}`.replace(/\/+/g, '/');

    // 映射名称
    map[fullPath] = { label: route.label, clickable: !!route.element };

    // 如果有子路由，递归处理
    if (route.children) {
      Object.assign(map, generateBreadcrumbMap(route.children, fullPath));
    }
  });
  return map;
};

const LayoutWrapper = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = useUserStore((state) => state.isLogin);
  // 1. 判断登录状态：如果未登录，重定向到登录页
  // state 记录当前路径，方便登录后跳回
  if (!isLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 1. 性能优化：使用 useMemo 仅在初始化时生成一次映射表
  const breadcrumbNameMap = useMemo(() => generateBreadcrumbMap(routes), []);

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

  // --- 2. 动态生成面包屑 ---
  const breadcrumbItems = useMemo(() => {
    /**
     * 改进后的面包屑查找函数：支持动态参数匹配
     */
    const findRoute = (path, map) => {
      // 1. 精确匹配
      if (map[path]) return map[path];

      // 2. 模糊匹配 (将 :id 转换为正则)
      const targetKey = Object.keys(map).find((key) => {
        const regexPath = key.replace(/:[^/]+/g, '[^/]+'); // 将 :id 替换为匹配非斜杠的正则
        return new RegExp(`^${regexPath}$`).test(path);
      });
      return map[targetKey];
    };
    // 解析当前路径片段
    const pathSnippets = location.pathname.split('/').filter((i) => i);
    // 生成面包屑子项
    const breadcrumbItems = pathSnippets
      .map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSnippets.length - 1;
        const { label, clickable } = findRoute(url, breadcrumbNameMap) || {};
        // 如果路由配置里没写 label（比如中间层容器），则不显示或显示路径名
        if (!label) return null;
        return isLast || !clickable ? (
          <Breadcrumb.Item key={url}>{label}</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item key={url}>
            <Link to={url}>{label}</Link>
          </Breadcrumb.Item>
        );
      })
      .filter(Boolean); // 过滤掉 null

    return breadcrumbItems;
  }, [location.pathname, breadcrumbNameMap]);

  // --- 3. 构造侧边栏菜单 ---
  const menuItems = useMemo(() => {
    const filterMenu = (list, parentPath = '') => {
      return list
        .filter((item) => hasPermission(item.auth))
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
          <Breadcrumb>{breadcrumbItems}</Breadcrumb>

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
