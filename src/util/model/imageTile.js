class ImageTile {
  constructor(map, tileUrl, opts) {
    // this.map = map;
    this.tileUrl = tileUrl;
    // this.opts = opts || {};
    this.imageLayer = new TMap.ImageTileLayer({
      getTileUrl: this.getTileUrl(),
      tileSize: 256, // 瓦片像素尺寸
      minZoom: 1, // 显示自定义瓦片的最小级别
      maxZoom: 23, // 显示自定义瓦片的最大级别
      maxDataZoom: 18,
      visible: false, // 是否可见
      zIndex: 1, // 层级高度（z轴）
      opacity: 0.7, // 图层透明度：1不透明，0为全透明
      map, // 设置图层显示到哪个地图实例中
      ...opts,
    });
  }
  show() {
    console.log('111')
    this.imageLayer.setVisible(true);
  }
  hide() {
    this.imageLayer.setVisible(false);
  }
  getTileUrl() {
    const tileUrl = this.tileUrl;
    return function getTileUrl(x, y, z){
      const y2 = Math.pow(2, z) - y - 1;
      const y1 = Math.floor(y2 / 16);
      const x1 = Math.floor(x / 16);
      // var url = 'http://priapitest2.noscan.sparta.html5.qq.com/taizhou0114/' + z + '/' + x1 + '/' + y1 + '/' + x + "_" + y2 + '.png'
      const url = `${tileUrl}/${z}/${x1}/${y1}/${x}_${y2}.png`;
      return url;
    }

  }
}
export default ImageTile