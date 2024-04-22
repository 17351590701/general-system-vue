<template>
    <el-main style="padding: 0,20px">
        <!-- 搜索框 -->
        <el-form :model="searchParam" label-width="80px" :inline="false" size="default">
            <el-form-item>
                <el-input v-model="searchParam.goodName" placeholder="请输入商品名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon="Search" @click="searchBtn">搜索</el-button>
                <el-button icon="Close" type="danger" @click="resetBtn">重置</el-button>
                <el-button icon="Plus" type="primary" @click="addBtn">新增</el-button>
            </el-form-item>
        </el-form>


    </el-main>
</template>

<script setup lang="ts">
import { reactive } from 'vue';


const searchParam = reactive({
    goodName: '',
    currentPage: '',
    pageSize: '',
    total: 0
})
//搜索
const searchBtn = () => {
    console.log(searchParam)
}
//重置
const resetBtn = () => {
    searchParam.goodName = ''
}
//新增
const addBtn = () => {
    console.log('addBtn')
}   
</script>

<style scoped lang="scss"></style>