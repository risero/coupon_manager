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
          <el-upload class="more_img_upload"
            :action="uploadAction"
            list-type="picture-card"
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
              <el-input v-model="product.title" placeholder="请输入商品标题"></el-input>
            </el-form-item>
            <el-form-item label="商品链接" prop="productLink">
              <el-input v-model="product.productLink" placeholder="请输入店铺名称"></el-input>
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
                <el-option label="天猫" value="1"></el-option>
                <el-option label="淘宝" value="2"></el-option>
                <el-option label="拼多多" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品分类" prop="productCategory">
              <el-select v-model="product.productCategory" placeholder="请选择商品分类">
                <el-option label="手机数码" value="1"></el-option>
                <el-option label="男装" value="2"></el-option>
                <el-option label="女装" value="3"></el-option>
              </el-select>
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
            <el-form-item label="发货省份" prop="province">
              <el-select v-model="product.province" placeholder="省">
                <el-option label="天猫" value="1"></el-option>
                <el-option label="淘宝" value="2"></el-option>
                <el-option label="拼多多" value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发货城市" prop="city">
              <el-select v-model="product.city" placeholder="市">
                <el-option label="天猫" value="1"></el-option>
                <el-option label="淘宝" value="2"></el-option>
                <el-option label="拼多多" value="3"></el-option>
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
  import DateUtils from '@/assets/js/util'
  export default {
    components: {
      breadcrumb
    },
    data() {
      return {
        uploadAction: axios.defaults.baseURL + "/common/upload",
        imgMaxLimit: 8,
        tempImgUrl: '',
        product: {
          title: '',
          productLink: '',
          originalPrice: '',
          preferentialPrice: '',
          appType: '',
          productCategory: '',
          shopName: '',
          salesVolume: '',
          province: '',
          city: '',
          mainImg: "",
          productImgs: [],
          expirationDate: '',
          status: '0'
        },
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
          appType: [
            { required: true, message: '请选择所属平台', trigger: 'blur' }
          ],
          productCategory: [
            { required: true, message: '请选择商品分类', trigger: 'blur' }
          ],
          shopName: [
            { required: true, message: '请输入店铺名称', trigger: 'blur' }
          ],
          salesVolume: [
            { required: true, message: '请输入商品销量', trigger: 'blur' }
          ],
          province: [
            { required: true, message: '请选择发货省份', trigger: 'blur' }
          ],
          city: [
            { required: true, message: '请选择发货城市', trigger: 'blur' }
          ],
          expirationDate: [
            { required: true, message: '请输入活动截止时间', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请输入商品状态', trigger: 'blur' }
          ]
        },
        productStatusList: [
          {
            label: '上架',
            value: '0'
          },
          {
            label: '下架',
            value: '1'
          },
        ],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    methods: {
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
          let expirationDate = null
          if (data.expirationDate) {
            expirationDate = DateUtils.dateFormat("yyyy-MM-dd HH:ss:mm", data.expirationDate)
          }
          data = JSON.parse(JSON.stringify(this.product));
          data.expirationDate = expirationDate
          data.moreImg = this.product.productImgs.join()
          this.$http.post("/product/edit", data).then((resp) => {
            if (resp.status === 200) {
              this.$message.success("保存成功")
              this.$router.push({path: '/product/list'})
            } else {
              this.$message.error({
                message: '保存失败',
                duration: 8000000
              })
            }
          })
        });
      },
      handleRemove(file, fileList) {
        debugger
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
    padding: 20px;
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
