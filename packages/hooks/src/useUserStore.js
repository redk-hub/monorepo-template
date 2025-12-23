import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'hooks_user';

export const useUserStore = create(
  persist(
    (set) => ({
      // --- 状态 (State) ---
      userInfo: null,
      permissions: [],

      // --- 动作 (Actions) 用于更新值 ---
      setAuth: (user, perms) => {
        set({
          userInfo: user,
          permissions: perms,
        });
      },

      // 2. 局部更新：只更新头像或昵称
      updateUser: (newInfo) =>
        set((state) => {
          const newUser = { ...state.userInfo, ...newInfo };
          return { userInfo: newUser };
        }),

      // 3. 重置：退出登录
      logout: () => {
        set({
          userInfo: null,
          permissions: [],
        });
      },
    }),
    {
      name: STORAGE_KEY,
      // Persist only userInfo and permissions;
      partialize: (state) => ({
        userInfo: state.userInfo,
        permissions: state.permissions,
      }),
      getStorage: () => localStorage,
    },
  ),
);
