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
                    <el-image style="width: 50px; height: 70px"
                        :src="'http://localhost:8888/api/files/' + scope.row.pictureKey"
                        :preview-src-list="['http://localhost:8888/api/files/' + scope.row.pictureKey]"
                        :preview-teleported="true">
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column prop="goodName" label="商品名称"></el-table-column>
            <el-table-column prop="price" label="价格"></el-table-column>
            <el-table-column label="操作">
                <!-- <template #default="scope">
                    <el-button @click="Cancel(scope.row.goodId)" type="danger" icon="Delete"
                        size="default">取消</el-button>
                </template> -->
            </el-table-column>
        </el-table>
        <!-- 分页-->
        <!-- <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="shopParam.currentPage"
            :page-sizes="[10, 20, 30, 40]" :page-size="shopParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="shopParam.total">
        </el-pagination> -->
    </el-card>
</template>

<script lang="ts" setup>

</script>

<style scoped>
</style>