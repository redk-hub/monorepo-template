import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Input, Space, message } from 'antd';
import { createUser, updateUser } from './api';

export default function Mutations() {
  const queryClient = useQueryClient();
  const [name, setName] = useState('新用户');

  const create = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success('创建成功，已刷新列表');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const update = useMutation({
    mutationFn: updateUser,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: ['users'] });
      const previous = queryClient.getQueriesData({ queryKey: ['users'] });
      queryClient.setQueryData(['users', { page: 1, size: 5 }], (old) => {
        if (!old) return old;
        return {
          ...old,
          list: old.list.map((u) =>
            u.id === variables.id ? { ...u, ...variables } : u,
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      message.error('更新失败，已回滚');
      if (context?.previous) {
        context.previous.forEach(([key, value]) =>
          queryClient.setQueryData(key, value),
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <div>
      <h3>变更与乐观更新（useMutation）</h3>
      <Space>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: 200 }}
        />
        <Button
          onClick={() => create.mutate({ name })}
          loading={create.isLoading}
        >
          创建用户
        </Button>
      </Space>
      <div style={{ marginTop: 12 }}>
        <Button
          onClick={() => update.mutate({ id: 1, name: `${name} (optimistic)` })}
          loading={update.isLoading}
        >
          乐观更新示例（把 id=1 的用户改名）
        </Button>
      </div>
    </div>
  );
}
