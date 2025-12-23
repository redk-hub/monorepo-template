import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'antd-mobile';

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <Button onClick={() => navigate(-1)}>返回</Button>
      <div>详情页：{id}</div>
    </div>
  );
}
