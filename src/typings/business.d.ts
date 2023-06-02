/** 用户相关模块 */
declare namespace Auth {
  /**
   * 用户角色类型(前端静态路由用角色类型进行路由权限的控制)
   * - super: 超级管理员(该权限具有所有路由数据)
   * - admin: 管理员
   * - user: 用户
   * - custom: 自定义角色
   */
  type RoleType = keyof typeof import('@/enum').EnumUserRole;

  /** 用户信息 */
  interface UserInfo {
    /** 用户id */
    id: string;
    /** 用户名 */
    userName: string;
    /** 用户角色类型 */
    userRole: RoleType;
  }
}

declare namespace UserManagement {
  interface User extends ApiUserManagement.User {
    /** 序号 */
    index: number;
  }

  interface UserListRes {
    list: User[];
    count: number;
  }

  /**
   * 用户性别
   * - 0: 女
   * - 1: 男
   */
  // type GenderKey = NonNullable<User['gender']>;

  /**
   * 用户状态
   * - 1: 启用
   * - 2: 禁用
   * - 3: 冻结
   * - 4: 软删除
   */
  type UserStatusKey = NonNullable<User['status']>;
}

/** 路由模块 */
declare namespace RouteManagement {
  interface RouteRes {
    home: AuthRoute.AllRouteKey;
    routes: RemoteRoute[];
  }
  /** 远程路由数据 */
  interface RemoteRoute {
    id: number;
    component: string;
    name: string;
    path: string;
    createBy: string;
    parentId: number;
    redirect?: string;
    children: RemoteRoute[];
    meta: AuthRoute.RouteMeta;
    title?: string;
    createTime: string;
    deleteTime: string;
    updateTime: string;
    type: AuthRoute.RouteType;
    apiPerms: string;
  }

  interface AddRouteParams {
    name: string;
    component: 'basic' | 'blank' | 'multi' | 'self';
    path: string;
    requiresAuth?: boolean;
    keepAlive?: boolean;
    hide: boolean;
    href?: string;
    title: string;
    icon: string;
    order: number;
    affix?: boolean;
    multiTab?: boolean;
    localIcon?: string;
    singleLayout: 'basic' | 'blank' | '';
    redirect?: string;
    parentId: number;
    apiPerms?: string;
    type: AuthRoute.RouteType;
  }

  type TargetEdit = {
    ids: {
      /** 要修改的menuId */
      currentId: number;
      /** 父级id */
      parentId: number;
    };
  };
  // type EditRouteParams = TypeUtil.Merge<Omit<RouteManagement.RemoteRoute, 'meta'>, AuthRoute.RouteMeta>;
  interface EditRouteParams extends AddRouteParams {
    id: number;
  }
}
