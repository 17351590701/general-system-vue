<template>
  <!-- 新增按钮 -->
  <el-main style="padding: 0 20px;">
    <el-button type="primary" icon="Plus" size="default" @click="addBtn">新增</el-button>
    <!-- 竖形表格 -->
    <el-table style="margin-top: 20px;" :data="tableList" row-key="menuId" default-expand-all border stripe>
      <el-table-column label="菜单名称" prop="title" width="180px"></el-table-column>
      <el-table-column label="菜单图标" prop="icon" width="100px" align="center">
        <template #default="scope">
          <el-icon v-if="scope.row.icon">
            <component :is="scope.row.icon"></component>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" width="100px" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type === '0'" type="danger" size="default">目录</el-tag>
          <el-tag v-if="scope.row.type === '1'" type="success" size="default">菜单</el-tag>
          <el-tag v-if="scope.row.type === '2'" type="primary" size="default">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="上级菜单" prop="parentId" width="100px" align="center"></el-table-column>
      <el-table-column label="路由名称" prop="name" align="center"></el-table-column>
      <el-table-column label="路由地址" prop="path" align="center"></el-table-column>
      <el-table-column label="组件路径" prop="url" width="270px" align="center"></el-table-column>
      <el-table-column label="序号" prop="orderNum" align="center"></el-table-column>
      <el-table-column label="操作" prop="" align="center" width="220">
        <template #default="scope">
          <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
          <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row.menuId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增弹框 -->
    <SysDialog :title="dialog.title" :visible="dialog.visible" :width="dialog.width" :height="dialog.height"
      @on-close="onClose" @on-confirm="commit">
      <template v-slot:content>
        <el-form :model="addModel" ref="addRef" :rules="rules" label-width="80px" :inline="false" size="default">
          <el-form-item label="菜单类型" prop="type">
            <el-radio-group v-model="addModel.type">
              <el-radio :value="0">目录</el-radio>
              <el-radio :value="1">菜单</el-radio>
              <el-radio :value="2">按钮</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="上级菜单" prop="parentId">
                <el-tree-select @check-change="treeClick" v-model="addModel.parentId" :data="treeList"
                  :render-after-expand="false" show-checkbox check-strictly>
                </el-tree-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="菜单名称" prop="title">
                <el-input v-model="addModel.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row v-if="addModel.type != '2'" :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="addModel.icon"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="路由名称" prop="name">
                <el-input v-model="addModel.name"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item label="菜单序号" prop="orderNum">
                <el-input v-model="addModel.orderNum"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="权限字段" prop="code">
                <el-input v-model="addModel.code"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col v-if="addModel.type != '2'" :span="12" :offset="0">
              <el-form-item label="路由地址" prop="path">
                <el-input v-model="addModel.path"></el-input>
              </el-form-item>
            </el-col>
            <el-col v-if="addModel.type == '1'" :span="12" :offset="0">
              <el-form-item label="组件路径" prop="url">
                <el-input v-model="addModel.url"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </SysDialog>
  </el-main>
</template>

<script setup lang="ts">
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog'
import { getParentMenuApi, addMenuApi, getListApi, editApi, deleteApi } from '@/api/menu'
import { ElMessage, type FormInstance } from 'element-plus';
import { onMounted, reactive, ref, nextTick } from 'vue';
import { type SysMenu } from '@/api/menu/MenuModel';
import useInstance from '@/hooks/useInstance';
//获取全局global
const { global } = useInstance()
//弹框属性
const { dialog, onShow, onClose } = useDialog()
//表单ref属性
const addRef = ref<FormInstance>()
//添加菜单属性
const addModel = reactive({
  menuId: '',
  parentId: '',
  title: '',
  code: '',
  name: '',
  path: '',
  url: '',
  type: '',
  icon: '',
  parentName: '',
  orderNum: '',

})
//存储获取上级菜单数据
const treeList = ref([])
const getParent = async () => {
  let res = await getParentMenuApi()
  if (res.code == 200) {
    treeList.value = res.data
  }
}
//上级菜单选中事件
const treeClick = (item: any) => {
  addModel.parentName = item.title
}
//表单验证规则
const rules = reactive({
  parentId: [{
    required: true,
    message: '请选择上级菜单',
    trigger: ['blur', 'change']
  }],
  title: [{
    required: true,
    message: '请输入菜单名称',
    trigger: ['blur', 'change']
  }],
  code: [{
    required: true,
    message: '请输入权限字段',
    trigger: ['blur', 'change']
  }],
  name: [{
    required: true,
    message: '请输入路由名称',
    trigger: ['blur', 'change']
  }],
  path: [{
    required: true,
    message: '请输入路由地址',
    trigger: ['blur', 'change']
  }],
  url: [{
    required: true,
    message: '请输入组件路径',
    trigger: ['blur', 'change']
  }],
  type: [{
    required: true,
    message: '请选择菜单类型',
    trigger: ['blur', 'change']
  }],
  icon: [{
    required: true,
    message: '请输入菜单图标',
    trigger: ['blur', 'change']
  }],
  orderNum: [{
    required: true,
    message: '请输入菜单序号',
    trigger: ['blur', 'change']
  }],

})
//区分新增和编辑
const tags = ref('')
//新增按钮
const addBtn = () => {
  tags.value = '0'
  dialog.title = "新增"
  //获取上级菜单
  getParent()
  //显示弹框
  onShow();
  //清空表单
  addRef.value?.resetFields();

}
//编辑按钮
const editBtn = async (row: SysMenu) => {
  tags.value = '1'
  dialog.title = "编辑"
  //获取上级菜单
  await getParent();
  //显示弹框
  onShow();
  //数据回写
  nextTick(() => {
    //将row的值复制到addModel中
    Object.assign(addModel, row)
  })
  //清空表单
  addRef.value?.resetFields()

}
//删除按钮
const deleteBtn = async (menuId: string) => {
  const confirm = await global.$myConfirm('确定删除该数据吗')
  if (confirm) {
    let res = await deleteApi(menuId)
    if (res && res.code == 200) {
      ElMessage.success(res.msg)
      //刷新列表
      getList();
      onClose();
    }
  }
}
//表单提交
const commit = () => {
  addRef.value?.validate(async (valid) => {
    if (valid) {
      console.log("验证通过")
      let res = null;
      if (tags.value == '0') {
        console.log("进入新增")
        res = await addMenuApi(addModel)
      } else {
        console.log("进入编辑")
        res = await editApi(addModel)
      }
      if (res && res.code == 200) {
        ElMessage.success(res.msg)
        addRef.value?.resetFields()
        //刷新列表
        getList();
        onClose();
      }
    }
  })
}
//获取表格数据
const tableList = ref([])
const getList = async () => {
  let res = await getListApi()
  if (res && res.code == 200) {
    tableList.value = res.data
  }
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss"></style>