<template>
  <div>
    <el-dialog :title="info.isAdd?'添加规格':'编辑规格' " :visible.sync="info.isshow" @closed="cancel">
      <el-form :model="datas" ref="datas" label-width="100px" class="demo-ruleForm">
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="规格名称" label-width="100px">
            <!-- autocomplete自动记录 -->
            <el-input v-model="datas.specsname" autocomplete="off"></el-input>
          </el-form-item>
        </div>

        <el-form-item
          label="规格属性"
          label-width="100px"
          v-for="(item,index) in attrsArr"
          :key="index"
        >
          <div class="line">
            <el-input class="line-ipt" v-model="item.value"></el-input>
            <el-button type="primary" class="line-btn" v-if="index==0" @click="addAttr">新增规格属性</el-button>
            <el-button type="danger" class="line-btn" v-else @click="delAttr(index)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <!-- 1正常2禁用   number类型 -->
          <el-switch v-model="datas.status" :active-value="1" :inactive-value="2"></el-switch>
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
import { successMsg, errorMsg } from "../../../utils/alert";
import { reqSpecsAdd, reqSpecsEdit, reqSpecsGetOne } from "../../../utils/http";
import { mapActions, mapGetters } from "vuex";
export default {
  props: ["info"],
  data() {
    return {
      // 会议预约提交表单
      datas: {
        specsname: "", // 规格名称
        status: 1, //状态1正常2禁用---
        attrs: "[]", // "['白色','红色‘，’黄色‘]"
      },
      attrsArr: [{ value: "" }],
    };
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqListTotal: "specs/reqListTotal",
    }),
    //新增属性
    addAttr() {
      this.attrsArr.push({ value: "" });
    },
    //删除属性
    delAttr(index) {
      this.attrsArr.splice(index, 1);
    },
    // 弹框取消
    cancel() {
      if (!this.info.isAdd) {
        // 如果是编辑，就清空数据
        this.empty();
      }
      this.info.isshow = false;
    },
    // 清空数据
    empty() {
      this.attrsArr = [{ value: "" }];
      this.datas = {
        specsname: "",
        attrs: "[]", //"['白色','红色‘，’黄色‘]"
        status: 1, //状态1正常2禁用---
      };
    },
    checkProps() {
      return new Promise((resolve) => {
        if (this.datas.specsname === "") {
          errorMsg("规格名称不能为空");
          return;
        }
        if (this.attrsArr.some((item) => item.value === "")) {
          errorMsg("请输入所有的规格属性");
          return;
        }
        resolve();
      });
    },
    // 点击添加
    add() {
      this.checkProps().then(() => {
        this.datas.attrs = JSON.stringify(
          this.attrsArr.map((item) => item.value)
        );
        // return
        reqSpecsAdd(this.datas).then((res) => {
          if (res.data.code === 200) {
            // 通知父组件刷新列表
            this.reqList();
            this.reqListTotal();

            // 关闭弹框
            this.cancel();
            // 清空数据
            this.empty();
            successMsg(res.data.msg);
          }
        });
      });
    },

    //  获取一条数据
    getOne(id) {
      reqSpecsGetOne({ id }).then((res) => {
        if (res.data.code === 200) {
          this.datas = res.data.list[0];
          this.datas.attrs = JSON.parse(this.datas.attrs);
          this.attrsArr = this.datas.attrs.map((item) => ({ value: item }));
        }
      });
    },
    //真正的编辑
    update() {
      this.checkProps().then(() => {
        // 处理规格
        this.datas.attrs = JSON.stringify(
          this.attrsArr.map((item) => item.value)
        );
        reqSpecsEdit(this.datas).then((res) => {
          if (res.data.code === 200) {
            successMsg(res.data.msg);
            // 弹框关闭
            this.cancel();
            // 更新列表
            this.reqList();
            this.reqListTotal();
          }
        });
      });
    },
  },
};
</script>

<style scoped>
.line {
  display: flex;
}
.line-btn {
  width: auto;
}
.line-ipt {
  flex: 1;
}
</style>


 
 
 

 

