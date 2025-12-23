import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import List from './List';

const ListLayout = () => {
  const location = useLocation();

  // 1️⃣ 列表数据
  const [list, setList] = useState([]);

  const queryData = () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          Array.from({ length: 50 }).map((_, i) => ({
            id: `${i + 1}`,
            name: `用户 ${i + 1}`,
          })),
        );
      }, 500);
    });
  };

  useEffect(() => {
    queryData().then((data) => {
      setList(data);
    });
  }, []);

  const isDetail = location.pathname !== '/system/user';

  return (
    <div style={{ height: '100%', position: 'relative' }}>
      {/* 列表页：始终存在 */}
      <div
        style={{
          display: isDetail ? 'none' : 'block',
          height: '100%',
          overflow: 'auto',
        }}
      >
        <List data={list} setData={setList} />
      </div>

      {/* 详情页 */}
      <Outlet />
    </div>
  );
};

export default ListLayout;
