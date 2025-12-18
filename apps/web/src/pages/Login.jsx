import React from 'react';
import { Button, message } from 'antd';
import { useUserStore } from '@my-repo/hooks'; // 从你的公共包引入
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
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
    ];

    // 2. 更新 Store 里的值
    // 调用这个函数后，所有引用了 userInfo 或 permissions 的组件都会自动重新渲染
    setAuth(mockUser, mockPerms);

    message.success('登录成功');

    // 3. 跳转到首页
    navigate('/home');
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
