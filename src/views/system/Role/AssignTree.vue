<template>
  <SysDialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @on-close="onClose"
      @on-confirm="commit"
  >
    <template v-slot:content>
      <el-tree
          ref="treeRef"
          :data="assignTreeData.list"
          :props="defaultProps"
          node-key="menuId"
          show-checkbox
          default-expand-all
          :default-checked-keys="assignTreeData.assignTreeChecked"
      >
      </el-tree>
    </template>
  </SysDialog>
</template>

<script setup lang="ts">
import {getAssignTreeApi} from '@/api/user'
import {saveRoleMenuApi} from '@/api/role'
import {reactive, ref} from "vue";
import SysDialog from "@/components/SysDialog.vue";
import useDialog from '@/hooks/useDialog'
import {useUserStore} from "@/stores/user";
import {ElMessage, ElTree} from "element-plus";

const {dialog, onShow, onClose} = useDialog();
const userStore = useUserStore();

const treeRef = ref<InstanceType<typeof ElTree>>()
//树的属性配置
const defaultProps = {
  label: 'title',
  children: 'children',
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
//选中的菜单回显，思想为检查树的叶子结点，而非树枝结点
const checked = (id: number, data: any, newArr: any) => {
  data.forEach((item: any) => {
    if(item.menuId==id){
      if(item.children&&item.children.length==0){
        newArr.push(item.menuId)
      }
    } else{
      if(item.children&&item.children.lenght!=0){
        checked(id,item.children,newArr)
      }
    }
  })
}



//查询获取菜单树
const getAssignTree = async () => {
  let res = await getAssignTreeApi(params)

  if (res && res.code == 200) {
    assignTreeData.list = res.data.menuList
    assignTreeData.assignTreeChecked = res.data.checkList
    console.log(assignTreeData.assignTreeChecked)
    console.log(assignTreeData.list)
    //数据回显，判断角色原来是否已经分配过权限，如果有，回显
    if (assignTreeData.assignTreeChecked.length > 0) {
      let newArr: any = [];
      //遍历已分配的菜单
      assignTreeData.assignTreeChecked.forEach(item =>
          checked(item, assignTreeData.list, newArr)
      );
      assignTreeData.assignTreeChecked = newArr;
    }
  }
}

//提交数据
const commitParam = reactive({
  roleId: '',
  list: [] as string[]
})

//弹框显示
const show = async (roleId: string, name: string) => {
  commitParam.roleId = roleId
  //清空数据
  assignTreeData.assignTreeChecked = []
  assignTreeData.list = []
  commitParam.list = []

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

//提交表单
const commit = async () => {
  //获取选择的菜单数据
  const checkIds = treeRef.value?.getCheckedKeys() as string[];
  const halfCheckIds = treeRef.value?.getHalfCheckedKeys() as string[];
  let ids = checkIds?.concat(halfCheckIds);
  //设置选中的节点
  commitParam.list = ids
  //判断是否已经选择菜单
  if (ids.length == 0) {
    ElMessage.warning("请选择菜单")
  } else {
    let res = await saveRoleMenuApi(commitParam)
    if (res && res.code == 200) {
      ElMessage.success(res.msg)
      onClose();
    }
  }
}
</script>

<style scoped lang="scss">

</style>