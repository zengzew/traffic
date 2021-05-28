<template>
  <div>
    <div class="content">
      <div class="menuBtn">
        <span>
          <div class="selectStyle">1</div>
          上传文件</span
        >
        <div style="display: inline-block" class="tab2Title" :class="isSuccess ? '' : 'disabled'">
          <div :class="{ selectStyle: tabIndex !== 1, noSelectStyle: tabIndex === 1 }">2</div>
          <span>字段匹配设置</span>
        </div>
        <span class="tab2Title" :class="isMatchValid ? '' : 'disabled'">
          <div :class="{ selectStyle: tabIndex === 3, noSelectStyle: tabIndex !== 3 }">3</div>
          导入数据</span
        >
      </div>
      <div class="contentBox">
        <div class="uploadBox" v-show="tabIndex === 1">
          <el-upload
            class="upload"
            drag
            multiple
            action=""
            :limit="1"
            accept=".xlsx,.xls,.csv"
            :before-upload="beforeUpload"
            :http-request="uploadFile"
            :on-success="successCb"
            :on-error="uploadErrorCb"
            :show-file-list="false"
            v-if="!isSuccess"
          >
            <i class="el-icon-upload" style="color: blue"></i>
            <div class="el-upload__text">支持导入单个文件</div>
            <div class="el-upload__text">文件后缀名为xls、xlsx、csv，大小不超过100M</div>
          </el-upload>
          <div class="upload" v-if="isSuccess">
            <div class="uploadResult">
              <img class="icon_file" src="~sysStatic/images/dataManage/icon_file@3x.png" />
              <span class="fileName"
                >{{ fileName }}
                <img
                  src="~sysStatic/images/dataManage/ic_delete.png"
                  @click="isSuccess = false"
                  class="uploadDeleteIcon"
                />
              </span>
              <div>{{ fileSize }}M</div>
            </div>
          </div>
          <span class="downloadTip"
            >你可以选择按照模板准备数据<a href="./static/轨迹平台设备上传模板.xlsx"> 文件下载</a></span
          >
        </div>
        <div class="fieldMatchBox" v-show="tabIndex === 2">
          <el-form :model="this" ref="uploadForm">
            <el-table
              :data="this.fieldMatchTable"
              :cell-style="getRowClass"
              :header-cell-style="getRowClass"
              class="tableStyle"
            >
              <el-table-column label="导入数据字段" align="center">
                <template slot-scope="scope">
                  <el-form-item
                    :rules="scope.row.isRequired ? rules.userKey : null"
                    :prop="'fieldMatchTable.' + scope.$index + '.userKey'"
                  >
                    <el-select clearable size="small" v-model="scope.row.userKey">
                      <el-option v-for="item in selectOption" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="轨迹平台字段" align="center">
                <template slot-scope="scope">
                  <span style="color: #f94d47; vertical-align: top" v-show="scope.row.isRequired">*</span>
                  <el-button type="info" size="small" class="tagBox">{{
                    scope.row.appKeyShowName + `(${scope.row.appKey})`
                  }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
        <div class="dataImportBox" v-show="tabIndex === 3">
          <div class="uploadingBox" v-show="uploadPercentage < 100">
            <span>数据导入中…</span>
            <el-progress
              class="progress"
              :show-text="false"
              :stroke-width="10"
              :percentage="uploadPercentage"
            ></el-progress>
            <div>
              <span>{{
                `  ${uploadPercentage}% (${uploadSuccessCount + uploadFailArr.length}/${fileData.length})`
              }}</span>
              <div class="stopImport" @click="isStopUpload = true">终止导入</div>
            </div>
          </div>
          <div class="uploadToDbResult" v-show="uploadPercentage === 100">
            <div class="uploadToDbFail" v-if="!uploadToDbStatue">
              <div class="successCount">
                <img class="uploadSuccess_small" src="~sysStatic/images/dataManage/icon_success@3x.png" />
                导入成功
                <span>{{ uploadSuccessCount }}</span>
                条
              </div>
              <div class="failCount">
                <img class="uploadSuccess_small" src="~sysStatic/images/dataManage/icon_fail@3x.png" />
                导入异常<span>{{ uploadFailArr.length }}</span
                >条
              </div>
              <el-card
                body-style='{overflow-y:visible,height:"200px",padding:20px,padding-right:0px}'
                v-show="uploadFailArr.length"
                class="box-card"
              >
                <div class="logBox">
                  <div v-for="item in uploadFailArr" class="rowBox">
                    <span class="rowText">{{ `第${item.index + 1}行` }}</span>
                    <span class="messageText" style="color: #f94d47">{{ item.message }}</span>
                  </div>
                </div>
              </el-card>
            </div>
            <div class="uploadToDbSuccess" v-else>
              <img class="uploadSuccess_small_final" src="~sysStatic/images/dataManage/icon_success@3x.png" />
              <div>批量导入数据完成</div>
              <div>成功导入{{ uploadSuccessCount }}/{{ fileData.length }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <span slot="footer">
        <el-button class="dialogBtn" type="primary" size="small" v-if="tabIndex !== 3" @click="nextTab"
          >下一步</el-button
        >
        <el-button
          class="dialogBtn"
          size="small"
          v-if="tabIndex === 3 && uploadPercentage >= 100 && !uploadToDbStatue"
          @click="continueUpload"
          >继续上传</el-button
        >
        <el-button class="dialogBtn" size="small" v-if="tabIndex !== 3" @click="handleCancel">取 消</el-button>
        <el-button
          class="dialogBtn"
          type="primary"
          size="small"
          v-if="tabIndex === 3 && uploadPercentage >= 100"
          @click="handleCancel"
          >确 定</el-button
        >
      </span>
    </div>
  </div>
</template>

<script>
import XLSX from 'xlsx';
// import {getAllDeviceKey, deviceInsertPost} from '../../../util/api.js'
import iconv from 'iconv-lite';
import msfConfig from '../../../config/msgConfig';
export default {
  name: 'multiImport',
  props: {},
  data() {
    return {
      tabIndex: 1,
      fileName: '',
      fileSize: 0,
      isSuccess: false, // 是否上传成功
      fileFieldArr: [], // 第一行表头,
      fieldMatchTable: [], // 字段匹配表
      fileData: [], // 导入数据表格内容,不包括首行列头
      deviceKeys: [],
      selectOption: {
        value: '',
        label: '',
        key: '',
      },
      uploadPercentage: 0, // 上传进度
      uploadFailArr: [], // 上传日志
      uploadSuccessCount: 0,
      isStopUpload: false,
      isMatchValid: false,
      rules: {
        userKey: [
          {
            required: true,
            message: '不得为空',
          },
        ],
      },
    };
  },
  computed: {
    // 上传状态，true代表全部上传完成，false存在异常数据
    uploadToDbStatue() {
      return !this.uploadFailArr.length;
    },
  },

  watch: {
    // 监听表头变化
    fileFieldArr() {
      this.$API.device.allDeviceKeyGet().then((res) => {
        if (res.data) {
          this.deviceKeys = res.data.map((item) => ({
            name: item.name,
            showName: item.showname,
            default: item.default, // 是否默认字段，1是 0否
            isRequired: item.request === 'true', // 是否必填
          }));
        }
        this.fieldMatchTable = this.deviceKeys.map((item) => {
          const tmpObj = {};
          // TODO: 是否实现初步模糊匹配
          tmpObj[item] = '';
          return {
            appKey: item.name,
            appKeyShowName: item.showName,
            userKey: this.fileFieldArr.filter((item1) => item1.includes(item.name))[0] || '',
            default: item.default, // 是否默认字段，1是 0否
            isRequired: item.isRequired, // 是否必填
          };
        });
        if (this.fileFieldArr.length)
          this.selectOption = this.fileFieldArr.map((item) => ({
            value: item,
            label: item,
            key: item,
          }));
      });
    },
    tabIndex(newVal) {
      if (newVal === 3) {
        this.allDataImport();
      } else if (newVal === 2) {
        !this.isSuccess && this.tabIndex--;
        this.$refs.uploadForm.clearValidate();
        this.isMatchValid = false;
      } else {
        this.isMatchValid = false;
        this.isSuccess = false;
      }
    },
  },
  methods: {
    beforeUpload(file) {
      const fileName = file.name || '';
      const tmp = fileName.split('.').pop();
      if (tmp !== 'xls' && tmp !== 'xlsx' && tmp !== 'csv') {
        this.$message({
          type: 'error',
          message: '只能上传xls、xlsx和csv格式文件!',
        });
        return false;
      }
      const sizeLimit = file.size / 1024 / 1024 <= 100;
      if (!sizeLimit) {
        this.$message({
          type: 'error',
          message: '上传文件大小不能超过 100MB!',
        });
      }
      return sizeLimit;
    },
    // 解析excel
    async uploadFile(params) {
      const _file = params.file;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary',
          });
          const sheetList = workbook.SheetNames;
          // 获取表头
          if (sheetList.length) {
            let sheetArray = XLSX.utils.sheet_to_json(workbook.Sheets[sheetList[0]], { defval: '' });
            // 由于iconv.decode 方法只支持buffer参数，故先将 string转为buffer，再转为string，
            const tmp = iconv.encode(JSON.stringify(sheetArray), 'utf-8');
            sheetArray = JSON.parse(iconv.decode(tmp, 'utf-8'));
            this.fileFieldArr = sheetArray.length ? Object.keys(sheetArray[0]) : [];
            this.fileData = sheetArray.slice(0); // 表格内容
          }
        } catch (e) {
          console.log(e);
          this.$message({
            type: 'warning',
            message: '文件解析失败，请检查后重试！',
          });
        }
      };
      fileReader.readAsBinaryString(_file);
    },
    successCb(res, file, fileList) {
      this.isSuccess = true;
      this.fileName = file.name;
      this.fileSize = (file.size / 1024 / 1024).toFixed(3);
    },
    nextTab() {
      if (this.tabIndex === 2) {
        this.isStopUpload = false; // 终止导入状态
        this.$refs.uploadForm.validate((valid) => {
          if (valid) {
            this.isMatchValid = true;
            this.tabIndex++;
          } else {
            return false;
          }
        });
      } else {
        this.tabIndex++;
      }
    },
    uploadErrorCb() {
      this.$message({
        type: 'error',
        message: '上传失败，请稍后重试',
      });
    },
    handleCancel() {
      this.$emit('initCurrentPageTable');
      this.$emit('update:multiImportVisible', false);
    },
    getRowClass({ row, column, rowIndex, columnIndex }) {
      return 'background:#F4F6F9;border: none; padding: 4px 0';
    },
    getUserKeyByAppKey(appKey) {
      return this.fieldMatchTable.filter((item1) => item1.appKey === appKey)[0].userKey;
    },
    // 继续上传
    continueUpload() {
      this.isSuccess = false;
      this.tabIndex = 1;
    },
    async allDataImport() {
      this.uploadSuccessCount = 0;
      this.uploadFailArr = [];
      this.uploadPercentage = 0;
      // 生成默认字段对照
      const defaultKeysMatch = this.fieldMatchTable.filter((item1) => item1.default);

      // 生成拓展字段对照
      const customKeysMatch = this.fieldMatchTable.filter((item1) => !item1.default);

      // this.fileData.forEach( async (item, index, arr) =>
      for (let i = 0; i < this.fileData.length; i++) {
        if (!window.onbeforeunload)
          window.onbeforeunload = function (e) {
            e = e || window.event;
            // 兼容IE8和Firefox 4之前的版本
            if (e) {
              e.returnValue = '数据正在上传，强制关闭上传进度将会终止';
            }
            // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
            return '数据正在上传，强制关闭上传进度将会终止';
          };
        this.$emit('update:isUploading', true);

        const item = this.fileData[i];
        const tmpObj = {};
        customKeysMatch.forEach((item2) => {
          tmpObj[item2.appKey] = item[item2.userKey];
        });
        const extJson = JSON.stringify(tmpObj);
        const postData = {
          title: item[this.getUserKeyByAppKey('title')] || '',
          user: item[this.getUserKeyByAppKey('user')] || '',
          department: item[this.getUserKeyByAppKey('department')] || '',
          type: parseInt(item[this.getUserKeyByAppKey('type')]) || '',
          deviceid: item[this.getUserKeyByAppKey('deviceid')] || '',
          ext: extJson,
        };
        if (!this.isStopUpload) {
          await this.$API.device.deviceInsertPost(postData).then((res) => {
            console.log('111');
            this.uploadPercentage = Math.round(((i + 1) / this.fileData.length) * 100);
            if (res.status === 0) {
              this.uploadSuccessCount++;
            } else {
              this.uploadFailArr.push({
                index: i,
                message: msfConfig.deviceInsert[res.status] || '数据错误',
              });
            }
            if (i === this.fileData.length - 1) {
              window.onbeforeunload = null;
              this.$emit('update:isUploading', false);
            }
          });
        } else {
          this.tabIndex = 2;
          window.onbeforeunload = null;
          this.$emit('update:isUploading', false);
          break;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.menuBtn {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;

  .tab2Title.disabled {
    pointer-events: none;
  }
}
.upload {
  text-align: center;
  width: 600px;
  height: 180px;
  background: #f4f6f9;
  margin: 20px auto 10px auto;
  display: flex;
  /deep/ .el-upload-dragger {
    width: 600px;
    background: #f4f6f9;
  }
}
.blankBox {
  height: 200px;
  background: #f4f6f9;
}
.downloadTip {
  float: right;
}
.uploadResult {
  margin: auto;
  text-align: left;
  .fileName {
    font-weight: 600;
    img {
      width: 14px;
      vertical-align: baseline;
      cursor: pointer;
    }
  }
}
.dialog-footer {
  margin-top: 40px;
  text-align: right;
}
.fieldMatchBox {
  width: 600px;
  max-height: 350px;
  background: #f4f6f9;
  box-sizing: border-box;
  overflow: auto;
  margin: auto;
  .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-form-item__error {
    position: static;
  }
}
.uploadDeleteIcon {
}
.tableStyle {
  width: 100%;
  background: #f4f6f9;
}
.tagBox {
  width: 180px;
  background-color: #f0f3f7;
  border: 1px solid #dddfe4;
  color: #636671;
}
.box-card {
  margin: auto;
  overflow-y: visible;
  /deep/ .el-card__body {
    padding: 12px;
    height: 90%;
  }
}
.dataImportBox {
  background: #f4f6f9;
  padding: 30px 60px 15px 70px;
  .logBox {
    position: relative;
    height: 100%;
    overflow-y: scroll;
    font-size: 12px;
    .rowBox {
      margin: 4px 0;
      .rowText {
        display: inline-block;
        min-width: 40px;
        color: #606275;
      }
      .messageText {
        margin-left: 7px;
        color: #f94d47;
      }
    }
  }
  .stopImport {
    display: inline-block;
    float: right;
    cursor: pointer;
    color: #0062ff;
    font-weight: 500;
  }
  .progress {
    margin: 10px 0;
  }
  .uploadToDbResult {
    .uploadToDbSuccess {
      text-align: center;
      .uploadSuccess_small_final {
        width: 21px;
      }
    }
  }
}
.selectStyle {
  background: #0062ff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: inline-block;
  color: #ffffff;
  text-align: center;
  line-height: 18px;
}
.noSelectStyle {
  background: #e5effe;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: inline-block;
  color: #0062ff;
  text-align: center;
  line-height: 18px;
}
.successCount {
  font-size: 16px;
  font-weight: 600;
  position: relative;
  span {
    color: #3bd289;
    margin: 0 2px;
  }
}
.uploadSuccess_small {
  width: 21px;
  position: absolute;
  left: -30px;
}
.failCount {
  margin: 15px 0 10px 0;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  span {
    color: #f94d47;
    margin: 0 2px;
  }
}
.icon_file {
  float: left;
  width: 30px;
  margin-right: 5px;
}
.el-card {
  height: 200px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: none;
}
</style>
