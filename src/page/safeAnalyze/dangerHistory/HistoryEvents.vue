<template>
  <div class="eventsContainer" ref="eventsContainer">
    <div class="eventsTitle">交通事件查询</div>
    <el-form :inline="true" :model="form" class="form">
      <el-form-item label="事件类型">
        <el-select v-model="form.type" clearable placeholder="请选择事件类型">
          <el-option label="事故" value="1"></el-option>
          <el-option label="封路" value="2"></el-option>
          <el-option label="拥堵" value="3"></el-option>
          <el-option label="施工" value="4"></el-option>
          <el-option label="城内" value="5"></el-option>
          <el-option label="高速" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <!-- <el-date-picker
          v-model="form.daterange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="timestamp"
        >
        </el-date-picker> -->
        <el-col :span="4">
          <el-date-picker
            v-model="form.projectStartDate"
            :picker-options="startDatePicker"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">-</el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="form.projectEndDate"
            :picker-options="endDatePicker"
            type="date"
            placeholder="结束日期"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">-</el-col>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="pageList"
      :border="true"
      style="width: 100%"
      size="medium"
      :header-cell-style="{ background: '#374a63' }"
      :max-height="getTableHeight"
    >
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="id" label="事件编号"> </el-table-column>
      <el-table-column prop="title" label="事件标题"> </el-table-column>
      <el-table-column prop="content" label="事件内容"> </el-table-column>
      <el-table-column prop="source" label="事件来源"> </el-table-column>
      <el-table-column prop="status" label="事件状态"> </el-table-column>
      <el-table-column prop="location" label="事件发生位置"> </el-table-column>
      <el-table-column prop="name" label="路段名称"> </el-table-column>
      <el-table-column prop="rank" label="道路等级"> </el-table-column>
      <el-table-column prop="scope" label="地理空间所属范围"></el-table-column>
      <el-table-column prop="starttime" label="起始时间"></el-table-column>
      <el-table-column prop="endtime" label="结束时间"></el-table-column>
      <el-table-column prop="updatetime" label="更新时间"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="currentPage1"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="rawList.length"
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      form: {
        type: "",
        daterange: new Date(),
      },
      pageList: [],
      rawList: [
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
        {
          title: "交通事件",
          content: "撞车",
          name: "西土城路十号",
          source: "交管所",
          code: "10002",
          status: "已完成",
          location: "未知",
          effect: "Q",
          starttime: "20200608",
          endtime: "20200609",
          updatetime: "20200610",
        },
      ],
      pageSize: 10,
      currentPage1: 1,
      screenHeight: document.body.clientHeight, // 初始化时获取当前打开页面的高度
    };
  },
  mounted() {
    //this.getHistoryEvents();
    this.currentChangePage(this.rawList, 1);
    // 窗口或页面被调整大小时触发事件
    window.onresize = () => {
      // 获取body的高度
      this.screenHeight = document.body.clientHeight;
    };
  },
  computed: {
    //获取窗口大小调整表格大小，使panigation不被表格覆盖掉
    getTableHeight() {
      return this.screenHeight - 372;
    },
  },
  methods: {
    // 日期选择约束
    beginDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.projectEndDate) {
            //如果结束时间不为空，则小于结束时间
            return (
              new Date(self.form.projectEndDate).getTime() < time.getTime()
            );
          } else {
            return time.getTime() > Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    processDate() {
      const self = this;
      return {
        disabledDate(time) {
          if (self.form.projectStartDate) {
            //如果开始时间不为空，则结束时间大于开始时间
            return (
              new Date(self.form.projectStartDate).getTime() > time.getTime()
            );
          } else {
            return time.getTime() > Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    onSubmit() {
      console.log("submite!", this.form);
    },
    getHistoryEvents() {
      this.axios.get("/api/xxx").then((response) => {
        this.rawList = response.data;
        this.currentChangePage(this.rawList, 1);
      });
    },
    //处理单页的尺寸
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage1);
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage1 = currentPage;
      this.currentChangePage(this.rawList, currentPage);
    },
    currentChangePage(list, currentPage) {
      let from = (currentPage - 1) * this.pageSize;
      let to = currentPage * this.pageSize;
      this.pageList = [];
      for (; from < to; from++) {
        if (list[from]) {
          this.pageList.push(list[from]);
        }
      }
    },
  },
};
</script>
<style lang="less">
.eventsContainer {
  margin: 0 10%;
  min-height: 88.4vh;
  .eventsTitle {
    color: #fff;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    padding: 1%;
  }
  .el-pagination {
    padding: 1% 0;
    bottom: 0;
    position: absolute;
  }
}

//修改timepicker样式
.el-date-table td.in-range div {
  background-color: #3e6baf !important;
}
.el-date-table td.end-date span,
.el-date-table td.start-date span {
  border-radius: 1rem !important;
}
</style>
