<template>
  <el-main style="padding: 0 20px;">
    <!-- 搜索栏 :model绑定页面到数据-->
    <el-form :model="searchParam" label-width="80px" :inline="true" size="default">
      <el-form-item>
        <el-input v-model="searchParam.nickName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchParam.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button icon="Close" type="danger" @click="resetBtn">重置</el-button>
        <el-button v-if="global.$hasPerm(['sys:user:add'])" icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格显示数据 -->
    <el-table :data="tableList" :height="tableHeight" border stripe>
      <el-table-column prop="nickName" label="姓名"></el-table-column>
      <el-table-column prop="sex" label="性别">
        <template #default="scope">
          <el-tag v-if="scope.row.sex == '0'" type="primary" size="default" effect="dark">男</el-tag>
          <el-tag v-if="scope.row.sex == '1'" type="danger" size="default" effect="dark">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="username" label="账户"></el-table-column>
      <el-table-column v-if="global.$hasPerm(['sys:user:edit','sys:user:reset','sys:user:delete'])" align="center" width="320" label="操作">
        <template #default="scope">
          <el-button v-if="global.$hasPerm(['sys:user:edit'])" type="primary" size="default" icon="Edit"
            @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-if="global.$hasPerm(['sys:user:reset'])" type="warning" size="default" icon="Setting"
            @click="resetPasswordBtn(scope.row.userId)">重置密码</el-button>
          <el-button v-if="global.$hasPerm(['sys:user:delete'])" type="danger" size="default" icon="Delete"
            @click="deleteBtn(scope.row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="searchParam.currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="searchParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="searchParam.total"></el-pagination>
    <!-- 新增编辑弹框 -->
    <SysDialog :title="dialog.title" :visible="dialog.visible" :height="dialog.height" :width="dialog.width"
      @on-close="onClose" @on-confirm="commit">
      <template v-slot:content>
        <el-form :model="addModel" ref="addRef" :rules="rules" size="default" label-width="80px">
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="nickName" label="姓名:">
                <el-input v-model="addModel.nickName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="sex" label="性别:">
                <el-radio-group v-model="addModel.sex">
                  <el-radio value="0">男</el-radio>
                  <el-radio value="1">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="phone" label="手机号:">
                <el-input v-model="addModel.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="email" label="邮箱:">
                <el-input v-model="addModel.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" label="角色:">
                <!--复选框组件,bindValue为查询到的用户已有的角色id-->
                <SelectChecked :bindValue="bindValue" ref="selectRef" :options="options" @selected="selected">
                </SelectChecked>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="username" label="用户名:">
                <el-input v-model="addModel.username"></el-input>
              </el-form-item>
            </el-col>
            <el-row>
            </el-row>
            <el-col v-if="tags == '0'" :span="12" :offset="0">
              <el-form-item prop="password" label="密码:">
                <el-input type="password" v-model="addModel.password"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
    </SysDialog>
  </el-main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
//引入弹窗模型组件
import SysDialog from '@/components/SysDialog.vue';
//配置弹窗信息
import useDialog from '@/hooks/useDialog';
import { ElMessage, type FormInstance } from 'element-plus';
//引入多选框
import SelectChecked from '@/components/SelectChecked.vue'
import { getSelectApi } from '@/api/role'
import { getListApi, addApi, deleteApi, getRoleListApi, editApi, resetPasswordApi } from "@/api/user";
import { type SysUser } from '@/api/user/UserModel'
import useInstance from '@/hooks/useInstance';
//获取全局global
const { global } = useInstance()
//搜索栏绑定对象
const searchParam = reactive({
  phone: '',
  nickName: '',
  currentPage: 1,
  pageSize: 10,
  total: 0,
})
//新增绑定对象
const addModel = reactive({
  userId: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  sex: '',
  nickName: '',
  roleId: '',

})
//角色下拉数据
const options = ref([])
//弹框信息
const { dialog, onClose, onShow } = useDialog()

//新增表单ref属性，用于验证
const addRef = ref<FormInstance>()
//复选框ref
const selectRef = ref()
//表单验证规则
const rules = reactive({
  nickName: [{
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入姓名'
  }],
  sex: [{
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入性别'
  }],
  phone: [{
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入手机号'
  }],
  userName: [{
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入账户'
  }],
  password: [{
    required: true,
    trigger: ['blur', 'change'],
    message: '请输入密码'
  }],
  roleId: [
    {
      required: true,
      trigger: ['blur'],
      message: '请选择角色',
    },
  ],
})

//搜索
const searchBtn = () => {
  getList()
}
//清空
const resetBtn = () => {
  searchParam.phone = ''
  searchParam.nickName = ''
  searchParam.currentPage = 1
  getList();
}
//查询角色下拉数据显示
const getSelect = async () => {
  let res = await getSelectApi();
  if (res && res.code == 200) {
    options.value = res.data;
  }
}
//用户拥有的角色id列表
const bindValue = ref([])
const roleIds = ref('')
//根据用户id查询角色列表
const getRoleList = async (userId: string) => {
  let res = await getRoleListApi(userId)
  if (res && res.code == 200) {
    bindValue.value = res.data
    roleIds.value = res.data.join(',')
  }
}
//区分提交的是新增还是编辑
const tags = ref('')
//新增按钮
const addBtn = () => {
  tags.value = '0'
  dialog.title = "新增"
  dialog.height = 210
  onShow()
  //清空下拉选项数据
  options.value = [];
  bindValue.value = [];
  //重新获取下拉复选框数据列表
  getSelect();
  nextTick(() => {
    //调用复选框组件中的clear下拉清空数据
    selectRef.value.clear()
  })
  //清空表单
  addRef.value?.resetFields()
}

//编辑按钮
const editBtn = async (row: SysUser) => {
  tags.value = '1'
  dialog.title = "编辑"
  dialog.height = 180
  //清空下拉数据
  options.value = []
  //查询到的角色id
  bindValue.value = []
  //获取下拉数据
  await getSelect()
  //查询该用户角色id
  await getRoleList(row.userId)
  //显示弹框
  onShow()
  //数据回显，不能加await
  nextTick(() => {
    Object.assign(addModel, row)
    addModel.roleId = roleIds.value
    addModel.password = ''
  })

  //清除表单验证错误状态，使表单呈现无错误的初始状态
  addRef.value?.resetFields()
}

//删除按钮
const deleteBtn = async (userId: string) => {
  const confirm = await global.$myConfirm('确定删除该数据吗？')
  if (confirm) {
    let res = await deleteApi(userId)
    if (res && res.code == 200) {
      ElMessage.success(res.msg)
    }
    //刷新列表
    await getList()
  }

}

//重置密码
const resetPasswordBtn = async (userId: string) => {
  const confirm = await global.$myConfirm('确定重置密码吗？重置密码为[666666]')
  if (confirm) {
    let res = await resetPasswordApi({ userId: userId })
    if (res && res.code == 200) {
      ElMessage.success(res.msg)
    }
    //刷新列表
    await getList()
  }
}
//勾选的值
const selected = (value: Array<string | number>) => {
  addModel.roleId = value.join(",")
  console.log(addModel.roleId)
}
//提交表单
const commit = () => {
  //验证表单
  addRef.value?.validate(async (valid) => {
    if (valid) {
      let res = null
      if (tags.value == '0') {
        res = await addApi(addModel)
      } else {
        res = await editApi(addModel)
      }
      if (res && res.code == 200) {
        ElMessage.success(res.msg)
        await getList()
        onClose()
      }
    }
  })
}

//表格数据
const tableList = ref([])
//查询表格数据
const getList = async () => {
  let res = await getListApi(searchParam)
  if (res && res.code == 200) {
    tableList.value = res.data.records
    searchParam.total = res.data.total
  }
}
//表格高度
const tableHeight = ref()

//页容量改变时触发
const sizeChange = (size: number) => {
  searchParam.pageSize = size
  getList()
}
//页数改变时触发
const currentChange = (page: number) => {
  searchParam.currentPage = page
  getList()
}

onMounted((() => {
  getList()
  nextTick(() => {
    tableHeight.value = window.innerHeight - 200
  })
}))
</script>

<style scoped lang="scss"></style>