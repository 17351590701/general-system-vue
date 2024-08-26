<template>
  <div class="container">
    <div class="loginContainer">
      <div class="login">
        <div class="logo">
          LOGIN
        </div>
        <div class="content">
          <el-form :model="loginModel" ref="form" :rules="rules" style="margin-left: 60px">
            <el-form-item prop="username">
              <el-input v-model="loginModel.username" prefix-icon="user" placeholder="请输入用户名"
                style="width: 95%;"></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="loginModel.password" show-password prefix-icon="lock" placeholder="请输入密码"
                style="width: 95%;"></el-input>
            </el-form-item>
            <!-- 验证码 -->
            <el-form-item prop="code">
              <el-input v-model="loginModel.code" placeholder="请输入验证码" style="width: 70%;"></el-input>
              <img :src="captchaImageUrl" alt="限流" style="width: 50px;height: 30px;margin-left: 15px;"
                @click="refreshCode">
            </el-form-item>

            <el-form-item>
              <el-button @click="login" style="width: 95%;" type="primary">登录</el-button>
              <!--<span><a class="toRegister" @click="toRegister">前往注册</a></span>-->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus';
import { loginApi } from '@/api/user'
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import request from '@/http/index'
import { getCaptchaImage } from '@/api/user';
import axios from 'axios';

//表单ref属性，用于表单验证
const form = ref<FormInstance>()
//表单绑定对象
const loginModel = reactive({
  username: '',
  password: '',
  code: '',
  captchaId: computed(() => {
    return captchaUuid.value
  })
})
//获取用户信息
const userStore = useUserStore()
const router = useRouter()
//表单验证规则
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    }
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur'
    }
  ],
}

//登录
const login = () => {
  form.value?.validate(async (valid) => {
    let res = null;
    if (valid) {
      res = await loginApi(loginModel)
      if (res && res.code == 200) {
        //存储用户信息，跳转首页
        userStore.setUserId(res.data.userId)
        userStore.setNickName(res.data.nickName)
        userStore.setToken(res.data.token)
        userStore.setAvatar(res.data.avatar)
        ElMessage.success("登录成功")
        //跳转至首页
        await router.push('/')
      }
    } else {
      console.log("登录失败")
    }
  })
}
const captchaImageUrl = ref('');
const captchaUuid = ref('');

const refreshCode = async () => {
  let res = await axios.get('http://localhost:8888/api/sysUser/getImage', { responseType: 'json' });
  if (res.data.msg == '获取成功') {
    captchaUuid.value = res.data.data.captchaId;
    captchaImageUrl.value = `data:image/png;base64,${res.data.data.image}`;
  } else {
    ElMessage.error(res.data.msg)
  }
};
// 初始化获取一次验证码
refreshCode();
</script>

<style scoped lang="scss">
.container {
  height: 100vh;
  width: 100vw;
  background-image: url("@/assets/风.PNG");
  background-size: cover;
  /*调整背景图片的尺寸以适应容器*/
  background-position: center;
  /*调整背景图片的位置居中显示*/
  display: flex;
  align-items: center;
  justify-content: center;

  .login {
    width: 600px;
    height: 350px;
    border-radius: 10px;
    /*毛玻璃效果*/
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;

    .logo {
      width: 30%;
      font-size: 40px;
      line-height: 100px;
      text-align: center;
      color: rgba(255, 255, 255, 0.9);
      font-family: Helvetica, Arial, sans-serif
    }

    .content {
      margin-top: 25px;
      text-align: center;
      height: 320px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

  }
}

.toRegister {
  margin-left: 20px;
  font-size: 15px;
  color: white;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  font-style: italic
}

.toRegister:hover {
  color: #78cbea;
  cursor: pointer;
}
</style>