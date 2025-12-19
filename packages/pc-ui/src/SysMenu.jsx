// filepath: d:\newWorkspace\my-repo\packages\pc-ui\src\SysMenu.jsx
import React, { useMemo } from 'react';
import { Menu, Avatar, Space } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { usePermission, useUserStore } from '@my-repo/hooks';

export const SysMenu = ({ routes = [] }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasPermission } = usePermission();
  const userInfo = useUserStore((s) => s.userInfo);
  const logout = useUserStore((s) => s.logout);

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

  // 计算选中的顶级路径（以第一个路径段为准）
  const selectedKey = useMemo(() => {
    const parts = location.pathname.split('/').filter(Boolean);
    const first = parts.length ? `/${parts[0]}` : '/';

    // 如果 first 匹配到现有顶级项则返回，否则尝试更精确的匹配
    const exists = topItems.find((it) => it.key === first);
    if (exists) return first;

    // 否则尝试按完整路径匹配（支持参数化）
    for (const it of topItems) {
      try {
        const pattern = it.key.replace(/:[^/]+/g, '[^/]+');
        if (new RegExp(`^${pattern}`).test(location.pathname)) return it.key;
      } catch (e) {
        // ignore
      }
    }

    return first;
  }, [location.pathname, topItems]);

  // 使用 segments 数组构建路径，避免重复斜杠或重复父路径
  const buildPathFromSegments = (segments) =>
    `/${segments.filter(Boolean).join('/')}`;

  // 递归查找第一个有 element 且有权限的子路由，使用 segments 路径片段数组
  const findFirstElementPath = (node, segments = []) => {
    if (!node) return null;

    // 计算当前节点完整路径
    const currentSegments = [...segments];
    if (node.path) {
      // 如果 node.path 是绝对路径（以 / 开始），直接替换为其片段，否则追加
      if (node.path.startsWith('/')) {
        const segs = node.path.split('/').filter(Boolean);
        currentSegments.length = 0;
        currentSegments.push(...segs);
      } else {
        const segs = node.path.split('/').filter(Boolean);
        // avoid duplicating segment if child path already contains parent segment
        if (
          currentSegments.length > 0 &&
          segs.length > 0 &&
          currentSegments[currentSegments.length - 1] === segs[0]
        ) {
          segs.shift();
        }
        currentSegments.push(...segs);
      }
    }

    const fullPath = buildPathFromSegments(currentSegments);

    if (node.element && hasPermission(node.auth)) return fullPath;

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        const res = findFirstElementPath(child, currentSegments);
        if (res) return res;
      }
    }

    return null;
  };

  // 去除相邻重复的片段，例如 ['/system','/system','user'] -> ['/system','user']
  const normalizePathByRemovingAdjacentDuplicates = (path) => {
    const segs = path.split('/').filter(Boolean);
    if (segs.length <= 1) return `/${segs.join('/')}`;
    const out = [];
    for (const s of segs) {
      if (out.length === 0 || out[out.length - 1] !== s) out.push(s);
    }
    return `/${out.join('/')}`;
  };

  const onClick = ({ key }) => {
    if (!key) return;
    if (key === 'logout') {
      logout();
      navigate('/login', { replace: true });
      return;
    }

    if (!key.startsWith('/')) return;

    // 找到对应的顶级路由定义
    const topRoute = (routes || []).find((r) => {
      const fp = r.path?.startsWith('/') ? r.path : `/${r.path}`;
      return fp === key;
    });

    if (topRoute) {
      // 如果顶级路由本身有 element 并可访问，直接跳转
      const topFull = key;
      if (topRoute.element && hasPermission(topRoute.auth)) {
        navigate(topFull);
        return;
      }

      // 否则查找第一个可访问且带 element 的子路由
      // 直接从顶级节点开始查找，传空 segments 避免重复追加顶级 path
      const target = findFirstElementPath(topRoute, []);
      if (target) {
        const normalized = target.replace(/\/+/g, '/');
        const deduped = normalizePathByRemovingAdjacentDuplicates(normalized);
        if (deduped !== normalized) {
          // eslint-disable-next-line no-console
          console.warn('SysMenu: normalized duplicated segments', {
            original: normalized,
            deduped,
          });
        }
        // Debug log for investigation
        // eslint-disable-next-line no-console
        console.info('SysMenu: navigate target', {
          key,
          target,
          normalized,
          deduped,
        });
        navigate(deduped);
        return;
      }
    }

    // 回退到直接跳转 key（可能会渲染空的 outlet）
    const fallbackRaw = key.replace(/\/+/g, '/');
    const fallback = normalizePathByRemovingAdjacentDuplicates(fallbackRaw);
    // eslint-disable-next-line no-console
    console.warn(
      'SysMenu: no child with element found for top route, fallback navigate to',
      {
        original: fallbackRaw,
        deduped: fallback,
      },
    );
    navigate(fallback);
  };

  return (
    <Menu
      style={{ flex: 1 }}
      mode="horizontal"
      selectable
      selectedKeys={[selectedKey]}
      onClick={onClick}
      items={topItems}
    />
  );
};

export default SysMenu;
