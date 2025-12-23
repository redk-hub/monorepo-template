import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button, List } from 'antd';
import { fetchUsers } from './api';
import { useNavigate } from 'react-router-dom';

export default function Pagination() {
  const navigate = useNavigate();

  const [page, setPage] = useState(() => {
    return Number(sessionStorage.getItem('last_page')) || 1;
  }); // 什么清除last_page？
  const size = 5;
  const { data, isFetching } = useQuery({
    queryKey: ['users', { page, size }],
    queryFn: fetchUsers,
    keepPreviousData: true,
  });

  // 监听 page 变化并记录
  useEffect(() => {
    sessionStorage.setItem('last_page', String(page));
  }, [page]);

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
        onClick={() => navigate(`/system/user/${1}`)}
        renderItem={(item) => (
          <List.Item>{`${item.id} - ${item.name}`}</List.Item>
        )}
      />
    </div>
  );
}
