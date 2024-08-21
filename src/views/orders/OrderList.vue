<template>
    <el-main style="padding: 0 20px;">
        <!-- 搜索框 -->
        <el-form-item :inline="true">
            <el-autocomplete v-model="inputKey" :fetch-suggestions="querySearch" placeholder="请输入用户名、商品名、收货地址进行搜索..."
                debounce style="width: 700px;" :handleKeyEnter="getOrderList" @keydown.enter.native="getOrderList" />
            <el-button style="margin-left: 20px;" icon="Search" @click="getOrderList">搜索</el-button>
            <el-button style="margin-left: 10px;" icon="Close" type="danger" @click="resetBtn">清空</el-button>
        </el-form-item>
        <!-- table显示订单列表 -->
        <el-table :data="tableList" border stripe :heigth="tableHeight">
            <el-table-column prop="orderId" label="订单id" width="200"></el-table-column>
            <el-table-column prop="nickName" label="购买人" width="150"></el-table-column>
            <el-table-column prop="goodName" label="商品" width="200"></el-table-column>
            <el-table-column prop="buyNum" label="数量/(个)" width="auto">
                <template #default="scope">
                    <div>
                        <el-tag type="success" effect="plain" style="margin: 0 10px;">{{ scope.row.buyNum }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="sum" label="总金额/（元)" width="auto">
                <template #default="scope">
                    <div>
                        <el-tag type="primary" effect="plain" style="margin: 0 10px;">{{ scope.row.sum }}</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="address" label="收货地址">
                <template v-slot="scope">
                    <el-text truncated>{{ scope.row.address }}</el-text>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="订单状态">
                <template #default="scope">
                    <div>
                        <el-tag :type="getStatusType(scope.row.status)" style="margin: 0 10px;">
                            {{ getStatusValue(scope.row.status) }}
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="200px">
                <template #default="scope">
                    <el-button type="primary" size="default" icon="Edit" @click="editBtn(scope.row)">编辑
                    </el-button>
                    <el-button type="danger" size="default" icon="Delete" @click="deleteBtn(scope.row.orderId)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页-->
        <el-pagination class="pagination" @size-change="sizeChange" @current-change="currentChange"
            :current-page="orderListParam.currentPage" :page-sizes="[10, 20, 30, 40]"
            :page-size="orderListParam.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="orderListParam.total">
        </el-pagination>
        <!-- 编辑框 -->
        <SysDialog :title="dialog.title" :visible="dialog.visible" :width="dialog.width" :height="dialog.height"
            @on-close="onClose" @on-confirm="commmitOrder">
            <template v-slot:content>
                <el-form :model="orderModel" ref="addRef" :rules="rules" label-width="100px" size="default"
                    style="height:500px;overflow:auto;">
                    <el-form-item label="订单id" prop="orderId" style="width:90%">
                        <el-input v-model="orderModel.orderId" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户id" prop="userId" style="width:90%">
                        <el-input v-model="orderModel.userId" placeholder="用户id" />
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="nickName" style="width:90%">
                        <el-input v-model="orderModel.nickName"></el-input>
                    </el-form-item>
                    <el-form-item label="商品id" prop="goodId" style="width:90%">
                        <el-input v-model="orderModel.goodId"></el-input>
                    </el-form-item>
                    <el-form-item label="商品名" prop="goodName" style="width:90%">
                        <el-input v-model="orderModel.goodName"></el-input>
                    </el-form-item>
                    <el-form-item label="购买数量" prop="buyNum" style="width:90%">
                        <el-input v-model="orderModel.buyNum"></el-input>
                    </el-form-item>
                    <el-form-item label="总金额" prop="sum" style="width:90%">
                        <el-input v-model="orderModel.sum" placeholder="单位:元"></el-input>
                    </el-form-item>
                    <el-form-item label="收货地址" prop="address" style="width:90%">
                        <el-input v-model="orderModel.address" type="textarea" style="width: 100%" :rows="3"
                            placeholder="填写详细收货地址"></el-input>
                    </el-form-item>
                    <el-form-item label="订单状态" prop="status" style="width:90%">
                        <el-tooltip placement="right-start" effect="dark">
                            <template #content>0:未支付、1:已支付、2:待发货，3:已发货、4:待收货、5:已收货、<br />
                                6:已评价、7:退款中、8:已退款、9:取消中、10:已取消</template>
                            <el-input v-model="orderModel.status"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="createTime" style="width:90%">
                        <el-input v-model="orderModel.createTime" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="更新时间" prop="updateTime" style="width:90%">
                        <el-input v-model="orderModel.updateTime" disabled></el-input>
                    </el-form-item>
                </el-form>
            </template>
        </SysDialog>
    </el-main>
</template>

<script lang="ts" setup>
import { ref, reactive, watchEffect, nextTick, onMounted, computed } from 'vue'
import { getOrderListApi, getOrderSuggestion, deleteOrderApi, updateOrderApi } from '@/api/order';
import { ElMessage } from 'element-plus';
import useInstance from '@/hooks/useInstance';
import useDialog from '@/hooks/useDialog'
import SysDialog from '@/components/SysDialog.vue'

// 删除确认
const { global } = useInstance()
// 弹窗属性
const { dialog, onClose, onConfirm, onShow } = useDialog()


/* 
*搜索订单列表
*/
const inputKey = ref('')
const orderListParam = reactive({
    searchParam: computed(() => {
        return inputKey.value
    }),
    currentPage: 1,
    pageSize: 10,
    total: 0
})
// 用于编辑模型
const orderModel = reactive({
    orderId: '',
    userId: '',
    nickName: '',
    goodId: '',
    goodName: '',
    buyNum: 0,
    sum: 0,
    address: '',
    status: 0,
    createTime: '',
    updateTime: ''
})
const tableList = ref([])
const getOrderList = async () => {
    let res = await getOrderListApi(orderListParam);
    if (res && res.code == 200) {
        tableList.value = res.data.list
        orderListParam.total = res.data.total
    }
}

// 清空搜索条件按钮,重置列表
const resetBtn = () => {
    inputKey.value = ''
    orderListParam.currentPage = 1
    getOrderList()
}

// 自动补全功能 
const restaurants = ref<{ value: any }[]>([])
const querySearch = (queryString: any, cb: any) => {
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
        res.data.forEach((item: any) => {
            restaurants.value.push({ value: item })
        });
    }
})

/* 
*编辑订单
 */
const rules = reactive({
    userId: [{ required: true, trigger: 'blur', message: '请输入用户id' }],
    nickName: [{ required: true, trigger: 'blur', message: '请输入用户真实姓名' }],
    status: [{ required: true, trigger: 'blur', message: '请输入订单状态' }],
})
const editBtn = async (row: any) => {
    dialog.title = '编辑订单'
    dialog.height = 500
    // 行数据回显到模型
    Object.assign(orderModel, row)
    onShow()
}

// 提交编辑信息
const commmitOrder = async () => {
    // 传递参数时，排除其他字段，如时间、补全建议等
    let modelWithoutTime = {
        orderId: orderModel.orderId,
        userId: orderModel.userId,
        nickName: orderModel.nickName,
        goodId: orderModel.goodId,
        goodName: orderModel.goodName,
        buyNum: orderModel.buyNum,
        sum: orderModel.sum,
        address: orderModel.address,
        status: orderModel.status,
    }
    let res = await updateOrderApi(modelWithoutTime);
    if (res && res.code == 200) {
        ElMessage.success('修改成功');
        //  刷新列表
        setTimeout(() => {
            getOrderList();
        }, 1000)
        // 流畅刷新功能
        setTimeout(() => {
            onClose()

        }, 500)
    } else {
        ElMessage.error(res.msg)
    }
}


/* 
*删除订单
 */
const deleteBtn = async (orderId: string) => {
    const confirm = await global.$myConfirm('确定删除该订单吗？')
    if (confirm) {
        let res = await deleteOrderApi(orderId)
        if (res && res.code) {
            ElMessage.success('删除成功');
            //  刷新列表
            setTimeout(() => {
                getOrderList();
            }, 1000)
        } else {
            ElMessage.error(res.msg)
        }
    }
}

// 获取订单状态显示: 数字-->文本
const getStatusValue = (status: number) => {
    switch (status) {
        case 0: return '未支付'
        case 1: return '已支付'
        case 2: return '待发货'
        case 3: return '已发货'
        case 4: return '待收货'
        case 5: return '已收货'
        case 6: return '已评价'
        case 7: return '退款中'
        case 8: return '已退款'
        case 9: return '取消中'
        case 10: return '已取消'
    }
}
// 获取订单状态颜色样式
const getStatusType = (status: number) => {
    switch (status) {
        case 0: return 'info'
        case 1: return 'success'
        case 2: return 'warning'
        case 3: return 'success'
        case 4: return 'warning'
        case 5: return 'success'
        case 6: return 'success'
        case 7: return 'warning'
        case 8: return 'success'
        case 9: return 'warning'
        case 10: return 'danger'

    }
}
/* 
*分页参数与高度控制
 */
//页容量改变时触发
const sizeChange = (size: number) => {
    orderListParam.pageSize = size
    getOrderList()
}
//页数改变时触发
const currentChange = (page: number) => {
    orderListParam.currentPage = page
    getOrderList()
}

const tableHeight = ref(0)
onMounted(() => {
    getOrderList();
    nextTick(() => {
        tableHeight.value = window.innerHeight - 200
    })
})
</script>

<style scoped>
.pagination {
    margin-top: 20px;
}
</style>