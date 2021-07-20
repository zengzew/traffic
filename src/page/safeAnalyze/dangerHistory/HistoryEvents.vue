<template>
  <div class="eventsContainer" ref="eventsContainer">
    <div class="eventsTitle">交通事件查询</div>
    <el-form :inline="true" :model="form" class="form">
      <el-form-item label="事件类型">
        <el-select v-model="form.type" clearable placeholder="请选择事件类型">
          <el-option label="事故" value="0"></el-option>
          <el-option label="封路" value="1"></el-option>
          <el-option label="拥堵" value="2"></el-option>
          <el-option label="施工" value="3"></el-option>
          <el-option label="城内" value="4"></el-option>
          <el-option label="高速" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-col :span="4">
          <el-date-picker
            v-model="form.projectStartDate"
            :picker-options="startDatePicker"
            type="date"
            placeholder="开始日期"
            value-format="timestamp"
          ></el-date-picker>
        </el-col>
        <el-col :span="8">-</el-col>
        <el-col :span="4">
          <el-date-picker
            v-model="form.projectEndDate"
            :picker-options="endDatePicker"
            type="date"
            placeholder="结束日期"
            value-format="timestamp"
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
      <el-table-column prop="origin_id" label="事件编号"> </el-table-column>
      <el-table-column prop="title" label="事件标题"> </el-table-column>
      <el-table-column prop="info" label="事件内容"> </el-table-column>
      <el-table-column prop="source" label="事件来源"> </el-table-column>
      <el-table-column prop="event_status" label="事件状态"> </el-table-column>

      <el-table-column prop="event_id" label="事件发生位置">
        <template slot-scope="scope">
          <el-button size="mini" @click="goMap(scope.row.event_id)"
            >查看位置</el-button
          >
        </template></el-table-column
      >

      <el-table-column prop="seg_name" label="路段名称"> </el-table-column>
      <el-table-column prop="rc" label="道路等级"> </el-table-column>
      <el-table-column prop="region" label="地理空间所属范围"></el-table-column>
      <el-table-column prop="start_time" label="起始时间"></el-table-column>
      <el-table-column prop="end_time" label="结束时间"></el-table-column>
      <el-table-column prop="update_time" label="更新时间"></el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page="currentPage1"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total"
    >
    </el-pagination>
  </div>
</template>
<script>
import API from "../../../util/apiV1";
export default {
  data() {
    return {
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate(),
      form: {
        type: "",
      },
      pageList: [],
      rawList: [],
      total: 0,
      pageSize: 10,
      pageIndex: 1,
      currentPage1: 1,
      dateStart: "",
      dateEnd: "",
      type: 0,
      screenHeight: document.body.clientHeight, // 初始化时获取当前打开页面的高度
    };
  },
  mounted() {
    this.currentChangePage(this.pageList, 1);
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
    goMap(e) {
      console.log(e);
      this.$sotre.safeAnalysis.eventIdFromHistory = e;
      this.$sotre.safeAnalysis.isFromHistory = true;
      // this.$router.push({ name: "trafficAnalyze" });
    },
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
      //从毫秒单位转换为秒单位
      let dateStartTimestamp = Number(
        this.form.projectStartDate.toString().slice(0, 10)
      );
      let dateEndTimpestamp = Number(
        this.form.projectEndDate.toString().slice(0, 10)
      );
      //当前时刻转化为当日零时零分零秒，东八区时间
      this.dateStart =
        dateStartTimestamp - (dateStartTimestamp % 86400) + 57600;
      //加到下一天零时
      this.dateEnd =
        dateEndTimpestamp - (dateEndTimpestamp % 86400) + 57600 + 86400;
      this.type = this.form.type;
      this.getEvents(
        this.dateStart,
        this.dateEnd,
        this.type,
        this.pageIndex,
        this.pageSize
      );
    },
    getEvents(dateStart, dateEnd, type, pageIndex, pageSize) {
      API.safeAnalyze
        .eventsGet(dateStart, dateEnd, type, pageIndex, pageSize)
        .then((res) => {
          if (res.status === 0) {
            this.pageList = res.data;
            this.total = res.event_num;
          } else {
            this.$message({
              message: "数据更新失败，请稍后重试",
              type: "error",
            });
          }
        })
        .catch((error) => {
          this.$message({
            message: "数据更新失败，请稍后重试",
            type: error,
          });
        });
    },
    //处理单页的尺寸
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      console.log("每页显示" + this.pageSize + "条");
      this.handleCurrentChange(this.currentPage1);
      this.getEvents(
        this.dateStart,
        this.dateEnd,
        this.type,
        this.pageIndex,
        this.pageSize
      );
    },
    //处理当前页
    handleCurrentChange: function (currentPage) {
      this.pageIndex = currentPage;
      console.log("第" + this.pageIndex + "页");
      this.getEvents(
        this.dateStart,
        this.dateEnd,
        this.type,
        this.pageIndex,
        this.pageSize
      );
      //this.currentChangePage(this.rawList, currentPage);
    },
    // currentChangePage(list, currentPage) {
    //   let from = (currentPage - 1) * this.pageSize;
    //   let to = currentPage * this.pageSize;
    //   this.pageList = [];
    //   for (; from < to; from++) {
    //     if (list[from]) {
    //       this.pageList.push(list[from]);
    //     }
    //   }
    // },
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
    padding-bottom: 1%;
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
