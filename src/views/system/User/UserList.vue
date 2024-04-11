<template>
  <el-main style="padding: 0 20px;">
    <!-- 搜索栏 :model绑定页面到数据-->
    <el-form :model="searchParam" label-width="80px" :inline="true" size="default">
      <el-form-item>
        <el-input v-model="searchParam.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchParam.nickName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button icon="Close" type="danger" @click="resetBtn">重置</el-button>
        <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增编辑弹框 -->
    <SysDialog 
    :title="dialog.title" 
    :visible="dialog.visible" 
    :height="dialog.height" 
    :width="dialog.width"
    @on-close="onClose" 
    @on-confirm="commit"
    >
      <template v-slot:content>
        <el-form 
        :model="addModel" 
        ref="addRef" 
        :rules="rules" 
        size="default" 
        label-width="80px"
        >
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-form-item prop="userName" label="账户:">
                <el-input v-model="addModel.userName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="password" label="密码:">
                <el-input v-model="addModel.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="nickName" label="姓名:">
                <el-input v-model="addModel.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="手机号:">
                <el-input v-model="addModel.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" label="角色:">
                <!--复选框组件-->
                <SelectChecked ref="selectRef" :options="options" @selected="selected"></SelectChecked>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="sex" label="性别:">
                <el-radio-group v-model="addModel.sex">
                  <el-radio :value="0">男</el-radio>
                  <el-radio :value="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="email" label="邮箱:">
                <el-input v-model="addModel.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </SysDialog>
  </el-main>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, nextTick} from 'vue'
//引入弹窗模型组件
import SysDialog from '@/components/SysDialog.vue';
//配置弹窗信息
import useDialog from '@/hooks/useDialog';
import { ElMessage, type FormInstance } from 'element-plus';
//引入多选框
import SelectChecked from '@/components/SelectChecked.vue'
import {getSelectApi}from '@/api/role'
import { addApi } from '@/api/user';

//搜索栏绑定对象
const searchParam = reactive({
  phone: '',
  nickName: '',
  currentPage: 1,
  pageSize: 10
})
//角色下拉数据
const options = ref([])
//弹框信息
const { dialog, onClose, onShow } = useDialog()

//新增表单ref属性，用于验证
const addRef = ref<FormInstance>()
//复选框ref
const selectRef=ref()
//表单验证规则
const rules = reactive({
  nickName:[{ 
    required:true,
    trigger:['blur','change'],
    message:'请输入姓名'
  }],
  sex:[{ 
    required:true,
    trigger:['blur','change'],
    message:'请输入性别'
  }],
  phone:[{ 
    required:true,
    trigger:['blur','change'],
    message:'请输入手机号'
  }],
  userName:[{ 
    required:true,
    trigger:['blur','change'],
    message:'请输入账户'
  }],
  password:[{ 
    required:true,
    trigger:['blur','change'],
    message:'请输入密码'
  }],
  roleId:[{
    required:true,
    trigger:['blur','change'],
    message:'请选择角色',
  }],
})

//搜索
const searchBtn = () => {

}
//清空
const resetBtn = () => {
  searchParam.phone = ''
  searchParam.nickName = ''
}
//新增绑定对象
const addModel = reactive({
  userId: '',
  userName: '',
  password: '',
  phone: '',
  email: '',
  sex: '',
  nickName: '',
  roleId:'',

})
//查询角色下拉数据显示
const getSelect = async()=>{
  let res = await getSelectApi();
  if(res&&res.code==200){
    options.value = res.data;
  }
}
//新增
const addBtn = () => {
  //清空下拉选项数据
  options.value=[];
  //重新获取下拉数据列表
  getSelect();
  dialog.title = "新增"
  dialog.height=210
  onShow()
  nextTick(()=>{
    //调用复选框组件中的clear下拉清空数据
    selectRef.value.clear()
  })
  //清空表单
  addRef.value?.resetFields()
}
//勾选的值
const selected = (value:Array<string|number>)=>{
  addModel.roleId=value.join(",")
}
//提交表单
const commit=()=>{
  //验证表单
  addRef.value?.validate(async(valid)=>{
    if(valid){
      console.log('验证通过');
      let res = await addApi(addModel)
      if(res&&res.code==200){
        ElMessage.success(res.msg)
        onClose()
      }
    }
  })
}


onMounted((()=>{
  // getSelect()
}))
</script>

<style scoped lang="scss"></style>