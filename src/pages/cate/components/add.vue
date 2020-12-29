<template>
  <div>
    <el-dialog :title="info.isAdd?'添加分类':'编辑分类' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="上级分类" label-width="100px">
            <el-select v-model="data.pid">
              <el-option value label="--请选择--" disabled></el-option>
              <el-option :value="0" label="顶级分类"></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in list"
                :key="item.id"
                :value="item.id"
                :label="item.catename"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="分类名称" label-width="100px">
            <el-input v-model="data.catename" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="图片" label-width="100px" v-if="data.pid!=0">
          <div class="imgbox">
            +
            <img v-if="imgUrl" :src="imgUrl" alt />
            <!-- 弹框消失，imgUrl也置空，但是input标签上的文件没有置空，如果想要input置空。需要input绑定v-if -->
            <input v-if="info.isshow" type="file" class="fileImg" @change="changImg" />
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
import { reqCateAdd, reqCateDetail, reqCateEdit } from "../../../utils/http";
import path from "path";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info"],
  data() {
    return {
      data: {
        pid: "", //上级分类编号
        catename: "", //商品分类名称
        img: null, //图片(文件，一般用于二级分类)
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
        this.info.isAdd = true;
      }
      this.info.isshow = false;
    },
    //   数据清空
    empty() {
      // 展示的图片清空，不然会检测不到change事件的改变
      this.imgUrl = "";
      this.data = {
        pid:'', //上级分类编号
        catename: "", //商品分类名称
        img: null, //图片(文件，一般用于二级分类)
        status: 1, //状态  1正常2禁用
      };
    },
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.data.pid==='') {
          errorMsg("上级分类不能为空！");
          return;
        }
        if (!this.data.catename) {
          errorMsg("分类名称不能为空！");
          return;
        }
        resolve();
      });
    },
    // 添加
    add() {
      this.checkProps().then(() => {
        reqCateAdd(this.data).then((res) => {
          if (res.data.code === 200) {
            successMsg(res.data.msg);
            // 弹框关闭
            this.cancel();
            // 清空数据
            this.empty();
            // 刷新列表
            this.reqList();
          }
        });
      });
    },
    // 获取一条数据
    getOne(id) {
      reqCateDetail({ id }).then((res) => {
        if (res.data.code == 200) {
          this.data = res.data.list;
          // 补id
          this.data.id = id;
          // 处理图片
          this.imgUrl = this.$pre + this.data.img;
        }
      });
    },
    // 真正的修改
    update() {
      this.checkProps().then(() => {
        reqCateEdit(this.data).then((res) => {
          if (res.data.code === 200) {
            successMsg(res.data.msg);
            this.cancel();
            this.empty();
            // 刷新列表
            this.reqList();
          }
        });
      });
    },
    // 修改图片
    changImg(e) {
      let file = e.target.files[0];
      // 判断图片尺寸不能大于2m
      if (file.size > 2 * 1024 * 2014) {
        errorMsg("图片尺寸不能大于2M!");
        return;
      }
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
    ...mapActions({
      reqList: "cate/reqList",
    }),
  },
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
};
</script>

<style scoped>
.imgbox {
  width: 100px;
  height: 100px;
  border: 1px dashed #999;
  font: 30px/100px "微软雅黑";
  color: #666;
  text-align: center;
  position: relative;
}
.imgbox .fileImg {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>