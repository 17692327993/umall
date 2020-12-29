<template>
  <div class="wrap">
    <div class="form">
      <h3>登录</h3>
      <el-form :model="user" :rules="rules">
        <el-form-item prop="username">
          <el-input class="ipt" placeholder="请输入账号" v-model="user.username" clearable></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input class="ipt" placeholder="请输入密码" v-model="user.password" show-password clearable></el-input>
        </el-form-item>
        <div class="btn">
          <el-button type="primary" @click="login">登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reqLogin } from "../../utils/http";
import { successMsg, errorMsg } from "../../utils/alert";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入账号", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    login() {
      if (!this.user.username || !this.user.password) {
        errorMsg("用户名或者密码不能为空!");
        return;
      }
      reqLogin(this.user).then((res) => {
        if (res.data.code === 200) {
          this.changeUser(res.data.list);
          successMsg(res.data.msg);
          this.$router.push("/");
        }
      });
    },
  },
};
</script>

<style scoped>
.wrap {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(to right, #553444, #443851, #313c5f);
}
.form h3 {
  font: 26px/40px "微软雅黑";
}
.form {
  width: 400px;
  height: 250px;
  background: #ccc;
  text-align: center;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.form .ipt {
  width: 80%;
  margin-top: 20px;
}
.form .btn {
  margin-top: 20px;
}

</style>>