<template>
  <div>
    <el-date-picker
      v-model="time"
      align="center"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
      @change="timeChange()"

      >
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          // shortcuts: [{
          //   text: '今天',
          //   onClick(picker) {
          //     picker.$emit('pick', new Date());
          //   }
          // }, {
          //   text: '昨天',
          //   onClick(picker) {
          //     const date = new Date();
          //     date.setTime(date.getTime() - 3600 * 1000 * 24);
          //     picker.$emit('pick', date);
          //   }
          // }, {
          //   text: '一周前',
          //   onClick(picker) {
          //     const date = new Date();
          //     date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
          //     picker.$emit('pick', date);
          //   }
          // }]
        },
        time: new Date(),
      };
    },
    methods:{
        timeChange(){
            this.$store.state.safeAnalysis.timePicker = new Date(this.time).getTime() / 1000;
            this.$store.state.safeAnalysis.timePickerStr = this.time
        }
    },
    mounted(){
        if (this.$store.state.safeAnalysis.isFromHistory){
            console.log(2333,this.$store.state.safeAnalysis.timeFromHistory)
            this.time = new Date(Number(this.$store.state.safeAnalysis.timeFromHistory) * 1000 + 28800000)
        }
        if (this.$store.state.safeAnalysis.timePickerStr )
        this.time = this.$store.state.safeAnalysis.timePickerStr
    },
  };
</script>

<style>

</style>