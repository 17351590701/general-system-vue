<template>
    <el-card class="echart">
        <template #header>
            <div class="card-header">
                <span>商品总数: {{ total }}</span>
            </div>
        </template>
        <p style="margin-bottom: 50px;">商品分类统计（商品可能含有多个分类）</p>
        <div ref="myChartRef" :style="{ width: '400px', height: '300px' }"></div>
    </el-card>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref } from "vue";
import useInstance from '@/hooks/useInstance'
import ShopCart from "@/components/ShopCart.vue";
import { getEchartsApi } from "@/api/category";

const { global } = useInstance()
const mainHeight = ref(0)
const myChartRef = ref<HTMLDivElement>()

const total = ref(0)
const dataList = ref<{ value: number; name: string }[]>([])

// 图形
const chart = async () => {
    let res = await getEchartsApi()

    if (res && res.code === 200) {
        // 更新total和dataList
        total.value = res.data.total;

        const transformedDataList = Object.entries(res.data.map).map(([category, count]) => ({
            value: count as number,
            name: category,
        }));

        dataList.value = transformedDataList;
    }

    // 初始化，传递ref
    const chartInstance = global.$echarts.init(myChartRef.value)

    // 配置项
    const option = reactive({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: '商品分类',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: dataList.value // Use dataList.value here
            }
        ]
    });

    chartInstance.setOption(option)
}

onMounted(() => {
    chart();
    nextTick(() => {
        mainHeight.value = window.innerHeight - 100
    })
})
</script>

<style scoped>
.echart {
    height: 100%;
}
</style>