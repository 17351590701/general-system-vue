<template>
  <el-card style="margin-left: 20px;flex: 1;">
    <template #header>
      <div class="card-header">
        <span>热门商品</span>
      </div>
    </template>
    <div ref="myChartRef" :style="{width:'400px',height:'300px'}"></div>
  </el-card>
</template>

<script setup lang="ts">
// import * as echarts from 'echarts';
import {nextTick, onMounted, reactive, ref} from "vue";
import useInstance from '@/hooks/useInstance'

const {global} = useInstance()
const mainHeight = ref(0)
const myChartRef = ref<HTMLDivElement>()

//图形
const chart = () => {
  //初始化，传递ref
  const chartInstance = global.$echarts.init(myChartRef.value)
  //配置项
  let option = reactive({
    title: {
      subtext: 'Fake Data',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  });
  //通过axios发送请求获取数据，设置到option的data中

  chartInstance.setOption(option)
}

onMounted(()=>{
  chart();
  nextTick(()=>{
    mainHeight.value=window.innerHeight-100
  })
})
</script>

<style scoped lang="scss"></style>