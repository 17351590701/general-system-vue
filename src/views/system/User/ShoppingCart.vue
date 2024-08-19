<template>
  <el-card style="margin-left: 20px;width: auto;">
    <template #header>
      <div class="card-header">
        <span>购物车</span>
      </div>
    </template>
    <el-table :data="tableList" border stripe style="height: 530px;">
      <el-table-column label="商品图片" width="250">
        <template #default="scope">
          <el-image style="width: 50px; height: 70px" :src="'http://localhost:8080/api/files/' + scope.row.pictureKey"
            :preview-src-list="['http://localhost:8080/api/files/' + scope.row.pictureKey]" :preview-teleported="true">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="Cancel(scope.row.goodId)" type="danger" icon="Delete" size="default">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="shopParam.currentPage"
      :page-sizes="[10, 20, 30, 40]" :page-size="shopParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="shopParam.total">
    </el-pagination>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { shopCartListApi } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { cancelApi } from '@/api/user';
import { ElMessage } from 'element-plus';
import type { shopModel } from '@/api/good/GoodModel';

const userStore = useUserStore()
const shopParam = reactive({
  userId: userStore.getUserId,
  currentPage: 1,
  pageSize: 10,
  total: 0
})

const tableList = ref([])
async function getList() {
  let res = await shopCartListApi(shopParam)
  if (res && res.code == 200) {
    tableList.value = res.data.records
    shopParam.total = res.data.total
  }
}
//取消订单
async function Cancel(goodId: string) {
  let requestParam = <shopModel>{
    userId: userStore.getUserId,
    goodId: goodId,
    buyNum: 0,
    sum: 0,
    address: ''
  }
  let res = await cancelApi(requestParam)
  if (res && res.code == 200) {
    ElMessage.success("取消成功")
    //刷新
    getList();
  }

}
//页容量改变时触发
const sizeChange = (size: number) => {
  shopParam.pageSize = size
  getList()
}
//页数改变时触发
const currentChange = (page: number) => {
  shopParam.currentPage = page
  getList()
}

onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss"></style>