import { request } from '@my-repo/utils';

export const fetchUsers = async ({ queryKey }) => {
  const [_key, { page = 1, size = 5 }] = queryKey;
  const res = await request.get('/api/users', { params: { page, size } });
  return res;
};

export const fetchUser = async (id) => {
  const res = await request.get(`/api/users/${id}`);
  return res;
};

export const createUser = async (payload) => {
  const res = await request.post('/api/users', payload);
  return res;
};

export const updateUser = async ({ id, ...patch }) => {
  const res = await request.patch(`/api/users/${id}`, patch);
  return res;
};

export const fetchUsersInfinite = async ({ pageParam = 1 }) => {
  const res = await request.get('/api/users', {
    params: { page: pageParam, size: 5 },
  });
  return { data: res.list, nextPage: res.page + 1, total: res.total };
};
