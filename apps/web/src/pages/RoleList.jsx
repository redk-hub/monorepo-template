import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useLocation } from 'react-router-dom';

const List = () => {
  const [val, setVal] = useState('');
  const location = useLocation();

  return (
    <div>
      <h2>列表页</h2>
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="输入内容切换菜单再回来，内容依然在"
      />
    </div>
  );
};

export default List;
