import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Spin, Result, Button, Space } from 'antd';

const UserDetail = () => {
  const { id } = useParams(); // 从路由参数中获取 ID
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // 模拟 API 请求
    const fetchUserDetail = async () => {
      try {
        // 假设这里进行一个异步请求，例如 axios.get(`/api/users/${id}`)
        await new Promise((resolve) => setTimeout(resolve, 800)); // 模拟网络延迟

        if (id === 'error') {
          // 模拟请求失败
          throw new Error('用户数据加载失败');
        }
        if (id === 'notfound') {
          // 模拟用户不存在
          setUserData(null);
          return;
        }

        // 模拟成功获取数据
        setUserData({
          id: id,
          name: `用户 ${id}`,
          email: `user${id}@example.com`,
          phone: `1380013800${id % 10}`,
          address: `某省某市某区街道 ${id} 号`,
          createdAt: `2023-01-${(parseInt(id) % 28) + 1} 10:00:00`,
          lastLogin: `2024-03-${(parseInt(id) % 30) + 1} 15:30:00`,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();

    // 清理函数（如果组件卸载，可以取消进行中的请求）
    return () => {
      // 如果有 Axios CancelToken 等，可以在这里取消请求
    };
  }, [id]); // 当 ID 变化时重新加载数据

  if (loading) {
    return (
      <Card title={`用户详情 (ID: ${id})`} bordered style={{ width: '100%' }}>
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Spin size="large" tip="加载中..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="加载失败"
        subTitle={error}
        extra={
          <Button type="primary" onClick={() => navigate(-1)}>
            返回上一页
          </Button>
        }
      />
    );
  }

  if (!userData) {
    return (
      <Result
        status="404"
        title="用户不存在"
        subTitle={`ID 为 ${id} 的用户未能找到。`}
        extra={
          <Button type="primary" onClick={() => navigate('/system/user')}>
            返回用户列表
          </Button>
        }
      />
    );
  }

  return (
    <Card
      title={`用户详情 (ID: ${userData.id})`}
      bordered
      style={{ width: '100%' }}
    >
      <Descriptions bordered column={2}>
        <Descriptions.Item label="用户ID">{userData.id}</Descriptions.Item>
        <Descriptions.Item label="姓名">{userData.name}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{userData.email}</Descriptions.Item>
        <Descriptions.Item label="电话">{userData.phone}</Descriptions.Item>
        <Descriptions.Item label="地址" span={2}>
          {userData.address}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {userData.createdAt}
        </Descriptions.Item>
        <Descriptions.Item label="上次登录">
          {userData.lastLogin}
        </Descriptions.Item>
      </Descriptions>
      <Space style={{ marginTop: 24 }}>
        <Button onClick={() => navigate(-1)}>返回</Button>
        <Button
          type="primary"
          onClick={() => message.info('编辑功能开发中...')}
        >
          编辑
        </Button>
      </Space>
    </Card>
  );
};

export default UserDetail;
