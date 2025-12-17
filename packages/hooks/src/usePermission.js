import { useUserStore } from './useUserStore';

export const usePermission = () => {
  const permissions = useUserStore((state) => state.permissions);

  /**
   * @param {string | string[]} access 权限标识或数组
   * @returns {boolean}
   */
  const hasPermission = (access) => {
    if (!access) return true;
    if (Array.isArray(access)) {
      return access.every((p) => permissions.includes(p));
    }
    return permissions.includes(access);
  };

  return { hasPermission, permissions };
};
