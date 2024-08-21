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
        <el-button v-if="global.$hasPerm(['sys:good:sift'])" icon="Filter" @click="filterShow">筛选</el-button>
        <el-button icon="Close" type="danger" @click="resetBtn">清空</el-button>
        <el-button v-if="global.$hasPerm(['sys:good:add'])" icon="Plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 新增编辑弹窗 -->
    <SysDialog :title="dialog.title" :visible="dialog.visible" :width="dialog.width" :height="dialog.height"
      @on-close="onClose" @on-confirm="commit">
      <template v-slot:content>
        <el-form :model="addModel" ref="addRef" :rules="rules" label-width="100px" size="default"
          style="height:290px;overflow:auto;">
          <el-form-item label="商品图片">
            <el-upload action="http://localhost:8888/api/files/upload" :on-success="uploadImg">
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
            <SelectChecked :bindValue="bindValue" ref="selectRef" :options="options" @selected="selected"
              style="width:200px">
            </SelectChecked>
          </el-form-item>
          <el-form-item label="商品描述" prop="description">
            <el-input v-model="addModel.description" type="textarea" placeholder="请输入商品相关描述" style="width: 400px" />
          </el-form-item>
          <el-form-item label="商品价格" prop="price" style="width:300px">
            <el-input v-model="addModel.price" placeholder="单位:元"></el-input>
          </el-form-item>
          <el-form-item label="商品库存" prop="storeNum" style="width:300px">
            <el-input v-model="addModel.storeNum" placeholder="单位:个"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
    <!-- table显示列表-->
    <el-table :data="tableList" border stripe :heigth="tableHeight">
      <el-table-column label="商品图片" width="150">
        <template #default="scope">
          <el-image style="width: 50px; height: 70px" :src="'http://localhost:8888/api/files/' + scope.row.pictureKey"
            :preview-src-list="['http://localhost:8888/api/files/' + scope.row.pictureKey]" :preview-teleported="true">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称" width="150"></el-table-column>
      <el-table-column prop="description" label="商品描述" width="250"></el-table-column>
      <el-table-column prop="price" label="价格/(元)" width="100">
        <template #default="scope">
          <div style="display: flex; justify-content: center;">
            <el-tag type="primary" effect="plain" style="margin: 0 10px;">{{ scope.row.price }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="storeNum" label="库存/(个)" width="100">
        <template #default="scope">
          <div style="display: flex; justify-content: center;">
            <el-tag type="success" effect="plain" style="margin: 0 10px;">{{ scope.row.storeNum }}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="global.$hasPerm(['sys:good:edit', 'sys:good:delete'])" label="操作" align="center">
        <template #default="scope">
          <el-button icon="Select" type="default" size="default"
            @click="buyBtn(scope.row.goodId, scope.row.goodName, scope.row.price, scope.row.storeNum)">购买
          </el-button>
          <el-button v-if="global.$hasPerm(['sys:good:edit'])" type="primary" size="default" icon="Edit"
            @click="editBtn(scope.row)">编辑
          </el-button>
          <el-button v-if="global.$hasPerm(['sys:good:delete'])" type="danger" size="default" icon="Delete"
            @click="deleteBtn(scope.row.goodId)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination class="pagination" @size-change="sizeChange" @current-change="currentChange"
      :current-page="searchParam.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="searchParam.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="searchParam.total">
    </el-pagination>
    <!-- 筛选弹窗 -->
    <SysDialog :title="filterTitle" :visible="filterVisible" :width="500" :height="150" @on-close="filterClose"
      @on-show="filterShow" @on-confirm="filterConfirm">
      <template v-slot:content>
        <el-form :model="filterModel" label-width="80px" :inline="false" size="default">
          <el-form-item label="商品类别">
            <el-select v-model="filterValueOptions" multiple placeholder="请选择商品类别" style="width:300px"
              @change="filterChange">
              <el-option v-for="item in filterOptions" :key="item.value" :label="item.label" :value="item.value">
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
    <!--商品购买弹框-->
    <SysDialog :title="buyModel.title" :visible="buyModel.visible" :width="500" :height="300" @on-close="onCancelBuy"
      @on-confirm="onConfirmBuy">
      <template v-slot:content>
        <el-form :model="buyModel" ref="bugRef" label-width="100px" size="default" style="height:290px;overflow:auto;">
          <el-form-item label="商品名称" prop="goodName" style="width:300px">
            <el-input disabled v-model="buyModel.goodName"></el-input>
          </el-form-item>
          <el-form-item label="商品总价" prop="price" style="width:300px">
            <el-input disabled v-model="buyModel.sum" placeholder="单位:元"></el-input>
          </el-form-item>
          <el-form-item label="购买数量" prop="storeNum" style="width:230px;">
            <div style="width: 100%;height:100%;display: flex;justify-content: space-between ">
              <el-input-number v-model="buyModel.buyNum" :min="0" :max="buyModel.storeNum" />
            </div>
          </el-form-item>
          <el-form-item label="配送地址" prop="address" style="width:400px">
            <el-input v-model="buyModel.address" type="textarea" style="width: 100%" :rows="3"
              placeholder="请填写详细家庭住址"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </SysDialog>
    <!-- 购买商品，二次确认，不管是否支付，都生成订单 -->
    <el-dialog v-model="twiceConfirmDialog" title="支付界面" width="500" >
      <span>您当前的余额为:1000,是否确认购买</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button>Cancel</el-button>
          <el-button type="primary">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-main>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed, watch, watchEffect } from 'vue';
import SysDialog from '@/components/SysDialog.vue'
import useDialog from '@/hooks/useDialog'
import { getListApi, addGoodApi, deleteGoodApi, editGoodApi, getCategoryListApi, getGoodConditionApi } from '@/api/good'
import { shopCartApi, getBalance } from '@/api/user'
import { getSelectApi } from '@/api/category'
import { type FormInstance, ElMessage } from 'element-plus';
import type { GoodModel } from '@/api/good/GoodModel';
import useInstance from '@/hooks/useInstance';
import SelectChecked from "@/components/SelectChecked.vue";
import { getRoleListApi } from "@/api/user";
import type { List } from 'echarts';
import { type shopModel } from '@/api/good/GoodModel';
import { useUserStore } from '@/stores/user';
import { addOrderApi } from '@/api/order';


const twiceConfirmDialog = ref(false)
const userStore = useUserStore()
const { global } = useInstance()
const { dialog, onClose, onConfirm, onShow } = useDialog()
const searchParam = reactive({
  goodName: '',
  description: '',
  price: 0,
  storeNum: 0,
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
  storeNum: '',
  pictureKey: '',
  createTime: '',
  updateTime: '',
  categoryId: ''
})

const buyRef = ref<FormInstance>()
const buyModel: any = reactive({
  title: '商品购买',
  visible: false,
  userId: userStore.userId,
  username: '',
  goodId: '',
  goodName: '',
  storeNum: 0,
  buyNum: 1,
  price: 0,
  sum: computed(() => {
    return buyModel.price * buyModel.buyNum
  }),
  address: '',
  status: 0
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
  }],
  storeNum: [{
    required: true,
    message: '请输入库存',
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
  options.value = [];
  bindValue.value = [];
  //重新获取下拉数据
  await getSelect()
  //查询该商品对应的分类
  nextTick(() => {
    selectRef.value.clear()
  })
  //清空表单
  addRef.value?.resetFields()
}

//编辑
const editBtn = async (row: GoodModel) => {
  tags.value = '1'
  dialog.title = '编辑'
  dialog.height = 300
  options.value = [];
  bindValue.value = [];
  await getSelect();
  await getCategoryList(row.goodId)
  onShow()
  nextTick(() => {
    Object.assign(addModel, row)
    addModel.categoryId = categoryIds.value
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
    console.log(res.data);

    tableList.value = res.data.records
    searchParam.total = res.data.total
  }
}

//商品已经拥有的分类
const bindValue = ref([])
const selectRef = ref()
//下拉菜单类
const options = ref([])

async function getSelect() {
  let res = await getSelectApi()
  if (res && res.code == 200) {
    options.value = res.data;
  }
}

//存取已经对应的分类id，以“，”分隔
const categoryIds = ref('')
//根据商品id查询对应分类
const getCategoryList = async (goodId: string) => {
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
const filterModel = reactive({
  categoryIds: '',
  priceMin: '',
  priceMax: '',
})

const filterTitle = ref('筛选');
const filterVisible = ref(false)
const filterClose = () => {
  filterVisible.value = false
}
const filterShow = () => {
  filterModel.priceMin = ''
  filterModel.priceMax = ''
  filterValueOptions.value = [];
  getFilterOptions();
  filterVisible.value = true
}
const filterConfirm = async () => {
  //根据条件查询返回对应商品
  let res = await getGoodConditionApi(filterModel)
  if (res && res.code == 200) {
    tableList.value = res.data

  }
  filterClose()

}


//已经选择的
const filterValueOptions = ref([])
//所有分类选项
const filterOptions = ref([{
  value: '',
  label: '',
  check: ''
}])

//获取所有分类选项
function getFilterOptions() {
  getSelect().then(() => {
    filterOptions.value = options.value
  })
}

const filterChange = () => {
  filterModel.categoryIds = filterValueOptions.value.join(',')

}

//图片文件上传成功后
function uploadImg(res: any) {
  addModel.pictureKey = res.msg;

}

// 显示购买弹框，并传递参数
function buyBtn(goodId: string, goodName: string, price: number, storeNum: number) {
  buyModel.visible = true;
  buyModel.goodId = goodId;
  buyModel.goodName = goodName;
  buyModel.price = price;
  buyModel.storeNum = storeNum
}
/* 
*关闭购买弹框并重置购买参数
*将 订单状态变为0，同时也向后端提交
 */
const onCloseBuy = () => {
  buyModel.buyNum = 0;
  buyModel.address = ''
  buyModel.visible = false
}
/* 
*提交订单：假设完成了付款，将订单状态变为：1
 */
const onConfirmBuy = async () => {
  // 构造请求对象
  let orderParam = {
    orderId: '',
    userId: userStore.getUserId,
    nickName: userStore.getNickName,
    goodId: buyModel.goodId,
    goodName: buyModel.goodName,
    buyNum: buyModel.buyNum,
    sum: buyModel.sum,
    address: buyModel.address,
    status: 1
  }
  let res = await addOrderApi(orderParam)
  if (res && res.code == 200) {
    ElMessage.success(res.msg)
  }
  // 刷新列表
  getList();
  // 关闭购买弹框
  onCloseBuy()
}
//如果取消了订单，也生成订单，但不真正执行逻辑，即不算付款
const onCancelBuy = async () => {
  // 构造请求对象
  let orderParam = {
    orderId: '',
    userId: userStore.getUserId,
    nickName: userStore.getNickName,
    goodId: buyModel.goodId,
    goodName: buyModel.goodName,
    buyNum: buyModel.buyNum,
    sum: buyModel.sum,
    address: buyModel.address,
    status: 0
  }
  let res = await addOrderApi(orderParam)
  if (res && res.code == 200) {
    ElMessage.success(res.msg)
  }
  // 刷新列表
  getList();
  // 关闭购买弹框
  onCloseBuy()
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

<style scoped lang="scss">
.pagination {
  margin-top: 20px;
}
</style>