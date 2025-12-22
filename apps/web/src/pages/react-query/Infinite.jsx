import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Button, List } from 'antd';
import { fetchUsersInfinite } from './api';

export default function Infinite() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      ['users-infinite'],
      ({ pageParam = 1 }) => fetchUsersInfinite({ pageParam }),
      {
        getNextPageParam: (lastPage) => {
          const totalPages = Math.ceil(lastPage.total / 5);
          return lastPage.nextPage <= totalPages
            ? lastPage.nextPage
            : undefined;
        },
      },
    );

  if (isLoading) return <div>加载中（Infinite）...</div>;

  return (
    <div>
      <h3>无限滚动/分页（useInfiniteQuery）</h3>
      <List
        size="small"
        bordered
        dataSource={data.pages.flatMap((p) => p.data)}
        renderItem={(item) => (
          <List.Item>{`${item.id} - ${item.name}`}</List.Item>
        )}
      />
      <div style={{ marginTop: 8 }}>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? '加载中...'
            : hasNextPage
              ? '加载更多'
              : '没有更多'}
        </Button>
      </div>
    </div>
  );
}


