<template>
  <SysDialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @on-close="onClose"
      @on-confirm="onConfirm"
  >
    <template v-slot:content>
      <el-tree :data="assignTreeData.list" :props="defaultProps"></el-tree>
    </template>
  </SysDialog>
</template>

<script setup lang="ts">
import {getAssignTreeApi} from '@/api/user'
import {reactive} from "vue";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from '@/hooks/useDialog'
import {useUserStore} from "@/stores/user";

const {dialog, onShow, onClose, onConfirm} = useDialog();
const userStore = useUserStore();
//树的属性配置
const defaultProps = {
  children: 'children',
  label: 'title'
}
//树数据
const assignTreeData = reactive({
  list: [],
  assignTreeChecked: []
})
//树数据查询的参数
const params = reactive({
  userId: '',
  roleId: ''
})
//查询菜单树
const getAssignTree = async () => {
  let res = await getAssignTreeApi(params)
  if (res && res.code == 200) {
    console.log(res.data)
    assignTreeData.list = res.data.list
    assignTreeData.assignTreeChecked = res.data.assignTreeChecked
  }
}
//弹框显示
const show = async (roleId: string, name: string) => {
  params.roleId = roleId
  params.userId = userStore.getUserId
  //设置弹框属性
  dialog.title = "为[" + name + "]分配菜单"
  dialog.width = 450
  dialog.height = 300
  //获取树的数据
  await getAssignTree()
  onShow()
}
//暴露出去给外部组件使用
defineExpose({
  show
})
</script>

<style scoped lang="scss">

</style>