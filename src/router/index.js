import Vue from "vue";
import VueRouter from "vue-router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";
import store from "../store";
import staticRoute from "./staticRoute";
import envConfig from "../config/envConfig";
import axios from "../util/ajax";

let permissionList = []; // 权限列表
const newPermissionList = [
    {
        path: "/monitor",
        name: "车辆实时监控",
        permission: ["view"], // 'view', 'hide' 默认可以查看
    },
    {
        path: "/example/table",
        name: "历史轨迹",
        permission: ["view"], // 'view', 'hide' 默认可以查看
    },
    {
        path: "/example/config",
        name: "业务配置",
        // deviceView, deviceHide, deviceEdit(包含删除),trailView,orderDataView 同理
        permission: ["deviceView", "trailHide", "orderDataHide"],
    },
    {
        path: "/trail",
        name: "车辆当天历史轨迹",
        permission: ["view"], // 'view', 'hide' 默认可以查看
    },
    {
        path: "/example/heatAnalysis",
        name: "轨迹热力分析",
        permission: ["view"], // 'view', 'hide' 默认可以查看
    },
    {
        path: "/example/dataManage",
        name: "数据管理",
        permission: ["view"], // 'view', 'hide', 'delete' 默认可以查看
    },
    {
        path: "/home",
        name: "首页",
        permission: ["view"], // 'view', 'create', 'hide', 'delete' 默认可以查看
    },
];

function initRoute(router) {
    return new Promise((resolve) => {
        if (permissionList.length === 0) {
            // store.dispatch('auth/getNavList').then(() => {
            store.dispatch("auth/getPermissionList").then(() => {
                // permissionList = res
                // TODO: 测试权限
                permissionList = newPermissionList;
                newPermissionList.forEach((v) => {
                    const routeItem = router.match(v.path);
                    if (routeItem) {
                        routeItem.meta.permission = v.permission
                            ? v.permission
                            : [];
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
    mode: "hash",
    routes: staticRoute,
});

// 路由跳转前验证
router.beforeEach((to, from, next) => {
    // 开启进度条
    NProgress.start();
    if (envConfig.type === "pubNet") {
        pubNetBeforeEach(to, from, next);
    } else {
        privNetBeforeEach(to, from, next);
    }
});

function pubNetBeforeEach(to, from, next) {
    // 如果从首页登录或者页面刷新
    if (from.path === "/login" || from.path === "/") {
        if (to.path === "/login" || to.path === "/") {
            next();
            return;
        }
        // TODO：初始化当前用户数据库
        // TODO: 重置持久化内容，包括用户名，navList，perms
        resetPersist();
        // 登录时获取权限列表，并更新state navList 和 allPagePermission
        store
            .dispatch("auth/getPermissionList_pubNet")
            .then(
                store.dispatch("user/getUserName").then(() => {
                    next();
                    NProgress.done();
                })
            )
            .catch((err) => {
                Message({
                    message: "权限获取失败，请稍后重试",
                });
                next({ path: "/login", replace: true });
                NProgress.done();
            });
    } else {
        next();
    }
}
function privNetBeforeEach(to, from, next) {
    initRoute(router);
    if (document.getElementsByClassName("login_container")[0]) {
        document.getElementsByClassName("login_container")[0].style.display =
            "none";
    }
    //if (to.params && to.params.hasAuth) {
    if (to.params) {
        next();
    } else {
        // 请求鉴权
        hasAuth()
            .then(() => {
                // 鉴权成功
                if (to.path === "/login" || to.path === "/") {
                    next({ name: "multiOrder", params: { hasAuth: true } });
                } else {
                    next();
                }
            })
            .catch((res) => {
                // 鉴权失败, 会话超时
                Message.closeAll();
                if (to.path === "/login") {
                    next();
                } else {
                    Message.info(
                        res.status === 60003
                            ? "未登录或登录超时，请重新登录"
                            : res.message
                    );
                    from.path === "/login" && NProgress.done() && next(false); // 结束Progress
                    next({ name: "login", params: { hasAuth: true } });
                }
                /*to.path !== '/login' && Message.info(res.status === 60003 ? '未登录或登录超时，请重新登录' : res.message);
        // 判断to是否是首页，避免无限循环
        to.path === '/login' ? next() : next({ name: 'login', params: { hasAuth: true } });*/
            });
        // next(false)
    }
}
router.afterEach(() => {
    NProgress.done(); // 结束Progress
});
// 重置持久化内容
function resetPersist() {
    // store.commit('auth/setToken', null)
    store.dispatch("user/resetName");
    store.dispatch("auth/resetNavList");
    store.dispatch("auth/resetAllPagePermission");
    store.dispatch("multiOrder/resetCurrentOrder");
}
function hasAuth() {
    return new Promise((resolve, reject) => {
        axios({
            url: `/console/has_auth?output=json`,
            methods: "GET",
        }).then((res) => {
            console.log("登录鉴权11", res);
            if (res.status === 0) {
                if (res.detail.auth === 0) {
                    Message.warning({
                        message:
                            "抱歉，您暂无权限访问该系统，请联系管理员开通权限",
                        duration: 2000,
                    });
                    // setTimeout(function(){
                    router.push({ name: "login", params: { hasAuth: true } });
                    // },2500)
                    reject(res);
                } else if (res.detail.auth === 1) {
                    resolve(res);
                }
            } else {
                reject(res);
            }
        });
    });
}

export default router;
