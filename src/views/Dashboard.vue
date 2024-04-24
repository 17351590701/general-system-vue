<template>
  <el-card style="margin-left: 20px;flex: 1;">
    <template #header>
      <div class="card-header">
        <span>商品大全</span>
      </div>
    </template>
    <div ref="myChartRef" :style="{width:'400px',height:'300px'}"></div>
  </el-card>
</template>

<script setup lang="ts">
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
  const option = {
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: 'Access From',
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
      data: [
        { value: 10, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
};

  chartInstance.setOption(option)
}


// function getData(){
//     //通过axios发送请求获取数据，设置到option的data中
//     getListApi({}).then(res=>{
//       console.log(res)
//     })
    
//   }
onMounted(()=>{
  chart();
  nextTick(()=>{
    mainHeight.value=window.innerHeight-100
  })
})
</script>

<style scoped lang="scss"></style>