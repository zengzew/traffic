<template>
  <div class="contentBox">
    <!--<header-bar>
      <p slot="logo">车辆轨迹管理平台</p>
    </header-bar>-->
    <OrderManage></OrderManage>
  </div>
</template>

<script>
import HeaderBar from './../../layout/HeaderBar';
import OrderManage from './orderManage';
export default {
  name: 'multiOrder',
  components: {
    HeaderBar,
    OrderManage,
  },
};
</script>

<style scoped lang="scss">
.contentBox {
  width: 100%;
  height: 100%;
  color: #9d9fad;
}
</style>
