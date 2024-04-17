<template>
  <el-main style="padding: 0 20px;">
    <!--搜索栏 :inline=true 表单内联排列 -->
    <el-form :model="searchParam" label-width="80px" :inline="true" size="default" >
      <el-form-item style="height: 50px" >
        <el-input v-model="searchParam.roleName" palceholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button icon="Close" type="danger" @click="resetBtn">清空</el-button>
        <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 表格数据 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="roleName" label= "角色名称"></el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <!-- 插槽,接受本行数据 -->
        <template #default="scope" >
          <el-button type="primary" icon="Edit" size="default" @click="editBtn(scope.row)">编辑</el-button>
          <el-button type="success" icon="Edit" size="default" @click="assignBtn(scope.row)">分配菜单</el-button>
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

    <!--分配菜单-->
  <AssignTree ref="assignTree"></AssignTree>
  </el-main>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, nextTick} from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import {ElMessage, type FormInstance} from 'element-plus';
import {addApi, getListApi,editApi,deleteApi} from '@/api/role'
import type {RoleListParam} from "@/api/role/RoleModel";
import {type SysRole} from '@/api/role/RoleModel';
import useInstance from '@/hooks/useInstance';
import AssignTree from "@/views/system/Role/AssignTree.vue";
//获取全局global
const {global} = useInstance()
//表单Ref属性
const addRef = ref<FormInstance>()
//菜单树的Ref属性
const assignTree=ref()
//弹框属性
const {dialog, onClose, onShow} = useDialog()
//新增表单对象
const addModel = reactive({
  roleId: '',
  roleName: '',
  remark: ''
})
//表单绑定的对象，如果传到后端parm中的角色名不为空，则将角色名作为查询条件，使用like操作符进行模糊查询
const searchParam:RoleListParam= reactive({
  currentPage: 1,
  pageSize: 10,
  roleName: '',
  total: 0
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

//查询列表
const getList = async() => {
  let res = await getListApi(<RoleListParam>searchParam)
  if (res && res.code == 200) {
    // 设置表格数据
    tableList.value = res.data.records
    // 设置分页总条数
    searchParam.total = res.data.total
  }
}

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

//判断新增还是编辑的提交 0新增，1编辑
const tags = ref('')

//新增按钮
const addBtn = () => {
  tags.value = '0'
  dialog.title = "新增"
  dialog.height = 150
  //清空编辑时留下的表单数据
  addRef.value?.resetFields()
  //显示弹框
   onShow()
}

//表格编辑按钮
const editBtn=(row:SysRole)=>{
  tags.value = '1'
  dialog.title="编辑"
  dialog.height=180
  //数据回显
  nextTick(()=>{
    addModel.roleId = row.roleId
    addModel.roleName = row.roleName
    addModel.remark = row.remark
  })
  //清除表单验证错误状态，使表单呈现无错误的初始状态
  addRef.value?.resetFields()
  //显示弹框
  onShow()
}

//表格删除按钮
const deleteBtn = async(roleId:string)=>{
  const confirm = await global.$myConfirm('确定删除该数据吗？')
  if(confirm){
    let res = await deleteApi(roleId)
    if(res&&res.code==200){
      ElMessage.success(res.msg)
    }
    //刷新列表
    await getList()
  }
  
}

//表单提交，验证通过进行异步函数async,0为新增提交，1为编辑提交
const commit = () => {
  addRef.value?.validate(async (valid) => {
    if (valid) {
      let res = null
      //调用接口addApi进行添加，await等待请求执行后，才接着执行代码
      if (tags.value == '0'){
         res = await addApi(addModel)
      }
      else{
         res = await editApi(addModel)
      }
      //判断返回值
      if (res && res.code == 200) {
        ElMessage.success(res.msg);
        //关闭弹窗
        onClose()
        //刷新列表
        await getList()

      }
    }
  })
}

//分配菜单按钮
const assignBtn=(row:SysRole)=>{
  assignTree.value.show(row.roleId,row.roleName)
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


//表格高度
const tableHeight = ref(0)
const tableList = ref([])

onMounted(() => {
  //计算表格高度
  nextTick(() => {
    tableHeight.value = window.innerHeight - 200
  })
  getList()
})

</script>

<style scoped lang="scss"></style>