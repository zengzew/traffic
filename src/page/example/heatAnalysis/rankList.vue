<template>
  <div class="rankListBox">
    <span class = 'title'>全市轨迹点排行榜</span>
    <el-table
        :data="tableData"
        class="tableBox"
        :default-sort = "{prop: 'count', order: 'descending'}"
        :height="autoHeight()"
        :cell-style="getCellClass"
        :header-cell-style="getHeadCellClass"
        :header-row-style = "getHeadRowStyle">
      <el-table-column
          label="区域"
          width="100"
          :show-overflow-tooltip = 'true'>
        <template slot-scope="scope">
          <button :class="scope.$index<3? 'numBtn1':  'numBtn2'">{{scope.$index + 1}}</button>
          <span style="margin-left: 10px; color: #F0F3F7">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="轨迹点数(个)"
          width="110"
          prop="count"
          align="center">
        <template slot-scope="scope">
          <span class="tableText">{{scope.row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="占比" width="110">
        <template slot-scope="scope">
          <span class="tableText">{{scope.row.count / allCount | percentFormat}}%</span>
          <el-progress class="progressBox"
                       color="#4778FF"
                       :text-inside="true"
                       :show-text = 'false'
                       :stroke-width="5"
                       :percentage="parseInt( ((scope.row.count / allCount)*100).toFixed(0))"
          ></el-progress>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: "rankList",
    props: {
      allCount: Number,
      tableData: Array
    },
    filters: {
      percentFormat: function (value) {
        return (value * 100).toFixed(0);
      }
    },
    data() {
      return {

      }
    },
    methods: {
      getCellClass() {
        return "height:40px;background:#22253A;border: none; padding: 4px 0";
      },
      getHeadCellClass(){
        return "background:#2e3244 ;border: none; padding: 4px 0"
      },
      getHeadRowStyle(){
        return "background:#2e3244;border: none; padding: 4px 0"
      },
      autoHeight(){
        return  document.documentElement.clientHeight > 850? '88%': '70%';
      },
    },

    created() {

    }
  }
</script>

<style scoped lang="scss">
  .rankListBox {
    margin-top: 10px;
    box-sizing: border-box;
    padding: 16px;
    width: 340px;
    /*height: 55%;*/
    flex: 1;
    ::-webkit-scrollbar-track {
      background-color: #22253A;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #2e3244;
    }
    .title {
      font-size: 16px;
      margin-left: 4px;
      font-weight: 600;
    }
    /deep/ .el-table::before {
      background-color: #22253A;
    }
    background-color: #22253A;
  }
 /* @media screen and (max-height: 800px){
    .tableBox {
      height: 60%;
      overflow: hidden;
      font-size: 14px;
      background:#22253A;
      border: none;
      margin-top: 10px;
      span {
        color: #F0F3F7;
      }
    }
  }
  @media screen and (min-height: 800px){
    .tableBox {
      overflow: hidden;
      height: 85%;
      font-size: 14px;
      background:#22253A;
      border: none;
      margin-top: 10px;
      span {
        color: #F0F3F7;
      }
    }
  }*/
  .tableBox {
    overflow: hidden;
    height: 85%;
    font-size: 14px;
    background:#22253A;
    border: none;
    margin-top: 10px;
    span {
      color: #F0F3F7;
    }
  }
  .progressBox {
    float: right;
    right: 20px;
    width: 40px;
    margin-top: 8px;
    /deep/ .el-progress-bar__outer {
      background-color: #2e3244;
    }
  }
  .numBtn1 {
    width: 16px;
    height: 16px;
    font-size: 11px;
    border: none;
    background-color: #4778FF;
    border-radius: 2px;
    color: #fff
  }
  .numBtn2 {
    width: 16px;
    height: 16px;
    font-size: 11px;
    border: none;
    border-radius: 2px;
    background-color: #1f2b4e;
    color: #4778FF;
  }
</style>