// 计算根节点1rem的值
(function (doc, win) {
  const docEl = doc.documentElement;
  // recalF,
  const resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
  const recalc = function () {
    const { clientWidth } = docEl;
    if (!clientWidth) return;
    // 按照效果图尺寸及方便计算的规则，确认1rem基本字号大小。此处为1rem=20px
    docEl.style.fontSize = `${parseInt(20 * (clientWidth / 1024))}px`;
  };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
