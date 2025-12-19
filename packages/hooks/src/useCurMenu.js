import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';

export const useCurMenu = (routes) => {
  const location = useLocation();

  return useMemo(() => {
    // 计算选中的顶级路径（以第一个路径段为准）
    const parts = location.pathname.split('/').filter(Boolean);
    const first = parts.length ? `/${parts[0]}` : '/';

    const top = (routes || []).find((r) => {
      const fp = r.path?.startsWith('/') ? r.path : `/${r.path}`;
      return fp === first || `/${r.path}` === first;
    });

    const children = top && Array.isArray(top.children) ? top.children : null;
    return { topMenuPath: first, topMenuChildren: children };
  }, [location.pathname, routes]);
};
