/**
 * @Description:  项目自动打包上传至cos上，减少繁琐步骤
 * @params
 */
const cos_client = require('@tencent/tcos');
const path = require('path');
const fs = require('fs');
// const ora = require('ora');
const chalk = require('chalk');
const dayjs = require('dayjs');
// cors 配置文件
const config = require('./config').cors_config;
const filePath = require('./config').file_config;

const { bucketName } = filePath;
const { cosPath } = filePath; // cors 存储路径
const { dist_path } = filePath; // 当前项目dist打包文件夹
cos_client.initConfig(config);
const filePathArr = [];
let finishCount = 0;

/**
 * 批量上传文件至CDN方法
 * @param dist_path 需要遍历的文件路径
 */
main();
async function main() {
  const objName = await cos_client.object.listDirObject(bucketName, `${cosPath}latest/`);
  const objectList = objName.map((item) => `${cosPath}latest/${item.key}`);
  // console.log(objectList);
  // let tmp = objectList.filter((item) => item[item.length - 1] !== '/');
  // console.log(objName, tmp);
  if (objectList.length){
    const deleteRes = await cos_client.object.mulDeleteObject(bucketName, objectList);
    console.log('已删除 \n',JSON.stringify(deleteRes));
  }
  // 上传至最新版仓库
  getUploadFile(dist_path, `${cosPath}latest/`);

  // 二次上传至备份仓库
  getUploadFile(dist_path, `${cosPath}${dayjs().format('YYYYMMDDHHmmss')}/`);

  /**
   * 文件上传到CDN
   * @param {*} bucket
   * @param {*} targetPath
   * @param {*} sourcePath
   */
  filePathArr.forEach((item) => {
    cos_client.object
      .putObject(bucketName, item.targetPath, item.sourcePath)
      .then(() => {
        finishCount++;
        console.log(chalk.white(`上传成功 ${finishCount}/${filePathArr.length}\t${item.targetPath}`));
        if (finishCount === filePathArr.length) {
          console.log(
            chalk.greenBright.bold(`\n全部上传完成，访问地址为\n${filePath.Host}${filePath.cosPath}latest/index.html`),
          );
        }
      })
      .catch((e) => {
        console.error(chalk.red(`上传失败 ${item.targetPath}\n${e}`));
        finishCount++;
        if (finishCount === filePathArr.length) {
          console.log(chalk.red.bold('\n文件上传存在错误，请检查日志'));
        }
      });
  });

  // 根据指定文件夹提取所有待上传文件路径
  function getUploadFile(filePath, cosPath) {
    const pa = fs.readdirSync(filePath);
    pa.forEach((ele, index) => {
      const info = fs.statSync(path.join(filePath, ele));
      if (info.isDirectory()) {
        getUploadFile(`${filePath}/${ele}`, cosPath);
      } else {
        const cosfilePath = path.join(filePath, ele).replace(dist_path, '');
        filePathArr.push({
          targetPath: cosPath + cosfilePath,
          sourcePath: path.join(filePath, ele),
        });
      }
    });
  }
}
