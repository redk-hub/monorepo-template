import { create } from 'zustand';

export const useUserStore = create((set) => ({
  // --- 状态 (State) ---
  userInfo: null,
  permissions: [],
  isLogin: false,

  // --- 动作 (Actions) 用于更新值 ---
  // 1. 同步更新：登录成功后设置数据
  setAuth: (user, perms) =>
    set({
      userInfo: user,
      permissions: perms,
      isLogin: true,
    }),

  // 2. 局部更新：只更新头像或昵称
  updateUser: (newInfo) =>
    set((state) => ({
      userInfo: { ...state.userInfo, ...newInfo },
    })),

  // 3. 重置：退出登录
  logout: () =>
    set({
      userInfo: null,
      permissions: [],
      isLogin: false,
    }),
}));
