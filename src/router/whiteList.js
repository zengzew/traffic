// 免登录白名单页面
const whiteList = ['/login', '/register', '/notice', '/maintenance'];
// 二级导航栏不显示页面
const backRouterWhiteList = ['multiOrder','select','safe',"dangerAnalyze","dangerHistory"];
// 城市选择显示页面
const citySelectList = ['monitor'];
// 二级导航栏业务下拉选择框不显示页面
const orderSelectList = ['trail'];
// 地图组件页面，需要提前
const mapList = ['monitor', 'trail',"dangerAnalyze"];

export { whiteList, backRouterWhiteList, citySelectList, orderSelectList,mapList };
