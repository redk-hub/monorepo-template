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

      // 局部更新：只更新头像或昵称
      updateUser: (newInfo) =>
        set((state) => {
          const newUser = { ...state.userInfo, ...newInfo };
          return { userInfo: newUser };
        }),

      //  重置：退出登录
      logout: () => {
        set({
          userInfo: null,
          permissions: [],
        });
      },
    }),
    {
      name: STORAGE_KEY,
      // 只持久化 userInfo、permissions;
      partialize: (state) => ({
        userInfo: state.userInfo,
        permissions: state.permissions,
      }),
      getStorage: () => localStorage,
      version: 1, // 当修改了数据结构，避免程序崩溃，可以设置版本号
    },
  ),
);
