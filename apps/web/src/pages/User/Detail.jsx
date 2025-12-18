import { useNavigate, useParams } from 'react-router-dom';

export default function Detail() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div>
      <button onClick={() => navigate(-1)}>返回</button>
      <div>详情页：{id}</div>
    </div>
  );
}
