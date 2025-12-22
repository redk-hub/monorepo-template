import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Divider, Space } from 'antd';

export default function ReactQueryIndex() {
  return (
    <div style={{ padding: 16 }}>
      <h2>React Query 示例导航</h2>
      <p>选择左侧菜单或点击下面的链接查看各个示例：</p>
      <Space size="middle" wrap>
        <Link to="basic">基础查询</Link>
        <Link to="mutations">变更与乐观更新</Link>
        <Link to="pagination">分页</Link>
        <Link to="infinite">无限分页</Link>
        <Link to="dependent-parallel">依赖与并行查询</Link>
        <Link to="prefetch">预取与失效</Link>
        <Link to="suspense">Suspense 示例</Link>
      </Space>
      <Divider />
      <Outlet />
    </div>
  );
}


