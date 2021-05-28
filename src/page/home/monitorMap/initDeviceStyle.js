/**
 * @Description: 初始化地图设备、散点图等样式资源
 * @date 2020/11/2
 * @params
 */
import deviceTypeConfig from '../../../config/deviceType';

const modelSize = {
  size_1: {
    width: 20,
    height: 36,
  },
  size_2: {
    width: 22,
    height: 50,
  },
  size_3: {
    width: 20,
    height: 60,
  },
  size_4: {
    width: 30,
    height: 30,
  },
  size_5: {
    width: 20,
    height: 36,
  },
  size_6: {
    width: 22,
    height: 50,
  },
  size_7: {
    width: 20,
    height: 36,
  },
  size_8: {
    width: 22,
    height: 51,
  },
};
export const initDeviceStyle = function () {
  return () => {
    const styleObj = {};
    Object.keys(deviceTypeConfig).forEach((item) => {
      // 根据设备文件自动导入图片生成marker样式
      // 在线样式
      styleObj[`deviceMd_${item}`] = new TMap.MarkerStyle({
        ...modelSize[`size_${item}`],
        anchor: {
          x: modelSize[`size_${item}`].width / 2,
          y: modelSize[`size_${item}`].height / 2,
        },
        faceTo: 'map',
        rotate: 0,
        src: require(`../../../assets/images/device_v2/deviceMd_${item}.png`),
      });
      // 在线样式选中扩大状态
      styleObj[`deviceMd_${item}_click`] = new TMap.MarkerStyle({
        width: modelSize[`size_${item}`].width * 2,
        height: modelSize[`size_${item}`].height * 2,
        anchor: {
          x: modelSize[`size_${item}`].width,
          y: modelSize[`size_${item}`].height,
        },
        faceTo: 'map',
        rotate: 0,
        src: require(`../../../assets/images/device_v2/deviceMd_${item}.png`),
      });
      // 设备离线样式
      styleObj[`deviceMd_Offline_${item}`] = new TMap.MarkerStyle({
        ...modelSize[`size_${item}`],
        anchor: {
          x: modelSize[`size_${item}`].width / 2,
          y: modelSize[`size_${item}`].height / 2,
        },
        opacity: 0.4,
        faceTo: 'map',
        rotate: 0,
        src: require(`../../../assets/images/device_v2/deviceMd_${item}.png`),
      });
      // 设备离线选中样式
      styleObj[`deviceMd_Offline_${item}_click`] = new TMap.MarkerStyle({
        width: modelSize[`size_${item}`].width * 2,
        height: modelSize[`size_${item}`].height * 2,
        anchor: {
          x: modelSize[`size_${item}`].width,
          y: modelSize[`size_${item}`].height,
        },
        rotate: 0,
        opacity: 0.4,
        faceTo: 'map',
        src: require(`../../../assets/images/device_v2/deviceMd_${item}.png`),
      });
    });
    return styleObj;
  };
};
/* export const initDotStyle = function () {
  return {
    "0": {
      fillColor: "rgba(158,161,168,0.90)",
      strokeColor: "rgba(158,161,168,0.2)",
      strokeWidth: 3,
      radius: 2
    },
    "1": {
      fillColor: "rgba(242,163,49,0.9)",
      strokeColor: "rgba(242,163,49,0.2)",
      strokeWidth: 3,
      radius: 2
    },
    "2": {
      fillColor: "rgba(61,77,218,0.9)",
      strokeColor: "rgba(61,77,218,0.2)",
      strokeWidth: 3,
      radius: 2
    }
  };
}*/
export const getStyleIdByType = function (online, type) {
  return online === 1 ? `deviceMd_${type}` : `deviceMd_Offline_${type}`;
};
export const getIconBgImgByType = function (type) {
  return require(`../../../assets/images/device_v2/deviceIcon_${type}.png`);
};
