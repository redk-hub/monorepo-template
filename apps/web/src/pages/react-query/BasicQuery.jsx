import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { List } from 'antd';
import { fetchUsers } from './api';

export default function BasicQuery() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', { page: 1, size: 5 }],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>加载中（BasicQuery）...</div>;
  if (isError) return <div>请求出错（BasicQuery）</div>;

  return (
    <div>
      <h3>基础查询（useQuery）</h3>
      <List
        size="small"
        bordered
        dataSource={data.list}
        renderItem={(item) => (
          <List.Item>{`${item.id} - ${item.name}`}</List.Item>
        )}
      />
    </div>
  );
}
