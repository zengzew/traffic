import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { Message } from 'element-ui';
import Auth from '@/util/auth';
import store from '../store';
import staticRoute from './staticRoute';
import { whiteList } from './whiteList';
import envConfig from '../config/envConfig';

let permissionList = []; // 权限列表
const newPermissionList = [
  {
    path: '/monitor',
    name: '车辆实时监控',
    permission: ['view'], // 'view', 'hide' 默认可以查看
  },
  {
    path: '/example/table',
    name: '历史轨迹',
    permission: ['view'], // 'view', 'hide' 默认可以查看
  },
  {
    path: '/example/config',
    name: '业务配置',
    // deviceView, deviceHide, deviceEdit(包含删除),trailView,orderDataView 同理
    permission: ['deviceView', 'trailHide', 'orderDataHide'],
  },
  {
    path: '/trail',
    name: '车辆当天历史轨迹',
    permission: ['view'], // 'view', 'hide' 默认可以查看
  },
  {
    path: '/example/heatAnalysis',
    name: '轨迹热力分析',
    permission: ['view'], // 'view', 'hide' 默认可以查看
  },
  {
    path: '/example/dataManage',
    name: '数据管理',
    permission: ['view'], // 'view', 'hide', 'delete' 默认可以查看
  },
  {
    path: '/home',
    name: '首页',
    permission: ['view'], // 'view', 'create', 'hide', 'delete' 默认可以查看
  },
];

function initRoute(router) {
  return new Promise((resolve) => {
    if (permissionList.length === 0) {
      // store.dispatch('auth/getNavList').then(() => {
      store.dispatch('auth/getPermissionList').then(() => {
        // permissionList = res
        // TODO: 测试权限
        permissionList = newPermissionList;
        newPermissionList.forEach((v) => {
          const routeItem = router.match(v.path);
          if (routeItem) {
            routeItem.meta.permission = v.permission ? v.permission : [];
            routeItem.meta.name = v.name;
          }
        });
        resolve();
        // })
      });
    } else {
      resolve();
    }
  });
}

NProgress.configure({ showSpinner: false });

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'hash',
  routes: staticRoute,
});

// 路由跳转前验证
router.beforeEach((to, from, next) => {
  // 开启进度条
  NProgress.start();
  if (envConfig.type === 'pubNet') {
    pubNetBeforeEach(to, from, next);
  } else {
    privNetBeforeEach(to, from, next);
  }
});

function pubNetBeforeEach(to, from, next) {
  // 如果从首页登录或者页面刷新
  if (from.path === '/login' || from.path === '/') {
    if (to.path === '/login' || to.path === '/') {
      next();
      return;
    }
    // TODO：初始化当前用户数据库
    // TODO: 重置持久化内容，包括用户名，navList，perms
    // resetPersist()
    // 登录时获取权限列表，并更新state navList 和 allPagePermission
    store
      .dispatch('auth/getPermissionList_pubNet')
      .then(
        store.dispatch('user/getUserName').then(() => {
          next();
          NProgress.done();
        }),
      )
      .catch((err) => {
        Message({
          message: '权限获取失败，请稍后重试',
        });
        next({ path: '/login', replace: true });
        NProgress.done();
      });
  } else {
    next();
  }
}
function privNetBeforeEach(to, from, next) {
  if (from.path === '/login') {
    // 权限重置
    // resetPersist()
    store.state.auth.navList.forEach((item) => (item.isShow = true));
    store.commit('auth/setCurrentPagePermission', []);
    // 从登录页跳转时，更新导航页权限状态
    for (const perItem of permissionList) {
      const tmpNavIndex = store.state.auth.navList.findIndex((item) => item.path === perItem.path);
      // 如果存在，导航栏中取消
      tmpNavIndex > -1 &&
        perItem.permission.includes('hide') &&
        store.commit('auth/setNavItemShow', { index: tmpNavIndex, isShow: false });
      // tmpNavIndex > -1 && perItem.permission.includes('hide') && console.log(perItem.path)
    }
  }
  // 判断用户是否处于登录状态
  if (Auth.isLogin()) {
    // 更新导航窗口权限状态

    // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
    // 这种情况出现在手动修改地址栏地址时
    if (to.path === '/login') {
      next({ path: '/home', replace: true });
    } else if (to.path.indexOf('/error') >= 0) {
      // 防止因重定向到error页面造成beforeEach死循环
      next();
    } else {
      initRoute(router).then(() => {
        let isPermission = false;
        for (const v of permissionList) {
          if (envConfig.type === 'pubNet') {
            // TODO: 专网网版判断跳转页面权限
            if (v.path === to.fullPath) {
              if (!v.permission.join().toLowerCase().includes('hide')) {
                // 有查看权限
                // 保存当前页权限
                store.commit('auth/setCurrentPagePermission', v.permission);
                isPermission = true;
              } else {
                // 无查看权限
                // 业务配置特殊处理,只有三个都hide才无权限
                // isPermission =to.path === '/example/config' && v.permission.filter(item => item.includes('Hide')).length< 3;
                if (to.path === '/example/config' && v.permission.filter((item) => item.includes('Hide')).length < 3) {
                  store.commit('auth/setCurrentPagePermission', v.permission);
                  isPermission = true;
                } else {
                  isPermission = false;
                }
                /* debugger
                                let tmpNavIndex = store.state.auth.navList.findIndex(item => item.path === v.path)
                                // 如果存在，导航栏中取消
                                tmpNavIndex && store.commit('auth/setNavItemShow',{index: tmpNavIndex, isShow: false})*/
              }
              break;
            }
          } else {
            // 专网版判断
            // 判断跳转的页面是否在权限列表中
            if (v.path === to.fullPath) {
              isPermission = true;
              break;
            }
          }
        }
        // 没有权限时跳转到401页面
        if (!isPermission) {
          next({ path: '/error/401', replace: true });
        } else {
          next();
        }
      });
    }
  } else {
    // 如果是免登陆的页面则直接进入，否则跳转到登录页面
    if (whiteList.indexOf(to.path) >= 0) {
      next();
    } else {
      console.warn('当前未处于登录状态，请登录');
      next({ path: '/login', replace: true });
      // 如果store中有token，同时Cookie中没有登录状态
      if (store.state.user.token) {
        Message({
          message: '登录超时，请重新登录',
        });
      }
    }
  }
}
router.afterEach(() => {
  NProgress.done(); // 结束Progress
});
// 重置持久化内容
function resetPersist() {
  // store.commit('auth/setToken', null)
  /* store.dispatch('user/resetName');
    store.dispatch('auth/resetNavList');
    store.dispatch('auth/resetAllPagePermission')
    store.dispatch('multiOrder/resetCurrentOrder');*/
}
export default router;
