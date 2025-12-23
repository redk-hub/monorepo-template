import React from 'react';
import { Card } from 'antd-mobile';
import { useUserStore, useMount } from '@my-repo/hooks'; // 从你的公共包引入

const Home = () => {
  // 从 Zustand Store 获取用户信息
  const userInfo = useUserStore((state) => state.userInfo);

  // 使用从公共包抛出的 ahooks (useMount)
  useMount(() => {
    console.log('欢迎来到首页');
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>你好，{userInfo?.name || '管理员'}！欢迎回来。</h2>

      <Card title="项目说明" style={{ marginTop: '20px' }}>
        <p>
          这是一个基于 <b>Monorepo</b> 架构的企业级后台模板：
        </p>
        <ul>
          <li>
            <b>状态管理：</b> 使用 Zustand (位于 packages/hooks)
          </li>
          <li>
            <b>组件复用：</b> packages/pc-ui & packages/mobile-ui
          </li>
          <li>
            <b>页面结构：</b> 支持多级路由和布局组件拆分
          </li>
          <li>
            <b>权限控制：</b> 基于 usePermission 钩子实现菜单和路由过滤
          </li>
          <li>
            <b>数据获取：</b> React Query (TanStack Query)
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Home;
