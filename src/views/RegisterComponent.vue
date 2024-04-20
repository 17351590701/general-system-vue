<template>
  <div class="registerContainer">
    <div class="register">
      <div class="content">
        <el-form :model="registerModel"
                 ref="form"
                 :rules="rules"
                 style="margin-left: 60px"
        >
          <el-form-item prop="username">
            <el-input v-model="registerModel.username" prefix-icon="user" placeholder="请输入用户名"
                      style="width: 95%;"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="registerModel.password" show-password prefix-icon="lock" placeholder="请输入密码"
                      style="width: 95%;"></el-input>
          </el-form-item>

          <el-form-item prop="code">
            <el-input v-model="registerModel.code" placeholder="请输入验证码" style="width: 70%;"></el-input>
            <img :src="imageUrl" alt="验证码" style="width: 50px;height: 30px;margin-left: 15px;" @click="refreshCode">
          </el-form-item>

          <el-form-item>
            <el-button @click="toRegister" style="width: 65%;" type="success">注册</el-button>
            <span><a class="toLogin" @click="toLogin">返回登录</a></span>
          </el-form-item>
        </el-form>
      </div>
      <div class="logo">
        REGISTER
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { type FormInstance } from 'element-plus';
import { loginApi} from '@/api/user'
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
//表单ref属性，用于表单验证
const form = ref<FormInstance>()
//表单绑定对象
const registerModel = reactive({
  username: '',
  password: '',
  code: '',
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
const props= defineProps(['flag','changeFlag'])
function toLogin(){
  props.changeFlag()
  console.log(props.flag)
}

//注册
const toRegister = () => {

}


//验证码图片地址
const imageUrl = ref("http://localhost:8080/api/sysUser/getImage")
//刷新验证码
const refreshCode = () => {
  const date = new Date().getTime();
  imageUrl.value = `http://localhost:8080/api/sysUser/getImage?time=${date}`;

}

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

  .register {
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

.toLogin {
  margin-left: 20px;
  font-size: 15px;
  color: white;
  background-color: rgba(0, 0, 0, 0);
  border: 0;
  font-style: italic
}

.toLogin:hover {
  color: #78cbea;
  cursor: pointer;
}
</style>