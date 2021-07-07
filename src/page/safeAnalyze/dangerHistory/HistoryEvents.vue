<template>
  <div class="eventsContainer">
    <div class="eventsTitle">交通事件查询</div>
    <el-form :inline="true" :model="form" class="form">
      <el-form-item label="事件类型">
        <el-select v-model="form.type" clearable placeholder="请选择事件类型">
          <el-option label="交通违规" value="type1"></el-option>
          <el-option label="交通事故" value="type2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="form.daterange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          value-format="yyyyMMdd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="其他字段">
        <el-select v-model="form.others" clearable placeholder="请选择">
          <el-option label="地理空间所处范围" value="others1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="pageList"
      :border="true"
      style="width: 100%"
      size="medium"
      :header-cell-style="{ background: '#374a63' }"
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
      form: {
        type: "",
        daterange: "",
        others: "",
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
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
    };
  },
  mounted() {
    //this.getHistoryEvents();
    this.currentChangePage(this.rawList, 1);
  },
  methods: {
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
  height: 1147px;
  position: relative;
  .eventsTitle {
    color: #fff;
    font-size: 2.5rem;
    display: flex;
    justify-content: center;
    padding: 1%;
  }
  .el-pagination {
    padding: 1% 0;
  }
}

.el-date-table td.in-range div {
  background-color: #3e6baf !important;
}
.el-date-table td.end-date span,
.el-date-table td.start-date span {
  border-radius: 1rem !important;
}
</style>
