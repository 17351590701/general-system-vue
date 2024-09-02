<template>
  <el-dropdown :hide-on-click="false">
    <el-icon color="#fff" size="20px" style="margin-right: 30px;outline: none">
      <BellFilled/>
    </el-icon>
    <template #dropdown>
      <el-dropdown-menu style="width: 320px;">
        <el-dropdown-item v-if="notifitionList.length == 0">
          <div class="noticeContainer">
            <span style="font-size: 20px;font-family: '楷体',sans-serif">暂无通知</span>
          </div>
        </el-dropdown-item>
        <el-dropdown-item v-else v-for="(item,index) in notifitionList" :key="index">
          <div class="noticeContainer">
            <div class="noticeHeader">
              <component :is="item.notifitionIcon" style="width: 20px"></component>
              <span style="font-size: 18px;font-family: '楷体',sans-serif">{{ item.notifitionTitle }}</span>
              <el-icon size="20px" style="margin-left: 210px;" @click="deleteNotifition(item.notifitionId)">
                <Close/>
              </el-icon>
            </div>
            <div class="noticeContent">
              {{ item.notifitionContent }}
            </div>
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, onUpdated, ref} from 'vue'
import {BellFilled, Close, List} from "@element-plus/icons-vue";
import {deleteNotifitions, getNofititionList} from '@/api/notiftion'
import {type Notifition} from "@/api/notiftion/NotifitionModel";
import {ElMessage} from "element-plus";
import emitter from '@/utils/emitter'

const notifition = ref<Notifition>(
    {
      notifitionId: 0,
      userId: 0,
      notifitionTitle: "",
      notifitionIcon: 0,
      notifitionContent: "",
      create_time: "",
    }
)
// 获取通知列表
const notifitionList = ref<Notifition[]>([])
const getNotifitions = async () => {
  let res = await getNofititionList();
  if (res && res.code == 200) {
    //赋值
    notifitionList.value = res.data
  }
}
// 删除通知
const deleteNotifition = async (notifitionId: number) => {
  let res = await deleteNotifitions(notifitionId);
  if (res && res.code === 200) {
    ElMessage.success("删除成功")
    notifitionList.value = notifitionList.value.filter(item => item.notifitionId !== notifitionId)
  } else {
    ElMessage.error(res.msg);
  }
}
onMounted(() => {
  getNotifitions()
})
// // 导出刷新方法
// const refreshNotifitions = getNotifitions;
// defineExpose({refreshNotifitions})

emitter.on('refreshnNotifitions', () => {
  getNotifitions()
})
onUnmounted(()=>{
  emitter.off('send-toy')
})
</script>

<style scoped lang="scss">
::v-deep(.el-dropdown-menu__item) {
  padding: 3px 7px;
}

.noticeContainer {
  background: #ecf5ff;
  width: 100%;
  height: 60px;

  .noticeHeader {
    width: 100%;
    height: 15px;
    display: flex;
    padding-top: 5px;
    align-items: center;
  }

  .noticeContent {
    padding-top: 10px;
    padding-left: 5px;
    width: 100%;
    height: 45px;
    font-family: 'HarmonyOS Sans SC', sans-serif;
  }
}
</style>