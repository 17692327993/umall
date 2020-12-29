<template>
  <div>
    <el-dialog :title="info.isAdd?'添加轮播图':'编辑轮播图' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="标题" label-width="100px">
            <el-input v-model="data.title" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="图片" label-width="100px">
          <div class="img-box">
            <el-upload
              class="avatar-uploader"
              action="#"
              :show-file-list="false"
              :on-change="changImg"
            >
              <img v-if="imgUrl" :src="imgUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <!-- 1正常2禁用   number类型 -->
          <el-switch v-model="data.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { errorMsg, successMsg } from "../../../utils/alert";
import {
  reqBannerAdd,
  reqBannerGetOne,
  reqBannerEdit,
} from "../../../utils/http";
import path from "path";
export default {
  props: ["info", "list"],
  data() {
    return {
      data: {
        title: "", //商品轮播图名称
        img: null, //图片(文件，一般用于二级轮播图)
        status: 1, //状态  1正常2禁用
      },
      imgUrl: "",
    };
  },
  methods: {
    //   弹框取消
    cancel() {
      //   如果是编辑，就清空数据
      if (!this.info.isAdd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //   数据清空
    empty() {
      // 展示的图片清空，不然会检测不到change事件的改变
      this.imgUrl = "";
      this.data = {
        title: "", //商品轮播图名称
        img: null, //图片(文件，一般用于二级轮播图)
        status: 1, //状态  1正常2禁用
      };
    },
    checkProps() {
      return new Promise((resolve, reject) => {
        if (!this.data.title) {
          errorMsg("轮播图名称不能为空！");
          return;
        }
        if (this.data.img===null) {
          errorMsg("轮播图不能为空！");
          return;
        }
        resolve();
      });
    },
    // 添加
    add() {
      this.checkProps().then(() => {
        reqBannerAdd(this.data).then((res) => {
          if (res.data.code === 200) {
            successMsg(res.data.msg);
            // 弹框关闭
            this.cancel();
            // 清空数据
            this.empty();
            // 通知父组件刷新列表
            this.$emit("init");
          }
        });
      });
    },
    // 获取一条数据
    getOne(id) {
      reqBannerGetOne({ id }).then((res) => {
        if (res.data.code == 200) {
          this.data = res.data.list;
          //   // 补id
          this.data.id = id;

          //   // 处理图片
          this.imgUrl = this.$pre + this.data.img;
        }
      });
    },
    // 真正的修改
    update() {
      this.checkProps().then(() => {
        reqBannerEdit(this.data).then((res) => {
          if (res.data.code === 200) {
            successMsg(res.data.msg);
            this.cancel();
            this.empty();
            this.$emit("init");
          }
        });
      });
    },
    // 修改图片
    changImg(e) {
      let file = e.raw;

      // 获取扩展名
      let extArr = [".png", ".jpeg", ".jpg", ".gif"];
      let extname = path.extname(file.name);
      // 说明没找到
      if (extArr.indexOf(extname) == -1) {
        errorMsg("图片格式不正确!");
        return;
      }
      // 将文件生成一个url地址
      this.imgUrl = URL.createObjectURL(file);
      // 给当前数据赋值
      this.data.img = file;
    },
  },
};
</script>

<style scoped>
/* stylus的穿透 ，也就是让样式级别更高，比行内样式还高，只能在vue的stylus中使用，less，sass都不支持 */
.img-box >>> .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>