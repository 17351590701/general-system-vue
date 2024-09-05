<template>
  <div>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>文件上传</span>
        </div>
      </template>
      <el-form :model="form" label-width="120px">
        <el-form-item label="文件名称">
          <el-input v-model="form.name" placeholder="请输入文件名称(不填写将默认生成)" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="文件上传">
          <el-upload
              v-model:file-list="fileList"
              class="upload-container"
              :auto-upload="false"
              :limit="3"
              :on-exceed="handleExceed"
              :before-upload="handleBeforeUpload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture-card"
              multiple
              :on-change="handleChange"
          >
            <el-icon class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img style="width: 100%;height: 100%" :src="dialogImageUrl" alt="Preview Image"/>
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {ElMessage, ElNotification, type UploadProps} from "element-plus";
import request from '@/http'
import {useRouter} from "vue-router";
import {Plus} from "@element-plus/icons-vue";
const router = useRouter()

// 文件模版-文件名，缓存文件内容
interface Form {
  name: string,
  file: any
}

const form = reactive<Form>({
  name: '',
  file: ''
})
// 列表数据
const fileList = ref([])
// 文件上传数量提示
const handleExceed = () => {
  ElMessage.warning('最多只能上传3个文件')
}
// 上传文件前处理
const handleBeforeUpload = (file: any) => {
  // 验证文件类型、大小
  // let isJPG = file.type === 'image/jpeg';
  // let isLT2M = file.size / 1024 / 1024 < 2;
  // if (!isJPG) {
  //   ElMessage.error('上传文件只能是 JPG 格式!');
  //   return false;
  // }
  // if (!isLT2M) {
  //   ElMessage.error('上传文件大小不能超过 2MB!');
  //   return false;
  // }
  // return isJPG && isLT2M;
}

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 点击文件列表时处理
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
// 文件列表删除时处理
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}

//当文件列表改变时
const handleChange = (file: any, fileList: any) => {
  form.file = fileList
}


// 上传文件提交
const onSubmit = async () => {
  let formdata = new FormData();
  formdata.append('name', form.name)
  for (let i = 0; i < form.file.length; i++) {
    formdata.append('file', form.file[i].raw)
  }
  let res = await request.upload('/api/files/upload', formdata)
  if (res && res.code == 200) {
    console.log(res.msg)
    ElNotification({
      type: 'success',
      title: '文件上传',
      message: '上传成功',
      duration: 1500,
    })
    //   跳转资源列表页面
    await router.push('/fileResource')
  }
}
</script>

<style scoped lang="scss">
.box-card {
  margin: 0 15px;
  box-sizing: border-box;

  .upload-container {
    height: auto;
    width: 100%;
  }
}

</style>