<template>
  <el-main style="padding:0;padding-left: 20px;">
    <!--搜索栏 :inline=true 表单内联排列 -->
    <el-form :model="searchParam" label-width="80px" :inline="true" size="default">
      <el-form-item>
        <el-input v-model="searchParam.roleName" palceholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button icon="Close" type="danger" @click="resetBtn">重置</el-button>
        <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格数据 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="roleName" label= "角色名称"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <!-- 插槽,接受本行数据 -->
        <template #default="scope" >
          <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row.roleId)">编辑</el-button>
        <el-button type="danger" icon="Delete" size="default" @click="deleteBtn(scope.row.roleId)">删除</el-button>
        </template>
        </el-table-column>
      </el-table>
    
    <!-- 分页-->
    <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="searchParam.currentPage"
        :page-sizes="[10,20,30,40]"
        :page-size="searchParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchParam.total"
    ></el-pagination>

    <!-- 新增、编辑弹框 -->
    <SysDialog
        :title="dialog.title"
        :visible="dialog.visible"
        :width="dialog.width"
        :height="dialog.height"
        @on-close="onClose"
        @on-confirm="commit"
    >
      <!-- 插槽，向封装的弹框中添加内容,并添加表单规则 -->
      <template v-slot:content>
        <el-form
            :model="addModel"
            ref="addRef"
            :rules="rules"
            label-width="80px"
            :inline="false"
            size="default">
          <!-- 准备表单验证 -->
          <el-form-item prop="roleName" label="角色名称">
            <el-input v-model="addModel.roleName"></el-input>
          </el-form-item>
          <el-form-item prop="remark" label="备注">
            <el-input v-model="addModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
  </el-main>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, nextTick} from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import {ElMessage, type FormInstance} from 'element-plus';
import {addApi, getListApi} from '@/api/role'
import type {RoleListParam} from "@/api/role/RoleModel";
import {type SysRole} from '@/api/role/RoleModel';
//表单Ref属性
const addRef = ref<FormInstance>()
//弹框属性
const {dialog, onClose, onShow} = useDialog()

//表单绑定的对象
const searchParam:RoleListParam= reactive({
  currentPage: 1,
  pageSize: 10,
  roleName: '',
  total: 0
})

//新增按钮
const addBtn = () => {
  dialog.title = "新增"
  dialog.height = 150
  //显示弹框
  onShow()
}
//新增表单对象
const addModel = reactive({
  roleId: '',
  roleName: '',
  remark: ''
})

//表单验证规则,必须输入roleName
const rules = reactive({
  roleName: [
    {
      required: true,
      message: "请输入角色名称",
      trigger: 'change',
    },
  ],
})

//表格编辑按钮
const editBtn=(row:SysRole)=>{
console.log("编辑")
}

//表格删除按钮
const deleteBtn=(roleId:string)=>{
  console.log("删除")
}

//页容量改变时触发
const sizeChange=(size:number)=>{
  searchParam.pageSize=size
  getList()
}
//页数改变时触发
const currentChange=(page:number)=>{
  searchParam.currentPage=page
  getList()
}
//表单提交，验证通过进行异步函数async
const commit = () => {
  addRef.value?.validate(async (valid) => {
    if (valid) {
      console.log("表单验证通过")
      //调用接口addApi进行添加，await等待请求执行后，才接着执行代码
      let res = await addApi(addModel)
      if (res && res.code == 200) {
        ElMessage.success(res.msg)
        //关闭弹窗
        onClose()
      }
    }
  })
}
//表格高度
const tableHeight = ref(0)
const tableList = ref([])
//查询列表
const getList = async () => {
  let res = await getListApi(<RoleListParam>searchParam)
  if (res && res.code == 200) {
    console.log(res)
    // 设置表格数据
    tableList.value = res.data.records
    // 设置分页总条数
    searchParam.total = res.data.total
  }
}
onMounted(() => {
  //计算表格高度
  nextTick(() => {
    tableHeight.value = window.innerHeight - 220
  })
  
  getList()
})

//搜索
const searchBtn = () => {
  getList()
}
//重置
const resetBtn = () => {
  searchParam.roleName = ''
  searchParam.currentPage = 1
  getList()
}
</script>

<style scoped lang="scss"></style>