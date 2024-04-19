<template>
       <button @click="console.log(menuStore.getMenu)">查看路由菜单</button>
  <div>
    <el-button type="primary" size="default" @click="addBtn()">新增</el-button>
    <!-- 向弹框传递props参数-->
    <SysDialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @on-close="onClose"
      @on-confirm="onConfirm"
      >``
      <!-- 使用插槽定义弹框内容 -->
    <template v-slot:content>
      <div>
        张三
      </div>
    </template>
    </SysDialog>
  </div>
</template>

<script setup lang="ts">
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { useMenuStore } from '@/stores/menu';
//弹框属性
const {dialog,onClose,onConfirm,onShow} =useDialog()
const menuStore = useMenuStore()

const addBtn=()=>{
  dialog.title="新增"
  onShow()
}

</script>

<style scoped lang="scss"></style>