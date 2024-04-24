<template>
  <el-main style="padding:0 20px">
    <!-- 搜索框 -->
    <el-form :model="searchParam" label-width="80px" size="default" :inline="true">
      <el-form-item>
        <el-input v-model="searchParam.categoryName" placeholder="请输入商品类型"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchParam.remark" placeholder="请输入类型描述" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button v-if="global.$hasPerm(['sys:category:search'])" icon="Search" @click="searchBtn">搜索</el-button>
        <el-button icon="Close" type="danger" @click="resetBtn">清空</el-button>
        <el-button v-if="global.$hasPerm(['sys:category:add'])" icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>

    <!-- 新增、编辑弹框 -->
    <SysDialog :title="dialog.title" :visible="dialog.visible" :width="dialog.width" :height="dialog.height"
      @on-close="onClose" @on-confirm="commit">
      <!-- 插槽，向封装的弹框中添加内容,并添加表单规则 -->
      <template v-slot:content>
        <el-form :model="addModel" ref="addRef" :rules="rules" label-width="80px" :inline="false" size="default">
          <!-- 准备表单验证 -->
          <el-form-item prop="categoryName" label="商品名称">
            <el-input v-model="addModel.categoryName"></el-input>
            <!-- <input type="text" v-model="addModel.categoryName"></input> -->
          </el-form-item>
          <el-form-item prop="remark" label="类型描述">
            <el-input v-model="addModel.remark"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>

    <!--表格列表 -->
    <el-table :data="tableList" border stripe :height="tableHeight">
      <el-table-column prop="categoryName" label="商品类型"></el-table-column>
      <el-table-column prop="remark" label="类型描述"></el-table-column>
      <el-table-column v-if="global.$hasPerm(['sys:category:edit','sys:category:delete'])" label="操作">
        <template #default="scope">
          <el-button v-if="global.$hasPerm(['sys:category:edit'])" size="default" type="primary" icon="Edit" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-if="global.$hasPerm(['sys:category:delete'])" size="default" type="danger" icon="Delete" @click="deleteBtn(scope.row.categoryId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页-->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="searchParam.currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="searchParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="searchParam.total">
    </el-pagination>
  </el-main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue';
import { type CategoryListParam, type SysCategory } from '@/api/category/CategoryModel'
import { getListApi, addApi, editApi, deleteApi } from '@/api/category'
import SysDialog from '@/components/SysDialog.vue';
import useDialog from '@/hooks/useDialog'
import useInstance from '@/hooks/useInstance';
import { ElMessage, type FormInstance } from 'element-plus';

const { global } = useInstance()
const { dialog, onClose, onShow, onConfirm } = useDialog()
const searchParam: CategoryListParam = reactive({
  categoryName: '',
  remark: '',
  currentPage: 1,
  pageSize: 10,
  total: 0
})
//新增模型
const addModel = reactive({
  categoryId: '',
  categoryName: '',
  remark: '',
})
// 弹窗表单ref
const addRef = ref<FormInstance>()

const rules = reactive({
  categoryName: [{
    required: true,
    trigger: ['blur','change'],
    message: '请输入商品类型名',
  }],
  remark: [{
    required: true,
    trigger: ['blur','change'],
    message: '请输入商品类型描述',
  }],
})

//查询
function searchBtn() {
  getList();
}
//重置
function resetBtn() {
  searchParam.categoryName = ''
  searchParam.remark = ''
  searchParam.currentPage = 1
  getList()
}
//区分commit是新增还是编辑
const tags = ref('')
//新增
function addBtn() {
  tags.value = "0"
  dialog.title = '新增'
  dialog.height = 150
  addRef.value?.resetFields()
  onShow()

}

//编辑
function editBtn(row: SysCategory) {
  tags.value = "1"
  dialog.title = '编辑'
  dialog.height = 150
  //数据回显
  nextTick(() => {
    addModel.categoryId = row.categoryId
    addModel.categoryName = row.categoryName
    addModel.remark = row.remark
  })
  addRef.value?.resetFields();
  onShow();
}
//删除
async function deleteBtn(categoryId: string) {
  const confirm = await global.$myConfirm('确定删除该商品类型吗?')
  if (confirm) {
    let res = await deleteApi(categoryId)
    if (res && res.code == 200) {
      ElMessage.success('删除成功')
    }
    //刷新列表
    await getList()
  }

}


function commit() {
  //表单验证
  addRef.value?.validate(async valid => {
    if (valid) {
      let res = null;
      //新增
      if (tags.value == '0') {
        res = await addApi(addModel)
      } else { //编辑
        res = await editApi(addModel)
      }
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
const tableList = ref([])
//获取列表
async function getList() {
  let res = await getListApi(<CategoryListParam>searchParam)
  if (res && res.code == 200) {
    tableList.value = res.data.records
    searchParam.total = res.data.total
  }
}

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

const tableHeight = ref(0)
onMounted(() => {
  getList()
  nextTick(() => {
    tableHeight.value = window.innerHeight - 200
  })
})

</script>

<style scoped lang="scss"></style>