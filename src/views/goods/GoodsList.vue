<template>
  <el-main style="padding:0 20px">
    <!-- 搜索框 -->
    <el-form :model="searchParam" label-width="80px" :inline="true" size="default">
      <el-form-item>
        <el-input v-model="searchParam.goodName" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchParam.description" placeholder="请输入商品描述" width="300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button icon="Search" @click="searchBtn">搜索</el-button>
        <el-button icon="Filter" @click="filterShow">筛选</el-button>
        <el-button icon="Close" type="danger" @click="resetBtn">重置</el-button>
        <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 新增编辑弹窗 -->
    <SysDialog :title="dialog.title" :visible="dialog.visible" :width="dialog.width" :height="dialog.height"
               @on-close="onClose" @on-confirm="commit">
      <template v-slot:content>
        <el-form :model="addModel"
                 ref="addRef"
                 :rules="rules"
                 label-width="100px"
                 :inline="false"
                 size="default"
                 style="height:290px;overflow:auto;">
          <el-form-item label="商品图片">
            <el-upload
                action="http://localhost:8080/api/files/upload"
                :on-success="uploadImg"
            >
              <el-tooltip content="PNG,JPEG 文件小于 500KB" placement="right">
                <el-button type="primary">点击上传/替换</el-button>
              </el-tooltip>
            </el-upload>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodName" style="width:300px">
            <el-input v-model="addModel.goodName"></el-input>
          </el-form-item>
          <el-form-item label="商品类别">
            <!--复选框-->
            <SelectChecked :bindValue="bindValue" ref="selectRef" :options="options" @selected="selected" style="width:200px"></SelectChecked>
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input v-model="addModel.description" width="200px" type="textarea"
                      placeholder="请输入商品相关描述"/>
          </el-form-item>
          <el-form-item label="商品价格" prop="price" style="width:300px">
            <el-input v-model="addModel.price" placeholder="单位:元"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
    <!-- table表格 -->
    <el-table :data="tableList" border stripe :heigth="tableHeight">
      <el-table-column label="商品图片" width="150">
        <template #default="scope">
          <el-image
              style="width: 50px; height: 70px"
              :src="'http://localhost:8080/api/files/'+scope.row.pictureKey"
              :preview-src-list="['http://localhost:8080/api/files/'+scope.row.pictureKey]"
              :preview-teleported="true"
          >
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="description" label="商品描述"></el-table-column>
      <el-table-column prop="price" label="价格/(元)"></el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button type="primary" size="default" @click="editBtn(scope.row)">编辑</el-button>
          <el-button type="danger" size="default" @click="deleteBtn(scope.row.goodId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="searchParam.currentPage"
                   :page-sizes="[10, 20, 30, 40]" :page-size="searchParam.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="searchParam.total">
    </el-pagination>
    <!-- 筛选弹窗 -->
    <SysDialog
    :title="filterTitle"
    :visible="filterVisible"
    :width="500" 
    :height="150"
    @on-close="filterClose" 
    @on-show="filterShow"
    @on-confirm="filterConfirm"
    >
    <template v-slot:content>
      <el-form :model="filterModel" label-width="80px" :inline="false" size="default">
       <el-form-item label="商品类别">
         <el-select
         v-model="filterValueOptions"
         multiple
         placeholder="请选择商品类别" 
         style="width:300px"
         @change="filterChange"
         >
         <el-option
         v-for="item in filterOptions"
         :key="item.value"
         :label="item.label"
         :value="item.value"
         >
         </el-option>
         </el-select>
       </el-form-item>
      <el-form-item label="价格区间">
        <el-input v-model="filterModel.priceMin" style="width:100px" placeholder="最小xx元"></el-input>
        <span>&nbsp&nbsp至&nbsp&nbsp</span>
        <el-input v-model="filterModel.priceMax" style="width:100px" placeholder="最多xx元"></el-input>
      </el-form-item>
      </el-form> 
    </template>
  </SysDialog>
  </el-main>
</template>

<script setup lang="ts">
import {ref, reactive, onMounted, nextTick,computed,watch,watchEffect} from 'vue';
import SysDialog from '@/components/SysDialog.vue'
import useDialog from '@/hooks/useDialog'
import {getListApi, addGoodApi, deleteGoodApi, editGoodApi,getCategoryListApi,getGoodConditionApi} from '@/api/good'
import {getSelectApi} from '@/api/category'
import {type FormInstance, ElMessage} from 'element-plus';
import type {GoodModel} from '@/api/good/GoodModel';
import useInstance from '@/hooks/useInstance';
import SelectChecked from "@/components/SelectChecked.vue";
import {getRoleListApi} from "@/api/user";
import type { List } from 'echarts';


const {global} = useInstance()
const {dialog, onClose, onConfirm, onShow} = useDialog()
const searchParam = reactive({
  goodName: '',
  description: '',
  price: 0,
  currentPage: 1,
  pageSize: 10,
  total: 0
})
//新增，编辑
const addModel = reactive({
  goodId: '',
  goodName: '',
  description: '',
  price: '',
  pictureKey: '',
  createTime: '',
  updateTime: '',
  categoryId:''
})

// 表单ref
const addRef = ref<FormInstance>()
const rules = reactive({
  goodName: [{
    required: true,
    message: '请输入商品名称',
    trigger: ['blur', 'change']
  }],
  price: [{
    required: true,
    message: '请输入价格',
    trigger: ['blur', 'change']
  }]
})

//搜索
const searchBtn = () => {
  getList();
}
//重置
const resetBtn = () => {
  searchParam.goodName = ''
  searchParam.description = ''
  searchParam.price = 0
  getList();
}

const tags = ref('')
//新增
const addBtn = async () => {
  tags.value = '0'
  dialog.title = '新增'
  dialog.height = 300
  addRef.value?.resetFields()
  onShow()
  //清空下拉数据
  options.value=[];
  bindValue.value=[];
  //重新获取下拉数据
  await getSelect()
  //查询该商品对应的分类
  nextTick(()=>{
    selectRef.value.clear()
  })
  //清空表单
  addRef.value?.resetFields()
}

//编辑
const editBtn = async(row: GoodModel) => {
  tags.value = '1'
  dialog.title = '编辑'
  dialog.height = 300
  options.value=[];
  bindValue.value=[];
  await getSelect();
  await getCategoryList(row.goodId)
  onShow()
  nextTick(() => {
    Object.assign(addModel, row)
    addModel.categoryId=categoryIds.value
  })

  addRef.value?.resetFields();
}
//删除
const deleteBtn = async (goodId: string) => {
  const confirm = await global.$myConfirm('确定删除该商品吗？')
  if (confirm) {
    let res = await deleteGoodApi(goodId)
    if (res && res.code) {
      ElMessage.success('删除成功')
    }
    await getList();
  }
}

//提交
const commit = () => {
  addRef.value?.validate(async valid => {
    if (valid) {
      let res = null;
      if (tags.value == '0') {
        res = await addGoodApi(addModel)
      } else {
        res = await editGoodApi(addModel)
      }
      if (res && res.code == 200) {
        ElMessage.success(res.msg)
      }
      onClose();
      await getList();
    }
  })
}
//table列表查询
const tableList = ref([])
async function getList() {
  let res = await getListApi(searchParam)
  if (res && res.code == 200) {
    tableList.value = res.data.records
    searchParam.total = res.data.total
  }
}

//商品已经拥有的分类
const bindValue=ref([])
const selectRef=ref()
//下拉菜单类
const options = ref([])
async function getSelect() {
  let res = await getSelectApi()
  if (res && res.code == 200) {
    options.value=res.data;
  }
}
//存取已经对应的分类id，以“，”分隔
const categoryIds = ref('')
//根据商品id查询对应分类
const getCategoryList=async(goodId:string)=>{
  let res = await getCategoryListApi(goodId)
  if (res && res.code == 200) {
    bindValue.value = res.data
    categoryIds.value = res.data.join(',')
  }

}
//勾选的值
const selected = (value: Array<string | number>) => {
  addModel.categoryId = value.join(",")
}


/* 筛选 */
//筛选弹出框
const filterModel=reactive({
  categoryIds:'',
  priceMin:'',
  priceMax:'',
})

const filterTitle = ref('筛选');
const filterVisible = ref(false)
const filterClose = () => {
  filterVisible.value = false
}
const filterShow = () => {
  filterModel.priceMin = ''
  filterModel.priceMax = ''
  filterValueOptions.value=[];
  getFilterOptions();
  filterVisible.value = true
}
const filterConfirm = async() => {
  //根据条件查询返回对应商品
  let res = await getGoodConditionApi(filterModel)
  if(res&&res.code==200){
    tableList.value=res.data
    console.log(res.data);
    
  }
  filterClose()
  
}


//已经选择的
const filterValueOptions=ref([])
//所有分类选项
const filterOptions=ref([{
  value:'',
  label:'',
  check:''
}])
//获取所有分类选项
function getFilterOptions(){
  getSelect().then(()=>{
    filterOptions.value=options.value
  })
}

const filterChange=()=>{
  filterModel.categoryIds=filterValueOptions.value.join(',')
  console.log(filterModel.categoryIds);
  
}

//图片文件上传成功后
function uploadImg(res: any) {
  addModel.pictureKey = res.msg;

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
  getList();
  nextTick(() => {
    tableHeight.value = window.innerHeight - 200
  })
})

</script>

<style scoped lang="scss"></style>