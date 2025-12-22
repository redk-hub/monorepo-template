import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchUser } from './api';

function SuspenseQuery() {
  const { data } = useQuery(['user', 1], () => fetchUser(1), {
    suspense: true,
  });
  return <div>Suspense 查询结果: {data.name}</div>;
}

export default function SuspenseExample() {
  return (
    <div>
      <h3>Suspense 与错误边界</h3>
      <Suspense fallback={<div>Suspense 加载中...</div>}>
        <SuspenseQuery />
      </Suspense>
    </div>
  );
}


