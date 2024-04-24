<template>
  <el-dropdown>
    <!--头像-->
    <div class="el-dropdown-link">
      <span>
        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">User</el-avatar>
      </span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="updateBtn">修改密码</el-dropdown-item>
        <el-dropdown-item v-if="userStore.getUserId != ''" @click="loginOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- 修改密码 -->
  <SysDialog :title="dialog.title" :visible="dialog.visible" :width="dialog.width" :height="dialog.height"
    @on-close="onClose" @on-confirm="commit">
    <template v-slot:content>
      <el-form :model="upModel" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
        <el-form-item label="原密码" prop="oldPassword">
          <el-input show-password v-model="upModel.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input show-password v-model="upModel.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input show-password v-model="upModel.confirmPassword"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </SysDialog>
</template>

<script setup lang="ts">
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { ElMessage, type FormInstance } from "element-plus";
import { ref, reactive } from "vue";
import { updatePasswordApi } from "@/api/user";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import useInstance from '@/hooks/useInstance';

//获取全局global
const { global } = useInstance()

//为userId获取
const userStore = useUserStore();
//弹框属性
const { dialog, onClose, onShow } = useDialog();
//表单Ref属性
const formRef = ref<FormInstance>()
//路由
const router = useRouter()
//表单验证规则
const rules = reactive({
  oldPassword: [
    {
      required: true,
      message: "请输入原密码",
      trigger: "blur"
    },],
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur"
    },],
  confirmPassword: [
    {
      required: true,
      message: "请输入确认密码",
      trigger: "blur"
    },]
})
//修改密码
const updateBtn = () => {
  dialog.title = "修改密码"
  dialog.width = 550
  dialog.height = 150
  onShow()
}
//表单对象
const upModel = reactive({
  userId: '',
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

//表单提交
function commit() {
  upModel.userId = userStore.getUserId
  formRef.value?.validate(async (valid) => {
    if (valid) {
      //判断新密码和确认密码是否一致
      if (upModel.newPassword != upModel.confirmPassword) {
        ElMessage.warning("新密码和确认密码不一致")
      } else {
        const confirm = await global.$myConfirm('修改密码后将退出登录')
        if (confirm) {
          let res = await updatePasswordApi(upModel)
          if (res && res.code == 200) {
            ElMessage.success(res.msg)
            //清空缓存useStore
            localStorage.clear()
            //不通过路由跳转
            window.location.href = '/login'
          }
        }

      }
    }
  })
}

//前往登录
function toLogin() {
  window.location.href = '/login'
}

//退出登录
async function loginOut() {
  //信息确定
  const confirm = await global.$myConfirm('确定退出登录吗？')
  if (confirm) {
    //清空缓存
    localStorage.clear()
    //不通过路由跳转
    window.location.href = '/login'

  }

}

</script>

<style scoped lang="scss">
.el-dropdown-link:focus {
  outline: none;
  cursor: pointer;
}
</style>