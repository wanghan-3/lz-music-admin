import type { RouteRecordRaw } from "vue-router";
// 静态常量路由
export const constRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    component: () => import("@/view/login/index.vue"),
    name: "Login",
    meta: {
      title: "登录",
      hidden: true, //是否在菜单处隐藏
      icon: "Monitor",
    },
  },
  {
    path: "/",
    component: () => import("@/Layout/index.vue"),
    name: "Layout",
    meta: { title: "Layout", icon: "Operation" },
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: () => import("@/view/home/index.vue"),
        name: "Home",
        meta: {
          title: "首页",
          icon: "House",
        },
      },
    ],
  },

  {
    path: "/screen",
    component: () => import("@/view/screen/index.vue"),
    name: "Screen",
    meta: {
      title: "数据大屏",
      hidden: false, //是否在菜单处隐藏
      icon: "Monitor",
    },
  },
  {
    path: "/404",
    component: () => import("@/view/404/index.vue"),
    name: "404",
    meta: {
      title: "404",
      hidden: true, //是否在菜单处隐藏
      icon: "Cpu",
    },
  },
  {
    path: "/studentManage",
    component: () => import("@/Layout/index.vue"),
    name: "StudentManage",
    redirect: "/studentManage/student",
    meta: {
      title: "学生管理",
      icon: "Cpu",
    },
    children: [
      {
        path: "/studentManage/student",
        name: "Student",
        component: () => import("@/view/studentManage/student/index.vue"),
        meta: {
          title: "学生管理",
          icon: "MessageBox",
        },
      },
      {
        path: "/studentManage/class",
        name: "Class",
        component: () => import("@/view/studentManage/class/index.vue"),
        meta: {
          title: "课程管理",
          icon: "GoodsFilled",
        },
      },
      {
        path: "/studentManage/student/allocation/:id?",
        name: "Allocation",
        component: () => import("@/view/studentManage/student/allocation.vue"),
        meta: {
          title: "学生课程分配",
          icon: "GoodsFilled",
          hidden: true,
        },
      },
    ],
  },
  {
    path: "/coursesManage",
    component: () => import("@/Layout/index.vue"),
    name: "CoursesManage",
    redirect: "/coursesManage/courses",
    meta: {
      title: "课程管理",
      icon: "Book",
    },
    children: [
      {
        path: "/coursesManage/courses",
        name: "Courses",
        component: () => import("@/view/coursesManage/courses/index.vue"),
        meta: {
          title: "课程管理",
          icon: "Notebook",
        },
      },
      // {
      //   path: "/coursesManage/class",
      //   name: "Class",
      //   component: () => import("@/view/coursesManage/class/index.vue"),
      //   meta: {
      //     title: "课程管理",
      //     icon: "GoodsFilled",
      //   },
      // },
    ],
  },
  {
    path: "/teacherManage",
    component: () => import("@/Layout/index.vue"),
    name: "teacherManage",
    redirect: "/teacherManage/teacher",
    meta: {
      title: "教师管理",
      icon: "Book",
    },
    children: [
      {
        path: "/teacherManage/teacher",
        name: "Teacher",
        component: () => import("@/view/teacherManage/teacher/index.vue"),
        meta: {
          title: "教师管理",
          icon: "Notebook",
        },
      },
    ],
  },
];
// 动态路由
export const asyncRouter: RouteRecordRaw[] = [
  {
    path: "/product",
    name: "Product",
    redirect: "/product/attr",
    component: () => import("@/Layout/index.vue"),
    meta: {
      title: "商品管理",
      icon: "ShoppingBag",
    },
    children: [
      {
        path: "/product/trademark",
        name: "Trademark",
        component: () => import("@/view/product/trademark/index.vue"),
        meta: {
          title: "品牌管理",
          icon: "MessageBox",
        },
      },
      {
        path: "/product/attr",
        name: "Attr",
        component: () => import("@/view/product/attr/index.vue"),
        meta: {
          title: "属性管理",
          icon: "GoodsFilled",
        },
      },
      {
        path: "/product/sku",
        name: "Sku",
        component: () => import("@/view/product/sku/index.vue"),
        meta: {
          title: "SKU管理",
          icon: "Tickets",
        },
      },
      {
        path: "/product/spu",
        name: "Spu",
        component: () => import("@/view/product/spu/index.vue"),
        meta: {
          title: "SPU管理",
          icon: "Collection",
        },
      },
    ],
  },
  {
    path: "/acl",
    name: "Acl",
    redirect: "/acl/user",
    component: () => import("@/Layout/index.vue"),
    meta: {
      title: "权限管理",
      icon: "Lock",
    },
    children: [
      {
        path: "/acl/user",
        name: "User",
        component: () => import("@/view/acl/user/index.vue"),
        meta: {
          title: "用户管理",
          icon: "User",
        },
      },
      {
        path: "/acl/role",
        name: "Role",
        component: () => import("@/view/acl/role/index.vue"),
        meta: {
          title: "角色管理",
          icon: "UserFilled",
        },
      },
      {
        path: "/acl/permission",
        name: "Permission",
        component: () => import("@/view/acl/permission/index.vue"),
        meta: {
          title: "菜单管理",
          icon: "Operation",
        },
      },
    ],
  },
];
// 任意路由
export const anyRouter: RouteRecordRaw[] = [
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "Any",
    meta: {
      title: "Any",
      hidden: true, //是否在菜单处隐藏
      icon: "Cpu",
    },
  },
];
