import { create } from 'zustand';

export const usePageStore = create((set) => ({
  tabs: [], // { key: '', label: '' }

  // 新增标签
  addTab: (tab) =>
    set((state) => {
      const isExist = state.tabs.some((t) => t.key === tab.key);
      if (isExist) return state;
      return { tabs: [...state.tabs, tab] };
    }),

  // 关闭标签
  closeTab: (key) =>
    set((state) => ({
      tabs: state.tabs.filter((t) => t.key !== key),
    })),

  // 重置状态（退出登录时用）
  resetAll: () => set({ tabs: [{ key: '/home', label: '仪表盘' }] }),
}));
