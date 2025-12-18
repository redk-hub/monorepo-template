# 项目说明

这是一个基于 monorepo 的前端项目（pnpm workspace），包含一个 web 应用和若干可复用包。下面简要说明项目结构、各个包的作用，以及 apps/web 中 pages/User 示例（通过“状态提升”实现从详情返回列表时保持列表状态）的实现思路。

目录结构（重要目录）

- package.json
- apps/
  - web/ # 主 Web 应用（基于 Vite + React）
    - src/
      - App.jsx
      - layout.jsx
      - main.jsx
      - pages/
        - Home.jsx
        - Login.jsx
        - RoleList.jsx
        - User/
          - ListLayout.jsx # User 列表和详情的父级布局（示例中用于状态提升）
          - List.jsx # 列表页面（表格、分页、筛选）
          - Detail.jsx # 详情页面
      - router/ # 路由与鉴权
      - store/ # 局部/全局 store（如果有）
    - package.json
    - vite.config.js
- packages/
  - hooks/ # 公共 hooks（例如 usePermission, useUserStore）
  - mobile-ui/ # 移动端组件库
  - pc-ui/ # PC 端组件库
  - utils/ # 公共工具方法

各包职责说明

- apps/web
  - 主站应用，负责页面路由、UI 组装、与后端通信。页面层放在 apps/web/src/pages 下。

- packages/hooks
  - 放置可复用 Hook，例如权限判断、用户信息管理等。
  - useUserStore：可用于保存用户列表的全局状态（替代 prop 提升）。
  - usePermission：用于鉴权。

- packages/mobile-ui / packages/pc-ui
  - 提供可复用的 UI 组件（移动/PC 版本），方便在不同应用间共享。

- packages/utils
  - 常用工具函数（日期、请求封装等）。

pages/User 示例：通过状态提升保持列表效果的思路

目标：从列表页跳转到某个用户的详情页，返回时列表（如分页、筛选、滚动位置）要保持之前的状态，而不是重置或重新请求到第一页。

实现方式（两个常见方案，示例代码在 apps/web/src/pages/User 下）：

1. 状态提升到父组件（ListLayout）

- 核心思想：把影响列表展示的状态（如 filters、sort、page、pageSize、tableScrollPos 等）放到 ListLayout 中管理。
- 流程：
  - ListLayout 在内部维护 listState（例如：{ filters, page, pageSize, sort, scrollTop }）。
  - 将 listState 和 setListState（或 updateListFn）通过 props 传给 List.jsx。
  - List.jsx 根据传入的 listState 发起请求并渲染，当用户在列表上操作（切页、筛选）时，通过回调把最新状态上报给父组件。
  - 点击某一行进入 Detail.jsx（可以通过路由导航或在 ListLayout 内切换视图）。Detail.jsx 不会销毁父组件的 listState。
  - 在 Detail 页面点击“返回”时，调用父组件传入的回调（或使用路由返回），回到 List 页面，ListLayout 已经持有之前的 listState，List.jsx 直接使用该状态来恢复请求和渲染，从而保持之前的列表效果（同页、同筛选、滚动等）。

- 优点：实现简单、组件关系清晰，适用于列表和详情在同一父路由下的情况。
- 注意点：如果 Detail 是单独路由且会卸载父组件，需要保证父组件不被销毁（如抽象成 layout route），或者使用全局保存（见方案 2）。

2. 使用全局/共享状态（useUserStore 或 路由 state）

- 全局状态：利用 packages/hooks 中的 useUserStore，将列表的查询条件和分页等保存在 store 中。List.jsx 在 mount 时从 store 读取初始 state，用户操作时同步更新 store。Detail 返回后，List 从 store 读取到上次状态并恢复。
- 路由 state：在导航到 Detail 时，通过路由传递 location.state（例如 { from: 'list', listState }），Detail 返回时使用 history.back() 或 navigate(-1) 恢复；这种方式轻量，但对刷新或直接进入 Detail 的场景支持较弱。

选择建议

- 如果列表状态需要在多个页面或组件间共享，或需要在刷新后也能恢复，优先使用全局 store（useUserStore）。
- 如果仅是在列表与详情之间传递且路由结构允许父组件不卸载，优先使用状态提升（ListLayout 持有状态），实现更自然、组件内耦合更低。

其它实现细节与优化

- 滚动恢复：记录表格或容器的 scrollTop，并在恢复时手动设置滚动位置。
- 请求防抖/缓存：当用户快速切换时可对请求做防抖或在父组件缓存上一次响应，避免重复请求。
- 加载指示与占位：在恢复列表时显示骨架屏或 loading 指示，提升体验。

如何运行（快速开始）

- 安装依赖：pnpm install
- 运行 web 应用（开发）：在 workspace 根或 apps/web 中运行 pnpm dev / pnpm --filter apps/web dev（依据 workspace 脚本配置）

结语

本 README 概述了项目的目录与各包职责，并对 pages/User 中“从详情返回列表并保持列表状态”的实现给出了两种可选方案与实现要点。需要我把 ListLayout/List/Detail 的具体实现示例代码写在项目里吗？
