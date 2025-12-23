// filepath: d:\newWorkspace\my-repo\packages\pc-ui\src\TopMenu.jsx
import React, { useMemo } from 'react';
import { Menu, Avatar, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usePermission, useUserStore, useCurMenu } from '@my-repo/hooks';

export const TopMenu = ({ routes = [] }) => {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const userInfo = useUserStore((s) => s.userInfo);
  const logout = useUserStore((s) => s.logout);
  const { topMenuPath } = useCurMenu(routes);

  // 构建顶级路由菜单项（仅第一层）
  const topItems = useMemo(() => {
    const list = (routes || [])
      .filter(
        (r) => r && r.path && r.label && !r.hideInMenu && hasPermission(r.auth),
      )
      .map((r) => {
        const fullPath = r.path.startsWith('/') ? r.path : `/${r.path}`;
        return { key: fullPath, label: r.label };
      });

    // 用户信息放右侧，不参与选中
    list.push({
      key: 'sys_user',
      label: (
        <Space>
          <Avatar
            size="small"
            src={userInfo?.avatar}
            icon={!userInfo?.avatar}
          />
          <span>{userInfo?.name || '未登录'}</span>
        </Space>
      ),
      style: { marginLeft: 'auto', pointerEvents: 'none' },
    });

    // 添加退出项作为末尾可点击项（不在 children）
    list.push({ key: 'logout', label: '退出登录' });

    return list;
  }, [routes, hasPermission, userInfo]);

  const onClick = ({ key }) => {
    if (!key) return;
    if (key === 'logout') {
      logout();
      // navigate('/login', { replace: true });
      return;
    }
    navigate(key);
  };

  return (
    <Menu
      style={{ flex: 1 }}
      mode="horizontal"
      selectable
      selectedKeys={[topMenuPath]}
      onClick={onClick}
      items={topItems}
    />
  );
};

export default TopMenu;
