<template>
  <div class="eventsContainer" ref="eventsContainer">
    <div class="eventsTitle">交通事件查询</div>
    <el-form :inline="true" :model="form" class="form">
      <el-form-item label="事件类型">
        <el-select v-model="form.type" clearable placeholder="请选择事件类型">
          <el-option label="事故" value="1"></el-option>
          <el-option label="施工" value="2"></el-option>
          <el-option label="封路" value="3"></el-option>
          <el-option label="拥堵" value="4"></el-option>
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
      <el-table-column type="index" :index="indexMethod" width="55">
      </el-table-column>
      <el-table-column prop="origin_id" label="事件编号" width="95">
      </el-table-column>
      <el-table-column prop="title" label="事件标题"> </el-table-column>
      <el-table-column prop="info" label="事件内容"> </el-table-column>
      <el-table-column prop="source" label="事件来源"> </el-table-column>
      <el-table-column prop="event_status" label="事件状态">
        <template slot-scope="scope">
          {{ scope.row.event_status | convertStatus }}
        </template>
      </el-table-column>

      <el-table-column prop="event_id" label="事件发生位置" width="105">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="goMap(scope.row.event_id, scope.row.start_time)"
            >查看位置</el-button
          >
        </template></el-table-column
      >
      <el-table-column prop="seg_name" label="路段名称"> </el-table-column>
      <el-table-column prop="rc" label="道路等级">
        <template slot-scope="scope">
          {{ scope.row.rc | convertRc }}
        </template>
      </el-table-column>
      <el-table-column prop="region" label="地理空间所属范围">
        <template slot-scope="scope">
          {{ scope.row.region | convertRegion }}
        </template>
      </el-table-column>
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
  filters: {
    //事件状态
    convertStatus(val) {
      if (val == 1) return "处理中";
      else if (val == 2) return "已完成";
      else return "error";
    },
    //地理空间所属范围
    convertRegion(val) {
      if (val == 0) return "城内";
      else if (val == 1) return "高速";
      else return "error";
    },
    // 道路等级
    convertRc(val) {
      switch (val) {
        case 0:
          return "高速路";
        case 1:
          return "都市高速路";
        case 2:
          return "国道";
        case 3:
          return "省道";
        case 4:
          return "县道";
        case 6:
          return "乡镇村道";
        case 8:
          return "其它道路";
        case 9:
          return "非引导道路";
        case 10:
          return "轮渡";
        case 11:
          return "行人道路";
        case 12:
          return "人渡";
        default:
          return "error";
      }
    },
  },
  mounted() {
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
    //将 event_id 传入到 vuex 中，用来在 交通事故分析 检索对应的事件
    goMap(e, time) {
      this.$store.state.safeAnalysis.eventIdFromHistory = e;
      this.$store.state.safeAnalysis.timeFromHistory = String(
        Date.parse(new Date(time)) / 1000
      );
      this.$store.state.safeAnalysis.isFromHistory = true;
      this.$router.push("trafficAnalyze");
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
              new Date(self.form.projectStartDate).getTime() > time.getTime() ||
              time.getTime() > Date.now()
            );
          } else {
            return time.getTime() > Date.now(); //开始时间不选时，结束时间最大值小于等于当天
          }
        },
      };
    },
    onSubmit() {
      //事件选择器传出的timestamp做出以下转换，从毫秒单位转换为秒单位
      let dateStartTimestamp = Number(
        this.form.projectStartDate.toString().slice(0, 10)
      );
      let dateEndTimpestamp = Number(
        this.form.projectEndDate.toString().slice(0, 10)
      );
      //当前时刻转化为当日零时零分零秒，东八区时间
      this.dateStart =
        dateStartTimestamp - (dateStartTimestamp % 86400) + 57600;
      //结束时刻取到下一天零时
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
    //获取事件table的接口方法
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
    //处理单页的尺寸，每当改变一次单页的表格size，重新读取一次数据
    handleSizeChange: function (pageSize) {
      this.pageSize = pageSize;
      this.handleCurrentChange(this.currentPage1);
      this.getEvents(
        this.dateStart,
        this.dateEnd,
        this.type,
        this.pageIndex,
        this.pageSize
      );
    },
    //处理当前页，跳转到指定页码，
    handleCurrentChange: function (currentPage) {
      this.pageIndex = currentPage;
      this.getEvents(
        this.dateStart,
        this.dateEnd,
        this.type,
        this.pageIndex,
        this.pageSize
      );
    },

    //计算每页的index，否则表格index将会在新的一页重新计数
    indexMethod(index) {
      index = index + 1 + (this.pageIndex - 1) * this.pageSize;
      return index;
    },
  },
};
</script>
<style lang="less">
.eventsContainer {
  margin: 0 10%;
  min-height: 92.1vh;
  .eventsTitle {
    color: #fff;
    font-size: 2rem;
    display: flex;
    justify-content: center;
    padding: 1%;
  }
  .el-table {
    min-width: 1100px;
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
