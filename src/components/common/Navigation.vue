<template>
  <div class="index_navigation">
    <div class="left_nav">
        logo
<!--      <img src="../../../public/favicon.ico" alt="">-->
    </div>
    <div class="right_nav">
      <el-menu
        :default-active="activeIndex2" class="el-menu-demo" mode="horizontal"
        @select="handleSelect" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-menu-item index="2">我的工作台</el-menu-item>
        <el-menu-item index="3">消息中心</el-menu-item>
        <el-menu-item index="4">订单管理</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style lang="less" scoped>

.index_navigation {
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: rgb(84, 92, 100);

  .left_nav {

  }
}
</style>
