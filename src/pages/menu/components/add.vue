<template>
  <div>
    <el-dialog :title="info.isAdd?'添加菜单':'编辑菜单' " :visible.sync="info.isshow" @closed="cancel">
      <el-form>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="菜单名称" label-width="100px">
            <el-input v-model="user.title" autocomplete="off"></el-input>
          </el-form-item>
        </div>
        <div class="redParent">
          <span class="red">*</span>
          <el-form-item label="上级菜单" label-width="100px">
            <el-select v-model="user.pid" @change="changePid">
              <el-option value  label="--请选择--" disabled></el-option>
              <el-option :value="0" label="顶级菜单"></el-option>
              <!-- 需要一段数据 -->
              <el-option v-for="item in list" :key="item.id" :value="item.id" :label="item.title"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="菜单类型" label-width="100px">
          <template>
            <el-radio v-model="user.type" :label="1" disabled>目录</el-radio>
            <el-radio v-model="user.type" :label="2" disabled>菜单</el-radio>
          </template>
        </el-form-item>

        <el-form-item label="菜单图标" label-width="100px" v-if="user.type==1">
          <el-select v-model="user.icon">
            <el-option v-for="item in icons" :key="item" :value="item">
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="菜单地址" label-width="100px" v-else>
          <el-select v-model="user.url">
            <el-option
              v-for="item in indexRoutes"
              :key="item.path"
              :value="'/'+item.path"
              :label="item.name+'--/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <!-- 1正常2禁用   number类型 -->
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
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
import { indexRoutes } from "../../../router/index";
import { reqMenuAdd, reqMenuDetail, reqMenuUpdate } from "../../../utils/http";
import { successMsg, errorMsg } from "../../../utils/alert";
export default {
  props: ["info", "list"],
  data() {
    return {
      user: {
        pid: '',
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
      icons: [
        "el-icon-delete-solid",
        "el-icon-setting",
        "el-icon-goods",
        "el-icon-camera-solid",
        "el-icon-s-unfold",
      ],
      indexRoutes,
    };
  },
  methods: {
    // 取消
    cancel() {
      //45.编辑清空数据
      if (!this.info.isAdd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    // 清空数据
    empty() {
      this.user = {
        pid: '',
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    changePid() {
      if (this.user.pid == 0) {
        this.user.type = 1;
      } else {
        this.user.type = 2;
      }
    },
    chenckProps() {
      return new Promise((resolve, reject) => {
        if (this.user.title == "") {
          errorMsg("菜单名称不能为空");
          return false;
        }
        if (this.user.pid==='') {
           errorMsg("菜单分类不能为空");
          return false;
        }
        resolve();
      });
    },
    // 添加
    add() {
      this.chenckProps().then(() => {
        reqMenuAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            // 提示添加成功
            successMsg(res.data.msg);
            // 弹框消失
            this.cancel();
            // 清空数据
            this.empty();
            // 通知父组件重新获取列表
            this.$emit("init");
          }
        });
      });
    },
    getOne(id) {
      // 获取单条数据
      reqMenuDetail(id).then((res) => {
        if (res.data.code === 200) {
          this.user = res.data.list;
          this.user.id = id;
        }
      });
    },
    update() {
      this.chenckProps().then(() => {
        reqMenuUpdate(this.user).then((res) => {
          if (res.data.code === 200) {
            successMsg(res.data.msg);
            // 关闭弹框
            this.cancel();
            // 清空数据
            this.empty();
            //刷新list
            this.$emit("init");
          }
        });
      });
    },
  },
};
</script>

<style scoped>
</style>