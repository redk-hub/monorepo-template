import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from 'antd';

export default function List({ data, setData, scrollTopRef }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [val, setVal] = useState('');

  // 首次加载数据
  useEffect(() => {
    if (data.length === 0) {
      fetch('/api/list')
        .then((res) => res.json())
        .then(setData);
    }
  }, []);

  // 每次显示时恢复滚动位置
  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTopRef.current;
    }
  });

  return (
    <div ref={containerRef}>
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
