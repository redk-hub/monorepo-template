import axios from 'axios';

export const request = axios.create({
  baseURL: '/',
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

// 2. 统一跳转登录的逻辑
// 支持通过 react-router-dom 的 useNavigate 注册导航函数，也兼容 window.location 回退
let navigateLoginFn = null;
export const setNavigateLogin = (fn) => {
  navigateLoginFn = fn;
};

const navigateToLogin = () => {
  if (navigateLoginFn) {
    try {
      navigateLoginFn();
      return;
    } catch (e) {
      // 如果注册的 navigate 出错，继续走回退逻辑
      console.error('navigateToLogin 调用失败,', e);
    }
  }

  console.error('请设置setNavigateLogin');
};

// 3. 请求拦截器：携带 Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 4. 响应拦截器：核心逻辑
request.interceptors.response.use(
  (response) => {
    const { code, data, msg } = response.data;

    // 业务逻辑成功
    if (code === 0) {
      return data; // 直接返回 data，方便后续使用
    }

    // 业务逻辑失败：401 未授权
    if (code === 401) {
      navigateToLogin();
      return Promise.reject(new Error(msg || '登录失效'));
    }

    // 其他业务错误（code != 0）
    // 这里抛出错误，以便 TanStack Query 或 try-catch 能捕获
    console.error(`[API Error]: ${msg}`);
    return Promise.reject(new Error(msg || '未知请求失败'));
  },
  (error) => {
    // 处理 HTTP 状态码错误
    if (error.response?.status === 401) {
      navigateToLogin();
    }

    const message =
      error.response?.data?.msg || error.message || '网络连接异常';
    return Promise.reject(new Error(message));
  },
);
