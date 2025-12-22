import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import { fetchUser, fetchUsers } from './api';
import { request } from '@my-repo/utils';

export default function DependentParallel() {
  const [selectedId, setSelectedId] = useState(1);

  const userQuery = useQuery({
    queryKey: ['user', selectedId],
    queryFn: () => fetchUser(selectedId),
    enabled: !!selectedId,
  });

  const listQuery = useQuery({
    queryKey: ['users', { page: 1, size: 3 }],
    queryFn: fetchUsers,
  });
  const extraQuery = useQuery({
    queryKey: ['users-extra'],
    queryFn: () => request.get('/api/users?size=2&page=3'),
  });

  const renderUser = () => {
    if (userQuery.isLoading) return '加载中...';
    if (userQuery.isError) return '请求出错';
    return userQuery.data?.name || '无数据';
  };

  const renderListCount = () => {
    if (listQuery.isLoading) return '加载中';
    if (listQuery.isError) return '请求出错';
    return listQuery.data?.list?.length ?? 0;
  };

  const renderExtraCount = () => {
    if (extraQuery.isLoading) return '加载中';
    if (extraQuery.isError) return '请求出错';
    return extraQuery.data?.list?.length ?? 0;
  };

  return (
    <div>
      <h3>依赖与并行查询</h3>
      <div style={{ marginBottom: 8 }}>
        <Button onClick={() => setSelectedId((s) => s + 1)}>
          选择下一个用户（ID +1）
        </Button>
        <span style={{ marginLeft: 8 }}>当前选中 id: {selectedId}</span>
      </div>
      <div>
        <strong>依赖查询（user）：</strong>
        <div>{renderUser()}</div>
      </div>
      <div style={{ marginTop: 8 }}>
        <strong>并行查询（两个列表）：</strong>
        <div>list: {renderListCount()}</div>
        <div>extra: {renderExtraCount()}</div>
      </div>
    </div>
  );
}
