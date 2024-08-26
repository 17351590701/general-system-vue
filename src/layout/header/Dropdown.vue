<template>
  <el-dropdown>
    <!--头像-->
    <div class="el-dropdown-link">
      <span>
        <!-- 如果用户没自定义头像，则默认显示头像 -->
        <el-avatar v-if="userStore.getAvatar == ''"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">User</el-avatar>
        <el-avatar v-else :src="'http://localhost:8888/api/files/' + userStore.getAvatar"></el-avatar>
      </span>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="userDetailsBtn">个人信息</el-dropdown-item>
        <el-dropdown-item @click="updateBtn">修改密码</el-dropdown-item>
        <el-dropdown-item @click="shopCart"><span style="width: 7px;"></span>购物车</el-dropdown-item>
        <el-dropdown-item v-if="userStore.getUserId != ''" @click="logout">退出登录</el-dropdown-item>
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
  <el-dialog v-model="showShopCart" fullscreen="" destroy-on-close="true" close-icon="CircleCloseFilled">
    <ShopCart></ShopCart>
  </el-dialog>
  <!-- 个人信息弹框，用于用户自身修改信息 -->
  <el-dialog v-model="userDetailsDialog" title="个人信息" style="border-radius: 5px;" width="600px" center="true"
    align-center="true">
    <el-form ref="userForm" label-width="80px" :model="userDetails" style="width: 90%;margin-top:20px;padding: 0 30px;">
      <el-form-item label="用户名:">
        <el-input v-model="userDetails.username" placeholder="这是您登录时的账户名"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名:">
        <el-input v-model="userDetails.nickName" placeholder="请输入您的真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="性别:">
        <el-radio-group v-model="userDetails.sex">
          <el-radio value="0">男</el-radio>
          <el-radio value="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="余额:">
        <el-input v-model="userDetails.balance" placeholder="这是您账户余额" disabled="false"></el-input>
      </el-form-item>
      <el-form-item label="手机号:">
        <el-input v-model="userDetails.phone" placeholder="请输入您的手机号"></el-input>
      </el-form-item>
      <el-form-item label="邮箱:">
        <el-input v-model="userDetails.email" placeholder="请输入您的常用邮箱"></el-input>
      </el-form-item>
      <el-form-item label="头像:">
        <div style="border: 1px #dcdfe6 solid;">
          <el-upload class="avatar-uploader" action="http://localhost:8888/api/files/upload" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <!-- 如果用户自定义了，优先显示，否则显示用户临时上传，最后是默认上传'+' -->
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <img v-else-if="userStore.getAvatar" :src="'http://localhost:8888/api/files/' + userStore.getAvatar"
              class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </div>
        <el-button type="info" size="small" plain="true" style="margin-left: 10px;"
          @click="removeAvatar">清除头像</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="danger" @click="cancelSubmitUser">取消</el-button>
        <el-button type="primary" @click="confirmSubmitUser">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import SysDialog from "@/components/SysDialog.vue";
import useDialog from "@/hooks/useDialog";
import { ElMessage, type FormInstance } from "element-plus";
import { ref, reactive } from "vue";
import { updatePasswordApi, logoutApi, getUserById, deleteAvatar, updateCustomUser } from "@/api/user";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user";
import useInstance from '@/hooks/useInstance';
import ShopCart from "@/components/ShopCart.vue";
import type { UploadProps } from 'element-plus'
import useStore from "element-plus/es/components/table/src/store/index.mjs";


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

const showShopCart = ref(false)
const shopCart = () => {
  showShopCart.value = true;
}

//前往登录
function toLogin() {
  window.location.href = '/login'
}

//退出登录
async function logout() {
  //信息确定
  const confirm = await global.$myConfirm('确定退出登录吗？')
  if (confirm) {
    let res = await logoutApi()
    if (res && res.code == 200) {
      //清空缓存
      localStorage.clear()
      //不通过路由跳转
      window.location.href = '/login'

    }

  }

}
const userDetailsDialog = ref(false)
// 显示用户详情弹框
const userDetailsBtn = async () => {
  // 显示用户详情框
  userDetailsDialog.value = true
  // 查询用户信息
  let res = await getUserById(userStore.getUserId);
  if (res && res.code == 200) {
    Object.assign(userDetails, res.data)
  }
}
const userForm = ref<FormInstance>()
//显示用户信息，包括金额，头像，提供上传修改功能,密码修改功能使用额外弹窗
const userDetails = reactive({
  userId: userStore.getUserId,
  username: '',
  nickName: '',
  sex: '',
  balance: '',
  phone: '',
  email: '',
  avatar: '',
})

//取消修改信息
const cancelSubmitUser = async () => {
  // 如果修改过了头像根据头像uuid，删除后端已经上传的头像
  if (userDetails.avatar != userStore.getAvatar) {
    let res = await deleteAvatar(userDetails.avatar);
    if (res.code != 200) {
      ElMessage.error(res.msg)
    }
  }
  //还原原本用户头像
  if (tempAvatar.value != '') {
    userStore.setAvatar(tempAvatar.value)
  }
  // 重置属性，关闭弹框
  userForm.value?.resetFields()
  imageUrl.value = ''
  userDetails.avatar = ''
  userDetailsDialog.value = false
}
//提交修改
const confirmSubmitUser = () => {
  userForm.value?.validate(async (valid) => {
    if (valid) {
      let res = await updateCustomUser(userDetails)
      if (res && res.code == 200) {
        ElMessage.success(res.msg)
        //刷新本地用户信息
        userStore.setNickName(userDetails.nickName)
        userStore.setAvatar(userDetails.avatar)
      } else {
        ElMessage.error(res.msg)
      }
      //关闭弹框，清空临时信息
      imageUrl.value = ''
      tempAvatar.value = ''
      userForm.value?.resetFields()
      console.log(userDetails);
      userDetailsDialog.value = false;
    }
  })
}
//用于临时显示用户上传的头像
const imageUrl = ref('')

/* 图片上传成功后 */
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  //临时显示图片
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  // 保存后端返回的图片uuid
  userDetails.avatar = response.msg
}

/* 头像上传前检查 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('头像格式必须是JPG格式!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('头像大小不能大于 2MB!')
    return false
  }
  return true
}

//保存原始头像，以防客户返回清除头像
const tempAvatar = ref('')
//清空头像
const removeAvatar = () => {
  //临时原来的头像
  tempAvatar.value = userStore.getAvatar;

  //临时，与本地清空
  imageUrl.value = '';
  userDetails.avatar = '';
  userStore.setAvatar('');
  //等待用户手动提交，更新此用户信息表单即可
}
</script>

<style scoped lang="scss">
.el-dropdown-link:focus {
  outline: none;
  cursor: pointer;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  text-align: center;
}

.avatar-uploader {
  height: 150px;
}

.avatar {
  width: 150px;
  height: 150px;
}
</style>