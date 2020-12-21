<template>
  <div class="container">
    <!-- 面包屑路由 -->
    <breadcrumb class="breadcrumb" ref="breadcrumb" breadcrumbs="分类管理,分类列表"></breadcrumb>

    <div class="category_main">
      <!-- 左侧商品分类 tree -->
      <div class="left_category" ref="categoryTree" :style="{width: tableHeight}">
        <div class="category_title">商品分类</div>
        <el-tree
          :props="categoryTree"
          :load="loadNode"
          lazy>
        </el-tree>
      </div>

      <!-- 右侧 分类列表 -->
      <div class="main_content" ref="mainContent" :model="searchForm">
        <div ref="searchForm">
          <el-form :inline="true" class="demo-form-inline search_form">
            <el-form-item>
              <el-input v-model="searchForm.title" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input v-model="searchForm.category" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="商品平台:">
              <el-select v-model="searchForm.appType" placeholder="请选择平台类型">
                <el-option label="全部" value=""></el-option>
                <el-option label="天猫" value="1"></el-option>
                <el-option label="淘宝" value="2"></el-option>
                <el-option label="拼多多" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">查询</el-button>
            </el-form-item>
          </el-form>
        </div>

        <!-- 列表 -->
        <div class="list_content">
          <div class="button_list" ref="buttonList">
            <!-- 按钮 -->
            <el-button type="success" class="el-icon-plus" @click="jumpPage">新增</el-button>
            <el-button type="primary" class="el-icon-edit" @click="jumpPage">编辑</el-button>
            <el-button type="danger" class="el-icon-delete">删除</el-button>
          </div>

          <!-- 表格 -->
          <el-table class="table_list"
                    ref="tableList"
                    :data="productList"
                    tooltip-effect="dark"
                    @row-click="rowClick"
                    @setCurrentRow="selectedRow"
                    @selection-change="handleSelectionChange"
                    :height="tableHeight">
            <el-table-column class="table_column_field" type="selection"/>
            <el-table-column
              label="商品平台"
              show-overflow-tooltip>
              <template slot-scope="scope">{{ appTypeDict[scope.row.appType] }}</template>
            </el-table-column>
            <el-table-column
              prop="shopName"
              label="店铺"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="title"
              label="商品名称">
            </el-table-column>
            <el-table-column
              prop="productType"
              label="商品分类"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="expirationDate"
              label="活动截止时间"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <div class="table_pagination block" ref="pagination">
            <el-pagination
              background
              @size-change="search"
              @current-change="search"
              :current-page="page.curPage"
              :page-sizes="page.sizes"
              :page-size="page.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.totalSize">
            </el-pagination>
          </div>
        </div>
      </div>
      </div>
    </div>
</template>

<script>
import breadcrumb from "@/components/common/Breadcrumb"
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      tableHeight: 0,
      page: {
        curPage: 1, // 当前页
        sizes: [10, 20, 50, 100], // 默认可查询分页数
        totalSize: 100, // 总记录数
        size: 10, // 默认显示为10条
      },
      searchForm: {
        title: '',
        category: '',
        appType: ''
      },
      productList: [
        {
          appType: '',
          title: '',
          shopName: '',
          productType: '',
          expirationDate: ''
        }
      ],
      appTypeDict: {
        1: '天猫',
        2: '淘宝',
        3: '拼多多'
      },
      multipleSelection: [],
      categoryTree: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {
    selectedRow(row) {
      if (row) {
        this.$refs.tableList.setCurrentRow(row)
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 分页查询
    search() {
      let pageObj = this.page // 获取当前分页数据
      let searchForm = this.searchForm // 查询搜索参数
      let data = {
        page: pageObj.curPage,
        psize: pageObj.size,
        productName: searchForm.title,
        appType: searchForm.appType,
        shopName: searchForm.shopName
      }
      this.$http.post("/product/list", data).then((res) => {
        if (res.status == 200) {
          let records = res.data.records
          this.page.curPage = res.data.page
          this.page.totalSize = res.data.totalSize
          this.productList = res.data.records
        }
      })
    },
    /**
     * 点击当前行为选中状态
     */
    rowClick(row) {
      if (row) {
        this.$refs.tableList.toggleRowSelection(row)
      }
    },
    /**
     * 页面跳转
     */
    jumpPage() {
      let selected = this.multipleSelection
      if (selected && selected.length > 1 || selected.length <= 0) {
        this.$message.warning("请选择一行!")
        return
      }
      let row = selected[0]
      debugger
      this.$router.push({path: '/product/edit', query: {id: row.id}})
    },
    /**
     * 左侧商品管理懒加载tree
     *
     * @param node
     * @param resolve
     * @returns {*}
     */
    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: 'region' }]);
      }
      if (node.level > 1) return resolve([]);
      setTimeout(() => {
        const data = [{
          name: 'leaf',
          leaf: true
        }, {
          name: 'zone'
        }];
        resolve(data);
      }, 500);
    }
  },
  mounted () {
    // 查询商品信息
    this.search()
  },
  updated () {
    // 自适应table内容高度
    let totalHeight = document.documentElement.clientHeight
    let contentPadding = 40
    let tableHeader = 48
    let breadcrumb = 31
    let searchFormHeight = this.$refs.searchForm.offsetHeight + 20
    let buttomListHeight = this.$refs.buttonList.offsetHeight
    let paginationHeight = this.$refs.pagination.offsetHeight
    this.tableHeight = totalHeight - searchFormHeight - buttomListHeight - paginationHeight
                       - contentPadding - tableHeader - breadcrumb
    // debugger
    // this.$refs.categoryTree.offsetHeight = this.tableHeight
  }
}
</script>

<style lang="less" scoped>
  .container {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
  }

  .category_main {
    display: flex;
    justify-content: space-between;
    height: 100%;
  }

  /* 左侧分类tree */
  .left_category {
    width: 25%;
    border: 1px solid #F3F3F3;
    //height: 100%;
    box-sizing: border-box;
    margin: 10px 0 10px 10px;
    border-radius: 5px;
    overflow: hidden;

    .category_title {
      height: 40px;
      line-height: 40px;
      width: 100%;
      background-color: #CCCCCC;
      font-size: 14px;
      text-align: left;
      padding-left: 10px;
      box-sizing: border-box;
      color: #FFFFFF;
    }
  }

  /* 主内容 */
  .main_content {
    width: 75%;
    box-sizing: border-box;
    height: 60px;
  }

  /* 搜索框 */
  .search_form {
    width: 100%;
    border: 1px #F3F3F3 solid;
    border-radius: 5px;
    display: flex;
    justify-content: left;
    padding: 10px;
    margin: 10px;
    z-index: 1;
  }

  .el-form-item {
    margin-bottom: 0;
  }

  /* 按钮 */
  .list_content {
    border: 1px solid #F3F3F3;
    margin: 10px;

    .button_list {
      padding: 10px;
      display: flex;
      justify-content: left;
    }

    .list_pagination {
      padding: 15px;
    }

    button {
      padding: 12px 15px;
    }

    button::before {
      padding-right: 5px;
    }
  }

  /* 分页 */
  .table_pagination {
    padding: 15px 0;

    .el-pagination {
      font-weight: 400;
    }
  }
</style>