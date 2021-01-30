<template>
  <div class="container">
    <!-- 面包屑路由 -->
    <breadcrumb class="breadcrumb" ref="breadcrumb" breadcrumbs="分类管理,分类列表"></breadcrumb>

    <div class="category_main">
      <!-- 左侧商品分类 tree -->
      <div class="left_category">
        <div class="category_title">商品分类</div>
        <el-tree
          ref="categoryTree"
          :data="categoryTree"
          :props="treeConfig"
          :expand-on-click-node="false"
          node-key="id"
          @node-click="nodeClick"
          :default-checked-keys="['ROOT']"
          highlight-current
          default-expand-all>
        </el-tree>
      </div>

      <!-- 右侧 分类列表 -->
      <div class="main_content" ref="mainContent" :model="searchForm">
        <div ref="searchForm">
          <el-form :inline="true" class="demo-form-inline search_form">
            <el-form-item>
              <el-input v-model="searchForm.name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="是否上架:">
              <el-select v-model="searchForm.isShow" placeholder="请选择上架状态">
                <el-option label="全部" value=""></el-option>
                <el-option label="上架" value="0"></el-option>
                <el-option label="下架" value="1"></el-option>
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
            <el-button type="success" class="el-icon-plus" @click="editDialog('add')">新增</el-button>
            <el-button type="primary" class="el-icon-edit" @click="editDialog('edit')">编辑</el-button>
            <el-button type="danger" class="el-icon-delete" @click="remove">删除</el-button>
          </div>

          <!-- 表格 -->
          <el-table class="table_list"
                    ref="tableList"
                    :data="categoryList"
                    tooltip-effect="dark"
                    @row-click="rowClick"
                    @selection-change="handleSelectionChange"
                    :height="tableHeight">
            <el-table-column class="table_column_field" type="selection"/>
            <el-table-column
              prop="fullName"
              label="分类全称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="name"
              label="分类名称"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              label="是否上架"
              show-overflow-tooltip>
              <template slot-scope="scope">{{ showDict[scope.row.isShow] }}</template>
            </el-table-column>
            <el-table-column
              prop="sequence"
              label="上架顺序"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
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

    <!-- 分类保存内容弹出框 -->
    <el-dialog
      title="商品分类编辑表单"
      :visible.sync="showCategoryForm"
      center
      width="50%">
      <el-form class="category_form" :model="category" :rules="categorySaveRules">
        <el-form-item label="所属分类" :label-width="formLabelWidth">
          <el-input v-model="category.fullName" placeholder="parent" :disabled="true"></el-input>
          <el-input v-show="false" v-model="category.parentId"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName" :label-width="formLabelWidth">
          <el-input v-model="category.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="是否上架" prop="isShow" :label-width="formLabelWidth">
          <el-select v-model="category.isShow" placeholder="请选择需要上架的分类">
            <el-option v-for="item in isShowList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上架顺序" prop="sequence" :label-width="formLabelWidth">
          <el-input v-model="category.sequence" placeholder="请填写上架顺序"></el-input>
        </el-form-item>
      </el-form>

      <!-- 保存按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCategory">保存</el-button>
        <el-button @click="showCategoryForm=false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 删除确认弹出框 -->
    <el-dialog
      title="提示"
      :visible.sync="showDeleteDialog"
      width="30%"
      center>
      <span>确定删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button type="danger" @click="remove">确 定</el-button>
    <el-button @click="showDeleteDialog = false">取 消</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from "@/components/common/Breadcrumb"
export default {
  components: {
    breadcrumb
  },
  directives:{
    clickNode:{
      inserted(el){
        el.click()
      }
    }
  },
  data() {
    return {
      tableHeight: 0,
      page: {
        curPage: 1, // 当前页
        sizes: [10, 20, 50, 100], // 默认可查询分页数
        totalSize: 0, // 总记录数
        size: 20, // 默认显示为10条
      },
      searchForm: {
        name: '',
        isShow: '',
      },
      category: {
        name: "",
        parentId: "",
        isShow: "1",
        sequence: "",
        fullName: ""
      },
      isShowList: [
        {
          label: '上架',
          value: 0
        },
        {
          label: '下架',
          value: 1
        }
      ],
      showDict: {
        0: '上架',
        1: '下架',
      },
      showDeleteDialog: false,
      multipleSelection: [],
      treeConfig: {
        label: 'name',
        children: 'children'
      },
      categoryTree: [],
      flgExpandAll: true, // 是否展开tree的所有节点
      categoryList: [],
      curLevel: 0, // 当前层级
      parentId: "", // 父节点id
      checkedNode: {}, // 选中的节点数据
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      showCategoryForm: false,
      categorySaveRules: {
        categoryName: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
        isShow: [{required: true, message: '请选择是否上架', trigger: 'change'}]
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 分页查询
     */
    search() {
      let pageObj = this.page // 获取当前分页数据
      let searchForm = this.searchForm // 查询搜索参数
      let data = {
        page: pageObj.curPage,
        psize: pageObj.size,
        name: searchForm.name,
        isShow: searchForm.isShow,
      }
      this.$http.post("/category/list", data).then((res) => {
        if (res.status == 200) {
          this.page.curPage = res.data.page
          this.page.totalSize = res.data.total
          this.categoryList = res.data.records
          this.page.curPage = res.data.current
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
    nodeClick(data) {
      if (data.id) {
        this.checkedNode = data
      }
    },
    /**
     * 显示表单
     */
    editDialog(type) {
      // 选择
      if ('add' === type) {
        if (this.checkedNode.id) {
          // 设置表单福父节点信息
          this.category.parentId = this.checkedNode.nodeId
          this.category.fullName = this.checkedNode.fullName
          this.category.isShow=1
          this.showCategoryForm=true
          return
        }
        this.$message.error("请选择节点后添加")
      } else if ('edit' === type) {
        let selected = this.multipleSelection
        if (selected && selected.length > 1 || selected.length <= 0) {
          this.$message.warning("请选择一行!")
          return
        }
        let selectedNode = selected[0]
        this.category = selectedNode
        this.showCategoryForm=true
      }
    },
    /**
     * 保存节点信息
     */
    saveCategory() {
      if (this.category.id !== 'ROOT' && !this.category.parentId) {
        this.$message.error("操作有误，没有父节点数据")
        return;
      }
      let data = {
        parentId: this.category.parentId,
        name: this.category.name,
        isShow: this.category.isShow,
        sequence: this.category.sequence,
      }
      data = {
        id: this.category.id,
        parentId: this.category.parentId,
        name: this.category.name,
        isShow: this.category.isShow,
        sequence: this.category.sequence,
      }
      this.$http.post("/category/edit", data).then((resp) => {
        this.$message.success("保存成功")
        this.showCategoryForm = false
        this.loadCategoryTree()
        this.search()
      })
    },
    /**
     * 加载商品分类数结构
     */
    loadCategoryTree() {
      this.$http.post("/category/categoryTree").then((res) => {
        if (res.status == 200) {
          this.categoryTree = res.data
          // 没有选中节点则设置根节点为默认节点
          if (this.categoryTree.length > 0 && !this.checkedNode.id) {
            this.checkedNode = this.categoryTree[0]
          }
        }
      })
    },
    /**
     * 删除节点
     */
    remove() {
      let selected = this.multipleSelection
      if (selected && selected.length > 1 || selected.length <= 0) {
        this.$message.warning("请选择一行!")
        return
      }
      if (!this.showDeleteDialog) {
        this.showDeleteDialog = true
        return
      }
      // 批量删除
      let ids = []
      for (let key in selected) {
        if (selected[key].id) {
          ids.push(selected[key].id)
        }
      }
      this.$http.post('/category/delete', {ids: ids.join(",")}).then((resp => {
        if (resp.status == 200) {
          this.$message.success("删除成功")
          this.search()
          this.loadCategoryTree()
        }
      })).catch((err) => {
        this.$message.error("操作失败!")
      })
      this.showDeleteDialog = false
    }
  },
  mounted () {
    this.loadCategoryTree()
    // 查询分类信息
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
    height: 500px;
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
    width: auto;
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

  /* 分类保存表单 */
  .category_form {
    .el-form-item {
      padding: 15px 0;
    }

    /deep/ .el-input__inner {
      width: 80%;
      display: flex;
      justify-content: left;
    }

    /deep/ .el-select .el-input__inner {
      width: 100%;
    }

    /deep/ .el-dialog--center .el-dialog__body {
      padding: 0 25px 30px;
    }
  }
</style>
