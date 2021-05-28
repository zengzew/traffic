import * as loginComponent from './component/login.js'
var login =  {
    init: loginComponent.init,
    show: loginComponent.loginModalShow,
    hide: loginComponent.loginModalHide,
    exit: loginComponent.logout

}
function initComponent(cb) {
    var jq_script = document.getElementById('jq_script');
    if ((typeof jQuery === "undefined")&&!jq_script){
        var jqDom = document.createElement('script')
        jqDom.src = 'https://lbs.gtimg.com/visual/lbs_component/v/jquery-1.11.0.min.js'
        jqDom.id = 'jq_script'
        document.getElementsByTagName("head")[0].appendChild(jqDom);
        jqDom.onload = function () {
            cb&&cb();
        }
    }
    else {
        cb&&cb();
    }
}
var component = {
    login: login,
    initComponent: initComponent
}
// export {login, initComponent};
export {component};