import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const [val, setVal] = useState('');
  const navigate = useNavigate();

  return (
    <div>
      <h2>列表页</h2>
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="输入内容切换菜单再回来，内容依然在"
      />
      <Button onClick={() => navigate(`/system/user/detail/${111}`)}>
        查看用户 1
      </Button>
    </div>
  );
};

export default List;
