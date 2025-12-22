import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from 'antd';
import { fetchUser, fetchUsers } from './api';
import { request } from '@my-repo/utils';

export default function DependentParallel() {
  const [selectedId, setSelectedId] = useState(1);

  const userQuery = useQuery(
    ['user', selectedId],
    () => fetchUser(selectedId),
    {
      enabled: !!selectedId,
    },
  );

  const listQuery = useQuery(['users', { page: 1, size: 3 }], fetchUsers);
  const extraQuery = useQuery(['users-extra'], () =>
    request.get('/api/users?size=2&page=3'),
  );

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
        <div>{userQuery.isLoading ? '加载中...' : userQuery.data?.name}</div>
      </div>
      <div style={{ marginTop: 8 }}>
        <strong>并行查询（两个列表）：</strong>
        <div>
          list: {listQuery.isLoading ? '加载中' : listQuery.data.list.length}
        </div>
        <div>
          extra: {extraQuery.isLoading ? '加载中' : extraQuery.data.list.length}
        </div>
      </div>
    </div>
  );
}


