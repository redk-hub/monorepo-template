import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd-mobile';

export default function List({ data }) {
  const navigate = useNavigate();
  const [val, setVal] = useState('');

  return (
    <div style={{ padding: 16 }}>
      <Input
        value={val}
        onChange={(e) => setVal(e.target.value)}
        placeholder="输入内容切换菜单再回来，内容依然在"
      />
      {data.map((item) => (
        <div key={item.id} onClick={() => navigate(`/system/user/${item.id}`)}>
          {item.name}
        </div>
      ))}
    </div>
  );
}
