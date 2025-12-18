import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermission, useUserStore } from '@my-repo/hooks';
import { Result, Button } from 'antd';

/**
 * 路由权限守卫组件
 * @param {ReactNode} children - 要渲染的页面
 * @param {string} auth - 该页面需要的权限标识
 */
const AuthGuard = ({ children, auth }) => {
  const { hasPermission } = usePermission();

  // 2. 判断权限状态：如果有权限标识且校验不通过，显示 403
  if (auth && !hasPermission(auth)) {
    return (
      <Result
        status="403"
        title="403"
        subTitle="对不起，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={() => window.history.back()}>
            返回上一页
          </Button>
        }
      />
    );
  }

  // 3. 校验通过，渲染实际内容
  return children;
};

export default AuthGuard;
