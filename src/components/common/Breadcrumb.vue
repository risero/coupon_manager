<template>
  <div class="header_breadcrumb">
    <span class="el-icon-location-outline"></span>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="item in breadcrumbList">{{item}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    breadcrumbs: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      breadcrumbList: []
    }
  },
  mounted() {
    if (this.breadcrumbs) {
      this.breadcrumbList = this.breadcrumbs.split(",")
    }
  }
}
</script>

<style lang="less" scoped>

.header_breadcrumb {
  padding-top: 15px;
  padding-left: 15px;
  display: flex;
  justify-content: left;

  .el-icon-location-outline {
    padding-right: 5px;
    margin-top: -2px;
  }

  .el-icon-location-outline::before {
    font-size: 18px;
    color: #8c939d;
  }
}
</style>
