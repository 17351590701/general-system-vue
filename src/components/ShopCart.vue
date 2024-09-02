<template>
  <!-- 购物车卡片 -->
  <el-card style="margin-left: 10px;width: auto;">
    <!--切换选项卡-->
    <template #header>
      <div style="display: flex;">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部订单" name="showAll"></el-tab-pane>
          <el-tab-pane label="待付款" name="waitPay"></el-tab-pane>
          <el-tab-pane label="待收货" name="waitReceive"></el-tab-pane>
          <el-tab-pane label="待评价" name="waitComment"></el-tab-pane>
          <el-tab-pane label="退换/售后" name="afterSales"></el-tab-pane>
        </el-tabs>
        <el-button type="danger" @click="delBatch" size="small" style="margin-left: 300px;margin-top: 10px">批量删除</el-button>
      </div>
    </template>
    <el-table :data="tableList" @selection-change="handleSelectionChange"
              border stripe style="height: 550px;">
      <el-table-column type="selection" label="选择" width="50"></el-table-column>
      <el-table-column label="商品图片" width="150">
        <template #default="scope">
          <el-image style="width: 90px; height: 70px;border-radius: 10px"
                    :src="'http://localhost:8888/api/files/' + scope.row.pictureKey"
                    :preview-src-list="['http://localhost:8888/api/files/' + scope.row.pictureKey]"
                    :preview-teleported="true">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="goodName" label="商品名称"></el-table-column>
      <el-table-column prop="sum" label="总计" sortable></el-table-column>
      <el-table-column prop="status" label="订单状态">
        <template #default="scope">
          <div style="display: flex;justify-content: center;">
            <el-tag :type="getStatusType(scope.row.status)" style="margin: 0 10px;" effect="light" size="large">
              {{ getStatusValue(scope.row.status) }}
            </el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button type="info" text bg @click="showDetails(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页-->
    <el-pagination class="pagination"
                   @size-change="sizeChange" background @current-change="currentChange"
                   :current-page="shopCartParam.currentPage"
                   :page-sizes="[10, 20, 30, 40]" :page-size="shopCartParam.pageSize"
                   layout="total, sizes, prev, pager, next, jumper" :total="shopCartParam.total">
    </el-pagination>
  </el-card>
  <!-- 商品订单详情弹框 -->
  <el-dialog v-model="showGoodDetails" title="商品订单详情" width="600" top="5vh">
    <el-row style="height: 320px">
      <el-col :span="9">
        <el-form-item label="">
          <el-image
              style="width: 230px; height: 280px;border-radius: 10px;border: #324152 2px solid;box-shadow: #b2b2b2 2px 2px 1px 1px;"
              :src="'http://localhost:8888/api/files/' + shopCartGood.pictureKey"
              :preview-src-list="['http://localhost:8888/api/files/' + shopCartGood.pictureKey]"
              :preview-teleported="true">
          </el-image>
        </el-form-item>
      </el-col>
      <el-col :span="15" style="padding-left: 20px">
        <el-form-item label="订单编号:" label-width="90px">
          <el-text type="info" size="large">{{ shopCartGood.orderId }}</el-text>
        </el-form-item>
        <el-form-item label="商品名称:" label-width="90px">
          <el-text size="large">{{ shopCartGood.goodName }}</el-text>
        </el-form-item>
        <el-form-item label="商品单价:" label-width="90px">
          <el-text>{{ shopCartGood.price }}</el-text>
        </el-form-item>
        <el-form-item label="购买数量:" label-width="90px">
          <el-input-number v-model="shopCartGood.buyNum" :min="0" :max="shopCartGood.stock"
                           :disabled="getBoolean"></el-input-number>
        </el-form-item>
        <el-form-item label="收货地址:" label-width="90px">
          <el-input v-model="shopCartGood.address" type="textarea" resize="none" :disabled="getBoolean"
                    :autosize="{ minRows: 2, maxRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="总计:" label-width="90px" style="float: right;margin-top:30px;font-size: 20px;">
          <span style="font-size: 20px;color: orangered;font-weight: bold">{{
              formatPrice(shopCartGood.price * shopCartGood.buyNum)
            }}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <!-- 下滚评论区 -->
    <div class="scoreComments" style="width: 100%; margin-top: 20px">
      <el-divider content-position="left">买家评价</el-divider>
      <ul class="infinite-list" style="overflow: auto">
        <li v-for="(comment, index) in shopCartGood.allComments" :key="index" class="infinite-list-item">
          <div style="width: 100%;height: 100%;display: flex;flex-direction: column;">
            <div id="avatar-nickName" style="display: flex;align-items: center">
              <!-- 如果用户没自定义头像，则默认显示头像 -->
              <el-avatar v-if="userStore.getAvatar == ''"
                         src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png">User
              </el-avatar>
              <el-avatar v-else :src="'http://localhost:8888/api/files/' + userStore.getAvatar"></el-avatar>
              <!--真实姓名，匿名操作，替换第一个汉字后面的字为"xx"-->
              <span style="margin-left: 10px">{{ comment.nickName.replace(comment.nickName.substring(1), "**") }}</span>
            </div>
            <!--用户评论-->
            <div>
              <el-input type="textarea" disabled v-model="comment.comments"
                        style="height: 50px;width: 97%;padding-left: 7px;margin-top: 3px" resize="none"
                        :autosize="{ minRows: 2, maxRows: 4 }">
              </el-input>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <template #footer>
      <el-row justify="end">
        <!-- 已收货、退款后可评价/判断是否已经评价过 -->
        <el-button type="success" plain @click="commentDialog"
                   v-if="shopCartGood.status === 5||shopCartGood.status === 7||shopCartGood.status === 8">
          <template #default>
            <span v-if="shopCartGood.comments ==null">
              去评价
            </span>
            <span v-else>修改评价</span>
          </template>
        </el-button>
        <!-- 未支付/已收货、和已取消的订单可以删除 -->
        <el-popconfirm title="确认删除该订单信息吗?" width="210px" @confirm="shopCartDelete">
          <template #reference>
            <el-button type="danger" plain
                       v-if="shopCartGood.status === 0 || shopCartGood.status === 5 || shopCartGood.status === 6 || shopCartGood.status === 8 || shopCartGood.status === 10">
              删除订单
            </el-button>
          </template>
        </el-popconfirm>
        <!-- 其他订单状态：结算 退款 -->
        <el-button type="primary" plain @click="shopCartPay" v-if="shopCartGood.status === 0">
          去结算
        </el-button>
        <el-popconfirm title="请确保您已经收到了货物?" width="250px" @confirm="confirmReceive"
                       v-if="shopCartGood.status === 1">
          <template #reference>
            <el-button type="warning" plain>
              确认收货
            </el-button>
          </template>
        </el-popconfirm>
        <el-button type="primary" plain @click="shopCartReturn"
                   v-if="shopCartGood.status === 1 || shopCartGood.status === 2 || shopCartGood.status === 3 || shopCartGood.status === 4 || shopCartGood.status === 5">
          去退货/退款
        </el-button>
      </el-row>
    </template>
  </el-dialog>
  <!--用户评价弹框-->
  <el-dialog v-model="showCommentDialog" width="500" top="30vh" style="padding: 10px">
    <template #title style="height: 20px;">
      <p style="font-size: 15px;margin-top: 10px;margin-bottom: 0;">用户评价
        <el-tooltip effect="dark" content="您的评价内容在商品评价页面将会被匿名展示" placement="right-start">
          <el-icon style="margin-left: 5px;font-size: 18px" color="#7f7f7f">
            <QuestionFilled/>
          </el-icon>
        </el-tooltip>
      </p>
    </template>
    <el-form label-width="80px">
      <el-form-item label="商品星级:">
        <el-rate style="margin-left: 10px" v-model="shopCartGood.starRate"
                 :texts="['非常差', '差', '一般', '好', '非常好']"
                 show-text size="large"/>
      </el-form-item>
      <el-form-item label="商品评价:">
        <el-input type="textarea" v-model="shopCartGood.comments" resize="none" maxlength="180" show-word-limit
                  :autosize="{ minRows: 3, maxRows: 5 }"></el-input>
      </el-form-item>
      <el-form-item label-width="320">
        <el-button type="danger" @click="cancelComment">取消</el-button>
        <el-button type="primary" @click="submitComment">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted, nextTick, computed} from 'vue'
import {
  addCommentApi,
  deleteOrderApi, deleteBatchShopCart,
  getShopCartListAPi,
  shopCartPayApi,
  shopCartReturnApi,
  updateOrderApi
} from '@/api/order';
import {useUserStore} from '@/stores/user';
import {ElMessage} from "element-plus";
import {QuestionFilled} from "@element-plus/icons-vue";
import type {TabsPaneContext} from 'element-plus'


const userStore = useUserStore()
// 请求后端参数
const shopCartParam = reactive({
  userId: userStore.getUserId,
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 显示订单详情弹框
const showGoodDetails = ref(false)
// 用户订单评价弹框
const showCommentDialog = ref(false)
// 商品订单回写提交数据
const shopCartGood = reactive({
  orderId: '',
  goodId: 0,
  pictureKey: '',
  goodName: '',
  price: 0,
  buyNum: 0,
  stock: 0,
  sum: '',
  address: '',
  status: 0,
  starRate: 0,
  comments: '',
  allComments: [{
    nickName: '',
    avatar: '',
    comments: ''
  }]
})

const activeName = ref('showAll')
// 点击选项卡触发
const handleClick = (tab: TabsPaneContext, event: Event) => {
  // 根据tab-name值过滤tableList
  switch (tab.paneName) {
    case 'showAll': //什么都不做直接返回
      tableList.value = tableListCopy.value
      break
    case 'waitPay': //过滤出订单状态为"0"，显示未支付订单
      tableList.value = tableListCopy.value.filter((item: any) => item.status === 0)
      break
    case 'waitReceive': //过滤出订单状态为"1"，显示待收货订单
      tableList.value = tableListCopy.value.filter((item: any) => item.status === 1)
      break
    case 'waitComment': //过滤出shopCartGood.comment=null，未评价的
      tableList.value = tableListCopy.value.filter((item: any) => item.comments == null)
      break
    case 'afterSales': //过滤出售后中的
      tableList.value = tableListCopy.value.filter((item: any) => item.status === 7 || item.status === 8)
      break
  }

}
//真正接受数据的列表
const tableList = ref([])
// 用于选项卡列表切换
const tableListCopy = ref([])
const getShopCartList = async () => {
  let res = await getShopCartListAPi(shopCartParam)
  tableList.value = res.data.records
  // 拷贝一份用来选项卡还原（showAll）
  tableListCopy.value = res.data.records
  shopCartParam.total = res.data.total
}

//  打开弹窗，显示订单商品详情
const showDetails = (row: any) => {
  showGoodDetails.value = true
  // 数值回写 
  Object.assign(shopCartGood, row)
  shopCartGood.allComments = row.allComments
  console.log(shopCartGood);

}

// 总计金额保留两位小数
const formatPrice = (price: number) => {
  return price.toFixed(2)
}

// 获取订单状态显示: 数字-->文本
const getStatusValue = (status: number) => {
  switch (status) {
    case 0:
      return '未支付'
    case 1:
      return '已支付'
    case 2:
      return '待发货'
    case 3:
      return '已发货'
    case 4:
      return '待收货'
    case 5:
      return '已收货'
    case 6:
      return '已评价'
    case 7:
      return '售后中'
    case 8:
      return '已退换'
    case 9:
      return '取消中'
    case 10:
      return '已取消'
  }
}
// 获取订单状态颜色样式
const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case 2:
      return 'warning'
    case 3:
      return 'success'
    case 4:
      return 'warning'
    case 5:
      return 'warning'
    case 6:
      return 'success'
    case 7:
      return 'warning'
    case 8:
      return 'success'
    case 9:
      return 'warning'
    case 10:
      return 'danger'

  }
}
// 控制能否修改数字选择器，商品购买数
const getBoolean = computed(() => {
  return shopCartGood.status != 0;
})

// 用户删除自己的订单,即直接调用删除订单即可，unPaid队列为null已经做了处理
const shopCartDelete = async () => {
  let res = await deleteOrderApi(shopCartGood.orderId)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    // 刷新列表
    await getShopCartList()
    // 关闭弹窗
    showGoodDetails.value = false
  } else {
    ElMessage.error(res.msg)
  }
}
// 用户支付未支付的订单
const shopCartPay = async () => {
  let payParam = {
    orderId: shopCartGood.orderId,
    userId: userStore.getUserId,
    goodId: shopCartGood.goodId,
    buyNum: shopCartGood.buyNum,
    sum: formatPrice(shopCartGood.price * shopCartGood.buyNum),
    address: shopCartGood.address,
    status: 1,
  }
  let res = await shopCartPayApi(payParam)
  if (res.code === 200) {
    ElMessage.success(res.msg)
    // 刷新列表
    await getShopCartList()
    // 关闭弹窗
    showGoodDetails.value = false
  } else {
    ElMessage.error(res.msg)
  }
}
/* 用户手动收货 */
const confirmReceive = async () => {
  // 相当于修改订单，只修改状态为已收货，提交后端，刷新列表
  let modelWithoutTime = {
    orderId: shopCartGood.orderId,
    userId: userStore.getUserId,
    nickName: userStore.getNickName,
    goodId: String(shopCartGood.goodId),
    goodName: shopCartGood.goodName,
    buyNum: shopCartGood.buyNum,
    sum: parseFloat(shopCartGood.sum),
    address: shopCartGood.address,
    status: 5,
  }
  let res = await updateOrderApi(modelWithoutTime)
  if (res && res.code === 200) {
    ElMessage.success('确认');
    //  刷新列表关闭弹框
    await getShopCartList();
    showGoodDetails.value = false
  } else {
    ElMessage.error(res.msg)
  }
}
/* 用户评价评论弹框 */
const commentDialog = () => {
  showCommentDialog.value = true
}

// 取消评价
const cancelComment = () => {
  shopCartGood.starRate = 0
  shopCartGood.comments = ''
  showCommentDialog.value = false
}
// 提交评价，每次订单只可评价一次,相当于更新订单
const submitComment = async () => {
  // 准备提交模型
  let commentParam = {
    orderId: shopCartGood.orderId,
    starRate: shopCartGood.starRate,
    comments: shopCartGood.comments,
  }
  let res = await addCommentApi(commentParam);
  if (res && res.code === 200) {
    ElMessage.success(res.msg)
    //将最新评论回写
    shopCartGood.allComments = res.data
    // 刷新table列表关闭评论弹框
    await getShopCartList()
    showCommentDialog.value = false;
  }
}

// 商品退货退款
const shopCartReturn = async () => {
  let res = await shopCartReturnApi(shopCartGood.orderId)
  if (res && res.code === 200) {
    ElMessage.success(res.msg)
    // 刷新列表
    await getShopCartList()
    // 关闭弹窗
    showGoodDetails.value = false
  } else {
    ElMessage.error(res.msg)
  }
}

// 表格多选函数
const multipleSelection = ref<any[]>([])
const handleSelectionChange = (val: any[]) => {
  // 获取选中的订单id数组
  multipleSelection.value = val.map(item => item.orderId)
}
const delBatch = async () => {
  let res = await deleteBatchShopCart(multipleSelection.value.join(","));
  if (res && res.code === 200) {
    ElMessage.success(res.msg)
    // 刷新列表
    await getShopCartList()
  } else {
    ElMessage.error(res.msg)
  }
}
/*
*分页参数与高度控制
 */
//页容量改变时触发
const sizeChange = (size: number) => {
  shopCartParam.pageSize = size
  getShopCartList()
}
//页数改变时触发
const currentChange = (page: number) => {
  shopCartParam.currentPage = page
  getShopCartList()
}

const tableHeight = ref(0)
onMounted(() => {
  getShopCartList()
  nextTick(() => {
    tableHeight.value = window.innerHeight - 200
  })
})
</script>

<style scoped lang="scss">
/* 评论滚动框 */
.infinite-list {
  height: 200px;
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  background: var(--el-color-primary-light-9);
  margin: 10px;
  color: var(--el-color-primary);
}

.infinite-list .infinite-list-item + .list-item {
  margin-top: 10px;
}

::v-deep(.el-card__header) {
  padding: 5px 20px;
  height: 45px;
}

::v-deep(el-tabs el-tabs--top) {
  margin-bottom: 0;
}

::v-deep(.el-tabs__item) {
  font-size: 16px;
  font-family: "HarmonyOS Sans SC Light", sans-serif;
  font-weight: normal;
}

.pagination {
  margin-top: 10px;
}
</style>