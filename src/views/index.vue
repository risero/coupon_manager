<template>
  <el-container class="container">
    <!-- 导航栏 -->
    <el-header class="index_header">
      <navigation></navigation>
    </el-header>

    <!-- 主体 -->
    <el-container class="body_container">
      <!-- 左侧菜单 -->
      <el-aside class="left_menu">
        <e-menu></e-menu>
      </el-aside>

      <!-- 主内容 -->
      <el-main class="main_content">
        <router-view :key="key"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import Navigation from '@/components/common/Navigation'
  import EMenu from '@/components/common/Menu'
  import List from '@/views/product/List'

  export default {
    components: {
      Navigation,
      EMenu,
      List,
    },
    data() {
      return {
        key: this.$route.path
      }
    }
  }
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;

  .header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    height: 120px !important;
  }
}

.body_container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

/* 顶部导航栏 */
.index_header {
  width: 100%;
  padding: 0;
}

/* 左侧导航栏 */
.left_menu {
  text-align: left !important;
  width: 240px !important;
  box-sizing: border-box !important;
  overflow: hidden;
  height: 100%;
  background-color: rgb(84, 92, 100);
}

/* 主内容 */
.el-main {
  text-align: center;
  width: auto;
  height: 100%;
  padding: 0;
  box-sizing: border-box;
}
</style>
