import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'hooks_user';

const loadInitial = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage)
      return { userInfo: null, permissions: [], isLogin: false };
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { userInfo: null, permissions: [], isLogin: false };
    const parsed = JSON.parse(raw);
    // persist middleware stores the data under { state: { ... } }
    const persistedState = parsed?.state ?? parsed;
    const userInfo = persistedState?.userInfo ?? null;
    const permissions = persistedState?.permissions ?? [];
    return { userInfo, permissions, isLogin: !!userInfo };
  } catch (e) {
    // If anything goes wrong, fall back to default empty state
    // eslint-disable-next-line no-console
    console.error('Failed to read user storage', e);
    return { userInfo: null, permissions: [], isLogin: false };
  }
};

// Helper to synchronously write the persisted shape to localStorage
const writeStorage = (userInfo, permissions) => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const payload = {
      state: { userInfo: userInfo ?? null, permissions: permissions ?? [] },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Failed to write user storage', e);
  }
};

export const useUserStore = create(
  persist(
    (set) => ({
      // --- 状态 (State) ---
      ...loadInitial(),

      // --- 动作 (Actions) 用于更新值 ---
      // 1. 同步更新：登录成功后设置数据
      setAuth: (user, perms) => {
        set({
          userInfo: user,
          permissions: perms,
          isLogin: true,
        });
        // 同步写 storage
        writeStorage(user, perms);
      },

      // 2. 局部更新：只更新头像或昵称
      updateUser: (newInfo) =>
        set((state) => {
          const newUser = { ...state.userInfo, ...newInfo };
          // 先写 storage，再更新 state（确保存储与 state 一致）
          writeStorage(newUser, state.permissions);
          return { userInfo: newUser };
        }),

      // 3. 重置：退出登录
      logout: () => {
        set({
          userInfo: null,
          permissions: [],
          isLogin: false,
        });
        writeStorage(null, []);
      },
    }),
    {
      name: STORAGE_KEY,
      // Persist only userInfo and permissions; isLogin is derived on load
      partialize: (state) => ({
        userInfo: state.userInfo,
        permissions: state.permissions,
      }),
      getStorage: () => localStorage,
    },
  ),
);
