// 免登录白名单页面
const whiteList = ['/login', '/register', '/notice', '/maintenance'];
// 二级导航栏不显示页面
const backRouterWhiteList = ['multiOrder','select','safe'];
// 城市选择显示页面
const citySelectList = ['monitor'];
// 二级导航栏业务下拉选择框不显示页面
const orderSelectList = ['trail','dangerHistory'];
// 二级导航栏不显示 “选择业务 和 数据管理” 的 界面
const selectOrderList = ["dangerHistory","dangerAnalyze","trafficAnalyze"]

// 地图组件页面，需要提前
const mapList = ['monitor', 'trail',"dangerAnalyze","trafficAnalyze"];


export { whiteList, backRouterWhiteList, citySelectList, orderSelectList,mapList,selectOrderList };
