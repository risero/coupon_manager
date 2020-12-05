<template>
  <div class="main_list">
    <el-form :inline="true" :model="formInline" class="demo-form-inline search_form">
      <el-form-item>
        <el-input v-model="formInline.user" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="formInline.region" placeholder="请选择平台类型">
          <el-option label="天猫" value="1"></el-option>
          <el-option label="淘宝" value="2"></el-option>
          <el-option label="拼多多" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表 -->
    <div class="list_content">
      <div class="button_list">
        <!-- 按钮 -->
        <el-button>新增</el-button>
        <el-button>修改</el-button>
        <el-button>删除</el-button>
      </div>

      <!-- 表格 -->
      <el-table
        :height="tableHeight"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        @selection-change="handleSelectionChange"
        v-setHeight="{tableHeight:tableHeight}">
        <el-table-column class="table_column_field"
                         type="selection">
        </el-table-column>
        <el-table-column
          label="日期">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="address"
          label="地址"
          show-overflow-tooltip>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="list_pagination block">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="curPage"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="400">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  directives: {
    setHeight: function (el, binding, vnode) {
      setTimeout(function() {
        vnode.context.tableHeight = 400
      })
    }
  },
  data() {
    return {
      tableHeight: 300,
      formInline: {
        user: '',
        region: ''
      },
      curPage: 4,
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-08',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-06',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      },
      {
        date: '2016-05-07',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      multipleSelection: []
    }
  },

  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    onSubmit() {
      console.log('submit!');
    },
    handleCurrentChange() {

    },
    handleSizeChange() {

    }
  }
}
</script>

<style lang="less" scoped>
  .main_list {
    width: auto;
    box-sizing: border-box;
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
  }
</style>
