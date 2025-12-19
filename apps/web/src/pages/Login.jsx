import React from 'react';
import { Button, message } from 'antd';
import { useUserStore } from '@my-repo/hooks'; // 从你的公共包引入
import { useNavigate, useLocation } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 仅获取更新状态的函数 setAuth
  const setAuth = useUserStore((state) => state.setAuth);

  const handleLogin = async () => {
    // 1. 模拟请求 API
    const mockUser = { id: 1, name: '张三', avatar: 'xxx' };
    const mockPerms = [
      'home:view',
      'system:view',
      'user:view',
      'role:view',
      'user:detail',
      'role:list',
    ];

    // 2. 更新 Store 里的值
    // 调用这个函数后，所有引用了 userInfo 或 permissions 的组件都会自动重新渲染
    setAuth(mockUser, mockPerms);

    message.success('登录成功');

    // 3. 登录后跳回原先想访问的页面（如果有），否则跳到 /home
    const rawFrom =
      location.state && location.state.from ? location.state.from : null;
    let to = '/home';
    if (rawFrom) {
      // 支持传入整个 location 对象或字符串路径
      if (typeof rawFrom === 'string') {
        to = rawFrom;
      } else {
        const pathname = rawFrom.pathname || '/home';
        const search = rawFrom.search || '';
        const hash = rawFrom.hash || '';
        to = `${pathname}${search}${hash}`;
      }
    }
    navigate(to, { replace: true });
  };

  return (
    <div style={{ padding: 100, textAlign: 'center' }}>
      <h1>系统登录</h1>
      <Button type="primary" onClick={handleLogin}>
        一键模拟登录
      </Button>
    </div>
  );
};

export default LoginPage;
