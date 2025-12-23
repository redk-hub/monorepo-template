import React from 'react';
import { usePermission } from '@my-repo/hooks';
import { Result } from 'antd-mobile';

/**
 * 路由权限守卫组件
 * @param {ReactNode} children - 要渲染的页面
 * @param {string} auth - 该页面需要的权限标识
 */
const AuthGuard = ({ children, auth }) => {
  const { hasPermission } = usePermission();

  //判断权限状态：如果有权限标识且校验不通过，显示 403
  if (auth && !hasPermission(auth)) {
    return (
      <Result
        status="warning"
        title="403"
        description="对不起，您没有权限访问此页面。"
      />
    );
  }

  // 3. 校验通过，渲染实际内容
  return <>{children}</>;
};

export default AuthGuard;
