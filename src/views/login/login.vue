<template>
  <div class="container">
    <div class="login">
      <div class="logo">
        LOGIN
      </div>
      <div class="content">
        <el-form
            :model="loginModel"
            ref="form"
            :rules="rules"
            style="margin-left: 60px">
          <el-form-item>
            <el-input v-model="loginModel.username" prefix-icon="user"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="loginModel.password" show-password prefix-icon="lock"
                      placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="10">
              <el-col :span="16" :offset="0">
                <el-input v-model="loginModel.code" placeholder="请输入验证码"></el-input>
              </el-col>
              <el-col :span="8" :offset="0">
                <img :src="imageSrc" alt="验证码" >
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item>
            <el-button @click="login" style="width: 65%;" type="primary">登录</el-button>
            <span><a class="toRegister" @click="toRegister">前往注册</a></span>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {reactive, ref,onMounted} from 'vue'
import {type FormInstance} from 'element-plus';
import {getImgApi} from '@/api/user';
//表单ref属性，用于表单验证
const form = ref<FormInstance>()
//表单绑定对象
const loginModel = reactive({
  username: '',
  password: '',
  code: '',
})
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

}

//登录
const login = () => {
  console.log("登录")
}
//注册
const toRegister = () => {
  console.log("前往注册")
}

//验证码src
const imageSrc = ref('')
const getImg=async()=>{
  let res = await getImgApi();
  if(res&&res.code==200){
    imageSrc.value="data:image/png;base64,"+res.data;
    console.log(imageSrc.value);
    
  }
}

onMounted(()=>{
  getImg();
})
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