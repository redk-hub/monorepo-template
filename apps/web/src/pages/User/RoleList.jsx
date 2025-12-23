import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useLocation } from 'react-router-dom';

const List = () => {
  const [val, setVal] = useState('');
  const location = useLocation();

  return (
    <div>
      <div style={{ fontSize: 32, marginBottom: 20 }}>列表页</div>
      <Input value={val} onChange={(e) => setVal(e.target.value)} />
    </div>
  );
};

export default List;
