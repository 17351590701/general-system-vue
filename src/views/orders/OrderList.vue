<template>
    <el-main style="padding: 0 20px;">
        <!-- 搜索框 -->
        <el-form-item :model="searchParam" :inline="true">
            <el-autocomplete v-model="inputKey" :fetch-suggestions="querySearch" clearable
                placeholder="请输入用户名、商品名、收货地址进行搜索..." debounce style="width: 700px;" />
            <el-button style="margin-left: 20px;" icon="Search" @click="searchOrderList">搜索</el-button>
        </el-form-item>
        <!-- table显示订单列表 -->
    <!-- table显示列表-->
    <el-table :data="tableList" border stripe :heigth="tableHeight">
      <el-table-column label="商品图片" width="150">
        <template #default="scope">
          <el-image style="width: 50px; height: 70px" :src="'http://localhost:8080/api/files/' + scope.row.pictureKey"
            :preview-src-list="['http://localhost:8080/api/files/' + scope.row.pictureKey]" :preview-teleported="true">
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
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="orderListParam.currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="orderListParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="orderListParam.total">
    </el-pagination>
    </el-main>
</template>

<script  setup>
import { ref, reactive, watchEffect } from 'vue'
import { getOrderListApi, getOrderSuggestion } from '@/api/order';

/* 
*自动补全功能 
*/
const inputKey = ref('')
const restaurants = ref([])
const querySearch = (queryString, cb) => {
    restaurants.value = []
    const results = restaurants.value
    //回到函数，显示下拉列表
    cb(results)
}
// 监听inputKey变化
watchEffect(async () => {
    // 如果输入为空，或空字符串,直接返回
    if (!inputKey.value || inputKey.value.trim() == '') {
        restaurants.value = []
        return
    }
    // 否则查询自动补全建议
    let res = await getOrderSuggestion(inputKey.value)
    if (res && res.code == 200) {
        res.data.forEach((item) => {
            restaurants.value.push({ value: item })
        });
    }
})


/* 
*搜索订单列表
*/
const orderListParam = reactive({
    searchParam: inputKey.value,
    currentPage: 1,
    pageSize: 10,
    total: 0
})
const tableList = ref([])
const searchOrderList = async () => {
    let res = await getOrderListApi(orderListParam);
    if (res && res.code == 200) {
        tableList.value = res.data.list
        orderListParam.total = res.data.total
    }
}


/* 
*分页参数与高度控制
 */
//页容量改变时触发
const sizeChange = (size) => {
  searchParam.pageSize = size
  getList()
}
//页数改变时触发
const currentChange = (page) => {
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

<style scoped></style>