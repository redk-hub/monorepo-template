import MockAdapter from 'axios-mock-adapter';
import { request } from '@my-repo/utils';

const mock = new MockAdapter(request, { delayResponse: 500 });

// prepare fake data
const USERS = Array.from({ length: 23 }).map((_, i) => ({
  id: i + 1,
  name: `用户-${i + 1}`,
}));

// helper to wrap response as { code:0, data }
const ok = (data) => ({ code: 0, data });
const err = (msg) => ({ code: 1, msg });

// GET /api/users?page=&size=&id query
mock.onGet('/api/users').reply((config) => {
  const params = config.params || {};
  const page = parseInt(params.page || 1, 10);
  const size = parseInt(params.size || 5, 10);
  const start = (page - 1) * size;
  const list = USERS.slice(start, start + size);
  const total = USERS.length;
  return [200, ok({ list, page, size, total })];
});

// GET /api/users/:id
mock.onGet(new RegExp('/api/users/\\d+$')).reply((config) => {
  const id = config.url.split('/').pop();
  const user = USERS.find((u) => u.id == id);
  if (!user) return [404, err('用户不存在')];
  return [200, ok(user)];
});

// POST /api/users
mock.onPost('/api/users').reply((config) => {
  try {
    const body = JSON.parse(config.data || '{}');
    const id = USERS.length + 1;
    const newUser = { id, name: body.name || `用户-${id}` };
    USERS.push(newUser);
    return [200, ok(newUser)];
  } catch (e) {
    return [400, err('参数错误')];
  }
});

// PATCH /api/users/:id
mock.onPatch(new RegExp('/api/users/\\d+$')).reply((config) => {
  try {
    const match = config.url.match(/\/api\/users\/(\\d+)$/);
    const id = Number(match[1]);
    const body = JSON.parse(config.data || '{}');
    const idx = USERS.findIndex((u) => u.id === id);
    if (idx === -1) return [404, err('用户不存在')];
    USERS[idx] = { ...USERS[idx], ...body };
    return [200, ok(USERS[idx])];
  } catch (e) {
    return [400, err('参数错误')];
  }
});

export default mock;
