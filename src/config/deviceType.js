/**
 * @Description:  设备类型对照字段
 * @date 2020/9/25
 * @params
 */

const deviceTypeConfig = {
  // 0: '全部',
  1: '警车',
  2: '铁骑',
  3: '警员',
  4: '卡口',
  5: '出租车',
  6: '公交车',
  7: '私家车',
  8: '货车',
};
export function getTypeNumByName(nameArr) {
  const tmpTypeArr = [];
  nameArr.forEach((item) => {
    const matchType = Object.keys(deviceTypeConfig).filter((keyNum) => deviceTypeConfig[keyNum] === item)[0];
    tmpTypeArr.push(matchType);
  });
  return tmpTypeArr;
}
export function getTypeOption() {
  return Object.keys(deviceTypeConfig).map((keyNum) => ({ label: deviceTypeConfig[keyNum], value: parseInt(keyNum) }));
}
export default deviceTypeConfig;
