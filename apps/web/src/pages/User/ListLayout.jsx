import { Outlet, useLocation } from 'react-router-dom';
import { useRef, useState } from 'react';
import List from './List';

const ListLayout = () => {
  const location = useLocation();

  // 1️⃣ 列表数据
  const [list, setList] = useState([{ id: '1', name: 'test' }]);

  // 2️⃣ 滚动位置
  const scrollTopRef = useRef(0);

  const isDetail = location.pathname !== '/system/user';

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      {/* 列表页：始终存在 */}
      <div
        style={{
          display: isDetail ? 'none' : 'block',
          height: '100%',
          overflow: 'auto',
        }}
        onScroll={(e) => {
          scrollTopRef.current = e.currentTarget.scrollTop;
        }}
      >
        <List data={list} setData={setList} scrollTopRef={scrollTopRef} />
      </div>

      {/* 详情页 */}
      <Outlet />
    </div>
  );
};

export default ListLayout;
