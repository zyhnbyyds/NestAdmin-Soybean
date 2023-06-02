// 后端接口返回的数据类型

declare namespace ApiCommon {
  /**
   * 列表参数
   */
  interface SearchQuery {
    pageNum: number;
    pageSize: number;
    [key: string]: any;
  }

  interface DataRes<T> {
    list: T;
    count: number;
  }
}
/** 后端返回的用户权益相关类型 */
declare namespace ApiAuth {
  /** 返回的token和刷新token */
  interface Token {
    token: string;
    refreshToken: string;
  }
  /** 返回的用户信息 */
  type UserInfo = Auth.UserInfo;
}

/** 后端返回的路由相关类型 */
declare namespace ApiRoute {
  /** 后端返回的路由数据类型 */
  interface Route {
    /** 动态路由 */
    routes: AuthRoute.Route[];
    /** 路由首页对应的key */
    home: AuthRoute.AllRouteKey;
  }
}

/** 用户管理 */
declare namespace ApiUserManagement {
  interface User {
    /** 用户id */
    id: number;
    /** 用户名 */
    userName: string;
    /** 用户手机号码 */
    phone: string;
    /** 用户邮箱 */
    email: string | null;
    /**
     * 0-禁用
     * 1-启用
     */
    status: 0 | 1;
    /** 昵称 */
    nickName: string;
    /** 创建时间 */
    createTime: string;
    /** 更新时间 */
    updateTime: string;
    /** 删除时间 */
    deleteTime: string;
    /** 头像地址 */
    avatar: string;
    /** 密码 */
    password: string;
    /** 角色信1息 */
    role: ApiRole.Role;
    /** 角色ID */
    roleId: number;
  }
}

declare namespace ApiRole {
  interface Role {
    id: number;
    roleName: string;
    roleKey: string;
    createdBy: string;
    status: number;
    nickName: string;
    createTime: string | null;
    updateTime: string | null;
    deleteTime: string | null;
  }

  interface RoleRes {
    list: Role[];
    count: number;
  }

  type RoleMenuIds = number[];

  type RoleEdit = TypeUtil.Merge<
    Pick<Role, 'roleName' | 'status' | 'id' | 'nickName' | 'roleKey'>,
    { checkedKeys: number[] }
  >;

  type RoleAdd = Omit<RoleEdit, 'id'>;
}
