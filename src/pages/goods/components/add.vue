<template>
  <div>
    <el-dialog :title="info.isAdd?'添加商品':'编辑商品' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="一级分类" label-width="100px">
            <!-- 二级联动 -->
            <el-select v-model="data.first_cateid" @change="changeFirstCateId">
              <el-option value label="--请选择--" disabled></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in cateList"
                :key="item.id"
                :value="item.id"
                :label="item.catename"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="二级分类" label-width="100px">
            <el-select v-model="data.second_cateid">
              <el-option value label="--请选择--" disabled></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in secondCateList"
                :key="item.id"
                :value="item.id"
                :label="item.catename"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="商品名称" label-width="100px">
            <el-input v-model="data.goodsname" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="商品价格" label-width="100px">
            <el-input v-model.number="data.price" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="市场价格" label-width="100px">
            <el-input v-model.number="data.market_price" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="图片" label-width="100px">
          <div class="imgbox">
            +
            <img v-if="imgUrl" :src="imgUrl" alt />
            <!-- 弹框消失，imgUrl也置空，但是input标签上的文件没有置空，如果想要input置空。需要input绑定v-if -->
            <input v-if="info.isshow" type="file" class="fileImg" @change="changImg" />
          </div>
        </el-form-item>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="商品规格" label-width="100px">
            <el-select v-model="data.specsid" @change="changeSpecsId">
              <el-option value label="--请选择--" disabled></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in specsList"
                :key="item.id"
                :value="item.id"
                :label="item.specsname"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="规格属性" label-width="100px">
            <el-select v-model="data.specsattr" multiple>
              <el-option value label="--请选择--" disabled></el-option>
              <!-- 需要一段数据 -->
              <el-option v-for="item in showSpecsAttr" :key="item" :value="item" :label="item"></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="是否新品" label-width="100px">
          <template>
            <el-radio v-model="data.isnew" :label="1">是</el-radio>
            <el-radio v-model="data.isnew" :label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="是否热卖" label-width="100px">
          <template>
            <el-radio v-model="data.ishot" :label="1">是</el-radio>
            <el-radio v-model="data.ishot" :label="2">否</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="商品描述" label-width="100px">
          <template>
            <v-editor ref="editor"></v-editor>
            <!-- description  -->
          </template>
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
import { mapActions, mapGetters } from "vuex";
import {
  reqCateList,
  reqGoodsAdd,
  reqGoodsGetOne,
  reqGoodsEdit,
} from "../../../utils/http";
import path from "path";
export default {
  props: ["info"],
  data() {
    return {
      data: {
        first_cateid: "", //一级分类
        second_cateid: "", //二级分类
        goodsname: "", //商品名称
        price: "", //商品价格
        market_price: "", //市场价格
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: [], //商品规格属性
        isnew: 1, //是否新品     1-是 2-否
        ishot: 1, //是否热卖推荐 1-是 2-否
        img: null, //图片(文件，一般用于二级商品)
        status: 1, //状态  1正常2禁用
      },
      imgUrl: "",
      secondCateList: [], //初始化二级分类列表
      showSpecsAttr: [], //初始化规格选项
    };
  },
  computed: {
    ...mapGetters({
      //分类的list
      cateList: "cate/list",
      // 规格的list
      specsList: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqList",
      reqlistCount: "goods/reqlistCount",
      //分类列表的获取
      reqCateList: "cate/reqList",
      // 规格列表的获取
      reqSpecsList: "specs/reqList",
    }),
    //   弹框取消
    cancel() {
      //   如果是编辑，就清空数据
      if (!this.info.isAdd) {
        this.empty();
        this.info.isAdd = true;
        this.$refs.editor.content = "";
      }
      this.info.isshow = false;
    },
    //   数据清空
    empty() {
      // 展示的图片清空，不然会检测不到change事件的改变
      this.imgUrl = "";
      this.data = {
        first_cateid: "", //一级分类
        second_cateid: "", //二级分类
        goodsname: "", //商品名称
        price: "", //商品价格
        market_price: "", //市场价格
        description: "", //商品描述
        specsid: "", //商品规格编号
        specsattr: [], //商品规格属性
        isnew: 2, //是否新品     1-是 2-否
        ishot: 2, //是否热卖推荐 1-是 2-否
        img: null, //图片(文件，一般用于二级商品)
        status: 1, //状态  1正常2禁用
      };
      this.secondCateList = [];
      // 规格属性展示的所有选项的列表
      this.showSpecsAttr = [];
    },
    //封装的验证
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.data.first_cateid === "") {
          errorMsg("一级分类不能为空");
          
          return;
        }

        if (this.data.second_cateid === "") {
          errorMsg("二级分类不能为空");
          return;
        }
        if (this.data.goodsname === "") {
          errorMsg("商品名称不能为空");
          return;
        }

        if (this.data.price === "") {
          errorMsg("商品价格不能为空");
          return;
        }

        if (this.data.market_price === "") {
          errorMsg("商品市场价格不能为空");
          return;
        }

        if (!this.data.img) {
          errorMsg("请上传图片");
          return;
        }
        if (this.data.specsid === "") {
          errorMsg("商品规格不能为空");
          return;
        }

        if (this.data.specsattr.length === 0) {
          errorMsg("请选择规格属性");
          return;
        }
        if (this.$refs.editor.content == "") {
          errorMsg("请输入商品描述");
          return;
        }
        resolve();
      });
    },
    // 添加
    add() {
      this.checkProps().then(() => {
        // 父组件调用子组件的方法
        this.data.description = this.$refs.editor.content;
        let newData = {
          ...this.data,
          specsattr: JSON.stringify(this.data.specsattr),
        };
        reqGoodsAdd(newData).then((res) => {
          if (res.data.code === 200) {
            successMsg(res.data.msg);
            // 弹框关闭
            this.cancel();
            // 清空数据
            this.empty();
            // 刷新列表
            this.reqlistCount();
            this.reqList();
          }
        });
      });
    },
    // 获取一条数据
    getOne(id) {
      reqGoodsGetOne({ id }).then((res) => {
        if (res.data.code == 200) {
          this.data = res.data.list;
          // 补id
          this.data.id = id;
          // 处理图片
          this.imgUrl = this.$pre + this.data.img;
          // 父组件调用子组件的方法
          this.$refs.editor.content = this.data.description;
          //重新获取二级分类的list
          this.getSecondList();
          //规格属性展示list
          this.getShowSpecsAttr();
          //规格属性选中的list
          this.data.specsattr = JSON.parse(this.data.specsattr);
        }
      });
    },
    // 真正的修改
    update() {
      this.checkProps().then(() => {
        // 父组件调用子组件的方法
        this.data.description = this.$refs.editor.content;
        let newdata = {
          ...this.data,
          specsattr: JSON.stringify(this.data.specsattr),
        };
        reqGoodsEdit(newdata).then((res) => {
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

    //根据一级分类，计算出二级分类的list
    changeFirstCateId() {
      this.data.second_cateid = "";
      this.getSecondList();
    },
    //根据一级分类，计算出二级分类的list
    getSecondList() {
      reqCateList({ pid: this.data.first_cateid }).then((res) => {
        if (res.data.code == 200) {
          this.secondCateList = res.data.list;
        }
      });
    },

    // 规格变了
    changeSpecsId() {
      // 之前规格清空
      this.data.specsattr = [];
      //计算出规格属性展示的所有选项的列表
      this.getShowSpecsAttr();
    },
    //获取规格属性的展示列表
    getShowSpecsAttr() {
      //选中的规格是 data.specsid,要从specsList中取出id和data.specsid一样的那条数据的attrs
      let obj = this.specsList.find((item) => item.id == this.data.specsid); //找到了，返回哪条数据，没找到，返回undefined
      this.showSpecsAttr = obj ? obj.attrs : [];
    },
  },
  mounted() {
    //如果没有请过分类数据，就发一下请求
    if (this.cateList.length === 0) {
      this.reqCateList();
    }
    // 请求规格list
    this.reqSpecsList(true);
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