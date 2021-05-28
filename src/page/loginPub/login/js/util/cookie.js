//设置cookie
function setCookie(name, val, options) {
    if (!name) {
        throw new Error("coolie must have name");
    }
    var enc = encodeURIComponent;
    var parts = [];

    val = (val !== null && val !== undefined) ? val.toString() : "";
    options = options || {};
    parts.push(enc(name) + "=" + enc(val));
    // domain中必须包含两个点号
    if (options.domain) {
        parts.push("domain=" + options.domain);
    }
    if (options.path) {
        parts.push("path=" + options.path);
    }
    // 如果不设置expires和max-age浏览器会在页面关闭时清空cookie
    if (options.expires) {
        parts.push("expires=" + options.expires.toGMTString());
    }
    if (options.maxAge && typeof options.maxAge === "number") {
        parts.push("max-age=" + options.maxAge);
    }
    if (options.httpOnly) {
        parts.push("HTTPOnly");
    }
    if (options.secure) {
        parts.push("secure");
    }

    document.cookie = parts.join(";");
}
//读取cookies
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(arr[2]);
    }
    return null;
}
//删除cookies
function deleteCookie(name, options) {
    options.expires = new Date(0); // 设置为过去日期
    setCookie(name, null, options);
}
export {setCookie, getCookie, deleteCookie}