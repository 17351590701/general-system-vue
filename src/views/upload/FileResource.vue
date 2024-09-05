<template>
  <div class="fileResource">
    <el-card class="box-card">
      <template #header>
        <el-table :data="fileTableList">
          <el-table-column prop="fileName" label="文件名称"></el-table-column>
          <el-table-column prop="fileUrl" label="文件预览">
            <template #default="scope">
              <el-image :src="'http://localhost:8888/api/files/'+scope.row.fileUrl"
                        :preview-src-list="['http://localhost:8888/api/files/' +scope.row.fileUrl]"
                        :preview-teleported="true"
                        style="width: 100px;height: 100px"></el-image>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted} from "vue";
import request from '@/http'

// 后端返回文件列表
const fileTableList = ref([])

onMounted(async () => {
  let res = await request.get('/api/files/getFileList');
  if (res && res.code === 200) {
    console.log(res.data)
    fileTableList.value = res.data;
  }
})
</script>

<style scoped lang="scss">
.fileResource{
  box-sizing: border-box;
  margin:0 15px;
}
</style>