import { children } from "cheerio/lib/api/traversing";
import envConfig from "../config/envConfig";

const Layout = () => import(/* webpackChunkName: 'index' */ "../page/layout");

const staticRoute = [
    {
        path: "/",
        redirect: "/select",
        // redirect: '/login',
    },
    {
        path: "/error",
        name: "trailError",
        component: () =>
            import(/* webpackChunkName: 'error' */ "../page/error"),
        children: [
            {
                path: "401",
                component: () =>
                    import(/* webpackChunkName: 'error' */ "../page/error/401"),
            },
            {
                path: "403",
                component: () =>
                    import(/* webpackChunkName: 'error' */ "../page/error/403"),
            },
            {
                path: "404",
                component: () =>
                    import(/* webpackChunkName: 'error' */ "../page/error/404"),
            },
            {
                path: "500",
                component: () =>
                    import(/* webpackChunkName: 'error' */ "../page/error/500"),
            },
        ],
    },
    {
        path: "/login",
        name: "login",
        component: () =>
            envConfig.type === "pubNet"
                ? import("../page/loginPub")
                : import("../page/login"),
        // component: () => import(/* webpackChunkName: 'login' */ '../page/login'),
        meta: {
            keepAlive: false,
        },
    },
    {
        path: "/monitor",
        component: Layout,
        meta: {
            keepAlive: true,
        },
        children: [
            {
                path: "",
                name: "monitor",
                component: () =>
                    import(
                        /* webpackChunkName: 'home' */ "../page/home/monitorMap"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
        ],
    },
    {
        path: "/select",
        name: "",
        // component: () => import('../page/select'),
        component: Layout,
        meta: {
            keepAlive: false,
        },
        children: [
            {
                path: "",
                name: "select",
                component: () => import("../page/select"),
                meta: { keepAlive: false },
            },
        ],
    },
    {
      path: "/dangerAnalyze",
      name: "",
      component: Layout,
      meta: {
          keepAlive: false,
      },
      children: [
          {
              path: "",
              name: "dangerAnalyze",
              component: () => import("../page/safeAnalyze/dangerAnalyze"),
              meta: { keepAlive: false },
          },
      ],
  },
  {
    path: "/trafficAnalyze",
    name: "",
    component: Layout,
    meta: {
        keepAlive: false,
    },
    children: [
        {
            path: "",
            name: "trafficAnalyze",
            component: () => import("../page/safeAnalyze/trafficAnalyze"),
            meta: { keepAlive: false },
        },
    ],
},
{
    path: "/dangerPotential",
    name: "",
    component: Layout,
    meta: {
        keepAlive: false,
    },
    children: [
        {
            path: "",
            name: "dangerPotential",
            component: () => import("../page/safeAnalyze/dangerPotential"),
            meta: { keepAlive: false },
        },
    ],
},
  {
    path: "/dangerHistory",
    name: "",
    component: Layout,
    meta: {
        keepAlive: false,
    },
    children: [
        {
            path: "",
            name: "dangerHistory",
            component: () => import("../page/safeAnalyze/dangerHistory"),
            meta: { keepAlive: true },
        },
    ],
},
    {
        path: "/home",
        component: Layout,
        meta: {
            keepAlive: false,
        },
        children: [
            {
                path: "",
                name: "multiOrder",
                component: () => import("../page/home/multiOrder"),
                meta: {
                    keepAlive: false,
                },
            },
        ],
    },
    {
        path: "/trail",
        component: Layout,
        meta: {
            keepAlive: false,
        },
        children: [
            {
                path: "",
                name: "trail",
                component: () =>
                    import(/* webpackChunkName: 'home' */ "../page/home/trail"),
            },
        ],
    },
    {
        path: "/components",
        component: Layout,
        children: [
            {
                path: "",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
            {
                path: "pageNotes",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components/assist/pageNotes"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
            {
                path: "permission",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components/function/permission"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
            {
                path: "pageTable",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components/function/pageTable"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
            {
                path: "pageSearch",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components/ui/pageSearch"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
            {
                path: "pageSection",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components/ui/pageSection"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
            {
                path: "pageTitle",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components/ui/pageTitle"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
            {
                path: "pageToolbar",
                component: () =>
                    import(
                        /* webpackChunkName: 'components' */ "../page/components/ui/pageToolbar"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
        ],
    },
    {
        path: "/example",
        name: "example",
        component: Layout,
        children: [
            {
                path: "table",
                name: "trailTable",
                component: () =>
                    import(
                        /* webpackChunkName: 'example' */ "../page/example/table"
                    ),
                meta: {
                    keepAlive: true,
                },
            },

            {
                path: "dataManage",
                name: "dataManage",
                component: () =>
                    import(
                        /* webpackChunkName: 'example' */ "../page/example/dataManage/"
                    ),
                meta: {
                    keepAlive: true,
                },
            },
            /*{
        path: 'heatAnalysis',
        name: 'heatAnalysis',
        component: () => import(/!* webpackChunkName: 'example' *!/ '../page/example/heatAnalysis/'),
        meta: {
          keepAlive: false,
        },
      },*/
            {
                path: "config",
                name: "configuration",
                component: () =>
                    import(
                        /* webpackChunkName: 'example' */ "../page/example/config/"
                    ),
                meta: {
                    keepAlive: true,
                },
            },
        ],
    },
    /* {
        path: '/example/config',
        name: 'configuration',
        component: () => import(/!* webpackChunkName: 'example' *!/ '../page/example/config/'),
        meta:{
            keepAlive:true
        },
    },*/
    {
        path: "/i18n",
        component: Layout,
        children: [
            {
                path: "",
                component: () =>
                    import(/* webpackChunkName: 'i18n' */ "../page/i18n"),
                meta: {
                    keepAlive: false,
                },
            },
        ],
    },
    {
        path: "/theme",
        component: Layout,
        children: [
            {
                path: "",
                component: () =>
                    import(
                        /* webpackChunkName: 'themeChange' */ "../page/themeChange"
                    ),
                meta: {
                    keepAlive: false,
                },
            },
        ],
    },
    {
        path: "*",
        redirect: "/error/404",
    },
];

export default staticRoute;
