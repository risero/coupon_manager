<template>
  <el-col>
    <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen"
             @close="handleClose" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <router-link class="menu_item" v-for="(menu, i) in menuList" :key="i" :to="menu.url">
          <el-menu-item>
            <i v-bind:class="menu.icon"></i>
            <span slot="title" v-text="menu.name"></span>
          </el-menu-item>
        </router-link>
    </el-menu>
  </el-col>
</template>

<script>
  export default {
    data() {
      return {
        menuList: [ // 菜单列表
          {
            icon: 'iconfont icon-shangpin1',
            name: '商品管理',
            url: '/product/list'
          },
          {
            icon: 'iconfont icon-leimupinleifenleileibie',
            name: '分类管理',
            url: '/category/list'
          },
          {
            icon: 'iconfont icon-tuijian',
            name: '商品推荐',
            url: '/recommend/list'
          },
          {
            icon: 'iconfont icon-guanggao',
            name: '广告管理',
            url: '/banner/list'
          },
        ]
      };
    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      xxx() {
        this.$router.push({
          path: "/product/list"
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 100%;
    min-height: 400px;
  }
  .menu_item {
    text-decoration: none;
  }
  .iconfont::before {
    width: 18px;
    height: 18px;
    font-size: 18px;
    padding-right: 10px;
  }
</style>
