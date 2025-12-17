import React from 'react';
import KeepAlive from 'react-activation';

/**
 * 通用缓存包装器
 * @param {ReactNode} children - 页面组件
 * @param {boolean} active - 是否开启缓存
 * @param {string} cacheKey - 缓存唯一标识（通常传入 location.pathname）
 */
export const KeepAliveWrapper = ({ children, active, cacheKey }) => {
  if (active) {
    return (
      <KeepAlive cacheKey={cacheKey} name={cacheKey}>
        {children}
      </KeepAlive>
    );
  }
  return <>{children}</>;
};
