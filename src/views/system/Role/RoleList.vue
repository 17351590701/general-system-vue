<template>
  <el-main style="padding:0;padding-left: 20px;">
    <!--搜索栏 :inline=true 表单内联排列 -->
    <el-form :model="serarchParm" label-width="80px" :inline="true" size="default">
      <el-form-item label="">
        <el-input v-model="serarchParm.roleName" palceholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
      <el-button icon="Search" @click="searchBtn">搜索</el-button>
      <el-button icon="Close" type="danger" @click="resetBtn">重置</el-button>
      <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>

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
        <el-input v-model="addModel.roleName" ></el-input>
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
import { ref,reactive } from 'vue'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog';
import { ElMessage, type FormInstance } from 'element-plus';
import {addApi} from '@/api/role'
//表单Ref属性
const addRef=ref<FormInstance>()
//弹框属性
const {dialog,onClose,onShow} =useDialog()
 
//表单绑定的对象
const serarchParm = reactive({
  currentPage: 1,
  pageSize: 10,
  roleName: ''
})

//新增按钮
const addBtn=()=>{
  dialog.title="新增"
  dialog.height=150
  //显示弹框
  onShow()
}
//新增表单对象
const addModel = reactive({
  roleId:'',
  roleName: '',
  remark: ''
})

//表单验证规则,必须输入roleName
const rules = reactive({
  roleName:[
    {
      required:true,
      message:"请输入角色名称",
      trigger:'change',
    },
  ],
})

//表单提交，异步函数async
const commit=()=>{
  addRef.value?.validate(async (valid)=>{
    if(valid){
    console.log("表单验证通过")
    //调用接口addApi进行添加，await等待请求执行后，才接着执行代码
    let res =await addApi(addModel)
    if(res&&res.code==200){
      ElMessage.success(res.msg)
      //关闭弹窗
      onClose()
    }
  }
  })
}
//搜索
const searchBtn=()=>{
  
}
//重置
const resetBtn=()=>{
  
}
</script>

<style scoped lang="scss"></style>