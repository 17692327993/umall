<template>
  <div>
    <el-dialog :title="info.isAdd?'添加活动':'编辑活动' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="活动名称" label-width="100px">
            <el-input v-model="data.title" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="活动时间" label-width="100px">
          <el-date-picker
            v-model="dateTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
          ></el-date-picker>
        </el-form-item>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="一级分类" label-width="100px">
            <!-- 二级联动 -->
            <el-select v-model="data.first_cateid" @change="changefirst_id">
              <el-option value label="--请选择--" disabled></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in firstList"
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
            <el-select v-model="data.second_cateid" @change="changesecond_cateid">
              <el-option value label="--请选择--" disabled></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in secondList"
                :key="item.id"
                :value="item.id"
                :label="item.catename"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="活动商品" label-width="100px">
            <el-select v-model="data.goodsid">
              <el-option value label="--请选择--" disabled></el-option>
              <!-- 需要一段数据 -->
              <el-option
                v-for="item in goodsList"
                :key="item.id"
                :value="item.id"
                :label="item.goodsname"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

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
  reqCateList,
  reqGoodsList,
  reqSecKillAdd,
  reqSecKillEdit,
  reqSecKillGetOne,
} from "../../../utils/http";
import { mapActions, mapGetters } from "vuex";
import path from "path";

export default {
  props: ["info"],
  data() {
    return {
      dateTime: "",
      data: {
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        first_cateid: "", //一级分类
        second_cateid: "", //二级分类
        goodsid: "", //活动编号
        status: 1, //状态  1正常2禁用
      },
      secondList: [], //二级分类列表
      goodsList: [], //商品列表
    };
  },
  methods: {
    ...mapActions({
      cateList: "cate/reqList",
      seckillList: "seckill/reqList",
    }),
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
      this.data = {
        first_cateid: "", //一级分类
        second_cateid: "", //二级分类
        title: "", //限时秒杀名称
        begintime: "", //开始时间
        endtime: "", //结束时间
        goodsid: 0, //活动编号
        status: 1, //状态  1正常2禁用
      };
    },
    // 添加
    add() {
      this.data.begintime = Date.parse(new Date(this.dateTime[0])); //开始时间
      this.data.endtime = Date.parse(new Date(this.dateTime[1])); //结束时间
      reqSecKillAdd(this.data).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          // 弹框关闭
          this.cancel();
          // 清空数据
          this.empty();
          // 刷新列表
          this.seckillList();
        }
      });
    },
    // 获取一条数据
    getOne(id) {
      reqSecKillGetOne({ id }).then((res) => {
        if (res.data.code == 200) {
          this.data = res.data.list;
          // 补id
          this.data.id = id;
          // 获取二级分类
          this.getCateList();
          // 获取商品信息
          this.getGoodsInfo();
          let startTime=this.formatDateTime(res.data.list.begintime)
          let endTime=this.formatDateTime(res.data.list.endtime)
          this.dateTime=[startTime,endTime]
        
        }
      });
    },
    // 真正的修改
    update() {
      this.data.begintime = Date.parse(new Date(this.dateTime[0])); //开始时间
      this.data.endtime = Date.parse(new Date(this.dateTime[1])); //结束时间
      reqSecKillEdit(this.data).then((res) => {
        if (res.data.code === 200) {
          successMsg(res.data.msg);
          this.cancel();
          this.empty();
          // 刷新列表
          this.seckillList();
        }
      });
    },
    // 一级分类变了，获取二级分类
    changefirst_id() {
      // 清空选中二级分类
      this.data.second_cateid = "";
      // 清空选中二级分类
      this.data.goodsid = "";
      this.getCateList();
    },
    getCateList() {
      reqCateList({ pid: this.data.first_cateid }).then((res) => {
        if (res.data.code === 200) {
          this.secondList = res.data.list;
        }
      });
    },
    //二级分类变了，获取商品信息
    changesecond_cateid() {
      // 清空选中二级分类
      this.data.goodsid = "";
      this.getGoodsInfo();
    },
    getGoodsInfo() {
      reqGoodsList({
        fid: this.data.first_cateid,
        sid: this.data.second_cateid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.goodsList = res.data.list;
        }
      });
    },
    /*时间戳转换成-年月日时分秒*/
    formatDateTime(inputTime) {
      inputTime=Number(inputTime)
      //inputTime为13位
      var date = new Date(inputTime);
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },
  },
  computed: {
    ...mapGetters({
      firstList: "cate/list",
    }),
  },
  mounted() {
    // 获取一级分类
    //如果没有请过分类数据，就发一下请求
    if (this.firstList.length === 0) {
      this.cateList();
    }
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