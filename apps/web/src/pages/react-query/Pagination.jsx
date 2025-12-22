import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, List } from 'antd';
import { fetchUsers } from './api';

export default function Pagination() {
  const [page, setPage] = useState(1);
  const size = 5;
  const { data, isFetching } = useQuery({
    queryKey: ['users', { page, size }],
    queryFn: fetchUsers,
    keepPreviousData: true,
  });

  return (
    <div>
      <h3>分页示例（keepPreviousData）</h3>
      <div style={{ marginBottom: 8 }}>
        <Button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          上一页
        </Button>
        <Button onClick={() => setPage((p) => p + 1)} style={{ marginLeft: 8 }}>
          下一页
        </Button>
        <span style={{ marginLeft: 12 }}>
          {isFetching ? '加载中...' : `当前页：${page}`}
        </span>
      </div>
      <List
        size="small"
        bordered
        dataSource={data?.list || []}
        renderItem={(item) => (
          <List.Item>{`${item.id} - ${item.name}`}</List.Item>
        )}
      />
    </div>
  );
}
