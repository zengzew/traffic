// 以下代码为基于DOMOverlay实现聚合点气泡
function CustomOverlay(options) {
  TMap.DOMOverlay.call(this, options);
}

CustomOverlay.prototype = new TMap.DOMOverlay();

CustomOverlay.prototype.onInit = function (options) {
  this.content = options.content;
  this.position = options.position;
  this.className = options.className;
};

// 销毁时需要删除监听器
CustomOverlay.prototype.onDestroy = function () {
  this.dom.removeEventListener('click', this.onClick);
  this.removeAllListeners();
  // this.dom && this.dom.remove();
};

CustomOverlay.prototype.onClick = function () {
  this.emit('click');
};

// 创建气泡DOM元素
CustomOverlay.prototype.createDOM = function () {
  const dom = document.createElement('div');
  // dom.classList.add();
  dom.classList.add(this.className || 'CustomOverlay');
  dom.innerText = this.content;
  dom.style.cssText = [
    `width: ${40 + parseInt(this.content) * 2}px;`,
    `height: ${40 + parseInt(this.content) * 2}px;`,
    `line-height: ${40 + parseInt(this.content) * 2}px;`,
  ].join(' ');

  // 监听点击事件，实现zoomOnClick
  this.onClick = this.onClick.bind(this);
  dom.addEventListener('click', this.onClick);
  return dom;
};

CustomOverlay.prototype.updateDOM = function () {
  if (!this.map) {
    return;
  }
  // 经纬度坐标转容器像素坐标
  const pixel = this.map.projectToContainer(this.position);

  // 使文本框中心点对齐经纬度坐标点
  const left = `${pixel.getX() - this.dom.clientWidth / 2}px`;
  const top = `${pixel.getY() - this.dom.clientHeight / 2}px`;
  this.dom.style.transform = `translate(${left}, ${top})`;

  this.emit('dom_updated');
};

export { CustomOverlay };
