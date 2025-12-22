import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Space, message } from 'antd';
import { fetchUser } from './api';

export default function PrefetchInvalidate() {
  const queryClient = useQueryClient();

  const prefetch = async () => {
    await queryClient.prefetchQuery({
      queryKey: ['user', 1],
      queryFn: () => fetchUser(1),
    });
    message.success('已预取 user/1');
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    message.success('已使 users 查询失效');
  };

  return (
    <div>
      <h3>预取与使失效</h3>
      <Space>
        <Button onClick={prefetch}>预取 user/1</Button>
        <Button onClick={invalidate}>使 users 失效</Button>
      </Space>
    </div>
  );
}
