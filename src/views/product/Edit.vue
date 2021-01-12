<template>
  <div class="container">
    <breadcrumb breadcrumbs="商品管理,商品新增"></breadcrumb>
    <el-form :inline="true" ref="productForm" :model="product" :rules="rules" class="product_form">
      <div class="content_left">
        <!-- 首页商品图片 -->
        <div class="main_img">
          <el-upload
            class="avatar-uploader"
            :action="uploadAction"
            :show-file-list="false"
            :on-success="handleMainProductImg"
            drag
            :before-upload="beforeAvatarUpload">
            <img v-if="tempImgUrl" :src="tempImgUrl" class="avatar">
            <i v-else class="el-icon-upload avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <!-- 更多图片 -->
        <div class="more_img">
          <el-upload
            class="more_img_upload"
            :action="uploadAction"
            list-type="picture-card"
            :file-list="displayMoreImg"
            multiple
            :limit="imgMaxLimit"
            :on-success="handleProductMore"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-exceed="onExceed">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
      </div>
      <!-- 商品详细信息 -->
      <div class="content_right">
          <div class="row_form">
            <el-form-item label="商品标题" prop="title">
              <el-input v-model="product.title" class="title" placeholder="请输入商品标题"></el-input>
            </el-form-item>
            <el-form-item label="商品链接" prop="productLink">
              <el-input v-model="product.productLink" class="product_link" placeholder="请输入店铺名称"></el-input>
            </el-form-item>
          </div>
          <div class="group_item">
            <el-form-item label="商品原价" prop="originalPrice">
              <el-input v-model="product.originalPrice" placeholder="请输入商品原价"></el-input>
            </el-form-item>
            <el-form-item label="优惠价格" prop="preferentialPrice">
              <el-input v-model="product.preferentialPrice" placeholder="请输入优惠卷价格"></el-input>
            </el-form-item>
          </div>
          <div class="group_item">
            <el-form-item label="所属平台" prop="appType">
              <el-select v-model="product.appType" placeholder="请选择商品所属平台">
                <el-option v-for="item in appTypeList" :label="item.name" :value="item.value"/>
              </el-select>
            </el-form-item>

            <el-form-item label="商品分类" prop="cid">
              <el-cascader
                v-model="product.cid"
                :options="options"
                filterable
                :props="categorySelectProps"
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </div>
          <div class="group_item">
            <el-form-item label="店铺名称" prop="shopName">
              <el-input v-model="product.shopName" placeholder="请输入店铺名称"></el-input>
            </el-form-item>
            <el-form-item label="销量" prop="salesVolume">
              <el-input v-model="product.salesVolume" placeholder="请输入店铺名称"></el-input>
            </el-form-item>
          </div>

          <div class="group_item">
            <el-form-item label="首页推荐" prop="isRecommend">
              <el-select v-model="product.isRecommend" placeholder="选择是否为首页推荐">
                <el-option v-for="item in isRecommendList" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="推荐顺序" prop="sequence">
              <el-input v-model="product.sequence" placeholder="请设置推荐顺序"></el-input>
            </el-form-item>
          </div>

          <div class="group_item">
            <el-form-item label="发货省份" prop="provinceId">
              <el-select v-model="product.provinceId" @change="getCity" placeholder="请选择发货省份">
                <el-option v-for="item in provinceList" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货城市" prop="cityId">
              <el-select v-model="product.cityId" @change="getCity" placeholder="请选择发货城市">
                <el-option v-for="item in cityList" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="group_item">
            <el-form-item label="截止时间" prop="expirationDate">
              <el-date-picker
                v-model="product.expirationDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="商品状态" prop="status">
              <el-select v-model="product.status" placeholder="商品状态">
                <el-option :label="item.label" :value="item.value" v-for="(item) in productStatusList" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
      </div>
    </el-form>

    <div class="floor">
      <el-button class="form_save" type="primary" @click="onSubmit">保存</el-button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import breadcrumb from "@/components/common/Breadcrumb";
  import util from '@/assets/js/util'
  export default {
    components: {
      breadcrumb
    },
    data() {
      return {
        currentId: '',
        uploadAction: axios.defaults.baseURL + "/common/upload",
        imgMaxLimit: 8,
        tempImgUrl: '',
        displayMoreImg: [],
        product: {
          title: '',
          productLink: '',
          originalPrice: '',
          preferentialPrice: '',
          appType: '',
          cid: '',
          shopName: '',
          salesVolume: '',
          provinceId: '',
          cityId: '',
          mainImg: "",
          productImgs: [],
          expirationDate: '',
          status: '0',
          isRecommend: 1,
          sequence: ''
        },
        isRecommendList: [
          {
            name: "是",
            value: 0
          },
          {
            name: "否",
            value: 1
          }
        ],
        appTypeList: [
          {
            name: '天猫',
            value: 1
          }, {
            name: '淘宝',
            value: 2
          }, {
            name: '拼多多',
            value: 3
          }
        ],
        cityList: [],
        provinceList: [],
        cityDict: {},
        provinceDict: {},
        categorySelectProps: {
          value: 'id',
          label: 'name',
          checkStrictly: true,
        },
        options: [],
        rules: {
          title: [
            { required: true, message: '请输入商品标题', trigger: 'blur' }
          ],
          productLink: [
            { required: true, message: '请输入商品链接', trigger: 'blur' }
          ],
          originalPrice: [
            { required: true, message: '请输入商品原价', trigger: 'blur' }
          ],
          preferentialPrice: [
            { required: true, message: '请输入商品优惠价格', trigger: 'blur' }
          ],
          cid: [
            { required: true, message: '请选择所属平台', trigger: 'blur' }
          ],
          appType: [
            { required: true, message: '请选择商品分类', trigger: 'blur' }
          ],
          shopName: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' }
          ],
          salesVolume: [
            { required: true, message: '请输入商品销量', trigger: 'blur' }
          ],
          provinceId: [
            { required: true, message: '请选择发货省份', trigger: 'blur' }
          ],
          cityId: [
            { required: true, message: '请选择发货城市', trigger: 'blur' }
          ],
          expirationDate: [
            { required: true, message: '请输入活动截止时间', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请输入商品状态', trigger: 'blur' }
          ],
          isRecommend: [
            { required: true, message: '是否为首页推荐商品', trigger: 'blur' }
          ]
        },
        productStatusList: [
          {
            label: '上架',
            value: "0"
          },
          {
            label: '下架',
            value: "1"
          },
        ],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    methods: {
      /**
       * 级联下拉框改变回调
       */
      handleChange(value) {
        console.log(value);
      },
      onSubmit() {
        this.$refs.productForm.validate((valid) => {
          // 保存前校验表单
          if (!valid) return
          if (!this.product.mainImg) {
            this.$message.error("商品首页图片不能为空")
            return
          }
          if (!this.product.productImgs) {
            this.$message.error("商品其他不能为空")
            return
          }

          // 保存
          let data = this.product
          if (this.product.cid && this.product.cid.length > 0) {
            data.cid = this.product.cid[this.product.cid.length - 1]
          }
          let expirationDate = null
          if (!this.currentId && data.expirationDate) {
            expirationDate = util.dateFormat("yyyy-MM-dd HH:ss:mm", data.expirationDate)
          }
          data = JSON.parse(JSON.stringify(this.product));
          data.expirationDate = expirationDate
          data.moreImg = this.product.productImgs.join()
          data.city = this.cityDict[this.product.cityId]
          data.province = this.provinceDict[this.product.provinceId]
          this.$http.post("/product/edit", data).then((resp) => {
            if (resp.status === 200) {
              this.$message.success("保存成功")
              this.$router.push({path: '/product/list'})
            } else {
              this.$message.error({
                message: '保存失败',
              })
            }
          })
        });
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      /**
       * 主图片上传回调
       */
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      /**
       * 商品主图片上传成功处理的回调
       */
      handleMainProductImg(res, file) {
        if (res.status === 200) {
          this.product.mainImg = res.data
        }
        this.tempImgUrl = URL.createObjectURL(file.raw);
      },
      handleProductMore(response, file, fileList) {
        this.dialogImageUrl = file.url;
        for (let i in fileList) {
          let resp = fileList[i].response
          if (resp.status === 200) {
            this.product.productImgs.unshift(resp.data)
          }
        }
      },
      onExceed() {
        this.$message.error("上传图片不能超过8张")
      },
      /**
       * 上传前校验图片类型
       *
       * @param file
       * @returns {boolean}
       */
      beforeAvatarUpload(file) {
        let reg = /\.(png|jpg|gif|jpeg|webp)$/;
        const isLt5M = file.size / 1024 / 1024 < 5;
        const isImg = reg.test(file.name)
        if (!reg.test(file.name)) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt5M) {
          this.$message.error('上传头像图片大小不能超过 5MB!');
        }
        return isImg && isLt5M;
      },
      /**
       * 删除之前上传成功的图片
       */
      removeUploadImg(key) {
        this.$http.post('/common/removeFile', {key: key})
      },
      /**
       * 加载商品分类下拉框数据
       */
      loadCategory() {
        this.$http.post("/category/categoryTree").then((res) => {
          if (res.status == 200) {
            this.options = res.data
            util.filterTreeNotNode(this.options)
          }
        })
      },
      /**
       * 加载省份列表
       */
      getProvince() {
        this.$http.post('/commonArea/getProvinceList').then((res) => {
          if (res.status == 200) {
            this.provinceList = res.data
            for (let i in this.provinceList) {
              let item = this.provinceList[i]
              this.provinceDict[item.id] = item.name
            }
            this.product.provinceId = this.provinceList[0].id
            this.getCity()
          }
        })
      },
      /**
       * 通过省份id加载城市列表
       */
      getCity() {
        let data = {
          provinceId: this.product.provinceId
        }
        this.$http.post('/commonArea/getCityList', data).then((res) => {
          if (res.status == 200) {
            this.cityList = res.data
            this.product.cityId = this.cityList[0].id

            for (let i in this.cityList) {
              let item = this.cityList[i]
              this.cityDict[item.id] = item.name
            }
          }
        })
      }
    },
    created() {
      // 加载省份列表
      this.getProvince()
    },
    mounted() {
      // 加载商品分类下拉框数据
      this.loadCategory()

      // 编辑, 回显数据
      this.currentId = this.$route.query.id
      if (this.currentId) {
        this.$http.post("/product/detailInfo", {id: this.currentId}).then((res) => {
          if (res.status == 200) {
            this.product = res.data
            this.product.productImgs = []
            let imgArr = []
            if (res.data.imgs) {
              imgArr = res.data.imgs.split(",")
            }
            // 第1张图片为主图片
            if (imgArr.length > 0) {
              this.tempImgUrl = imgArr[0]
              this.product.mainImg = imgArr[0]
            }
            // 第1张图片之后为更多图片
            for (let i = 0; i < imgArr.length; i++) {
              this.product.productImgs.push(imgArr[i])
              this.displayMoreImg.push({name: '', url: imgArr[i]})
            }
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }

  /* 商品表单 */
  .product_form {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    box-sizing: border-box;
  }

  .content_left {
    width: auto;
    height: 100%;

    /* 首页图片 */
   .main_img {
      height: 250px;
      width: 380px;
      overflow: hidden;
      position: relative;

     /deep/ .el-upload-dragger {
       width: 100%;
       height: 100%;
     }

      /deep/ .avatar-uploader {
        width: 100%;
        height: 100%;
      }

      /deep/ .el-upload--text {
       width: 100%;
       height: 100%;
      }

       .avatar-uploader-icon {
         font-size: 124px;
         color: #8c939d;
         position: absolute;
         transform: translate(-50%, 75%);
       }

      .avatar {
       height: 250px;
       width: 380px;
      }
    }

    /* 更多图片 */
    .more_img {
      width: 100%;
      height: 100px;

      .more_img_upload {
        margin-top: 20px;
        width: 100%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;

        /deep/ .el-upload {
          width: 100px;
          height: 100%;
          justify-content: left;
          //margin-left: 10px;
          margin-right: 10px;
        }

        .el-upload {
          margin-right: 0;
        }

        /deep/ .el-upload-list {
          height: 100%;
          justify-content: left;
          flex-wrap: wrap;
          display: contents;
        }

        /deep/ .el-upload-list .el-upload-list--picture-card {
          height: 100%;
          justify-content: left;
        }

        /deep/ .el-upload-list__item {
          height: 84px;
          width: 84px;
        }

        /deep/ .el-upload-list__item-actions {
          height: 100%;
          margin-right: 10px;
        }

        /deep/ .el-upload-list__item-thumbnail {
          height: 100%;
        }

        /deep/ .el-upload--picture-card {
          width: 84px;
          height: 84px;
          position: relative;
        }

        /deep/ .el-upload--picture-card i {
          position: absolute;
          transform: translate(-50%, 90%);
        }
      }
    }
  }
  .content_right {
    width: 100%;
    height: 100%;
    margin-left: 40px;

    /deep/ .product_link .el-input__inner, /deep/ .title .el-input__inner {
      width: 100%;
    }

    /* 表单分组 */
    .group_item {
      display: flex;
      flex-direction: row;
      width: 100%;
    }

    /* 表单项 */
    .el-form-item {
      display: flex;
      justify-content: left;
      width: 50%;
      margin-bottom: 20px;
    }

    .el-input {
      width: 100%;
    }

    /deep/ .el-form-item__label {
      width: 90px;
      white-space: normal;
      text-align: left;
    }

    .el-form-item__content {
      padding-right: 15px;
    }

    /* 商品标题 */
    .row_form {
      width: 100%;

      .el-form-item, .el-input {
        width: 100%;
      }

      /deep/ .el-form-item__content {
        width: 100%;
      }
    }

    /* 修改下拉框长度 */
    /deep/ .el-input__inner {
      padding-right: 20px;
    }

    /deep/ .el-date-editor .el-input__inner {
      width: 100%-7px;
    }
  }

  /* 保存按钮 */
  .floor {
    padding: 10px 0;
    border-top: 1px solid #CCCCCC;
    width: 100%;
    display: block;
    position: fixed;
    bottom: 0;
    background-color: #FFFFFF;
    z-index: 1;
  }

  .form_save {
    padding: 12px 25px;
    text-align: center;
  }

  /* 修改elementui message消息框为居中 */
  /deep/ .el-message .el-message--error {
    justify-content: center;
  }
</style>
