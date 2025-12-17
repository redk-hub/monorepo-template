import React, { useState } from 'react';
import { Input, Button } from 'antd';
import KeepAlive, { useAliveController } from 'react-activation';
import { useLocation } from 'react-router-dom';

const List = () => {
  const [val, setVal] = useState('');
  const location = useLocation();
  const { dropByCacheKey } = useAliveController();

  const handleManualDrop = () => {
    // 演示在页面内部清理特定 key 的缓存
    dropByCacheKey(location.pathname);
    alert('缓存已清理，刷新页面后生效');
  };

  return (
    <KeepAlive cacheKey={location.pathname} name="ListPage">
      <div>
        <h2>列表页 (KeepAlive)</h2>
        <Input
          value={val}
          onChange={(e) => setVal(e.target.value)}
          placeholder="输入内容切换菜单再回来，内容依然在"
        />
        <Button onClick={handleManualDrop} style={{ marginTop: 10 }}>
          点我清理当前页缓存 (dropByCacheKey 示例)
        </Button>
      </div>
    </KeepAlive>
  );
};

export default List;
