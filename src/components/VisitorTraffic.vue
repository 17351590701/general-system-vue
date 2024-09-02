<template>
  <el-card class="visitor">
    <el-row gutter="12">
      <el-col span="12" style="margin: 0 40px">
        <div class="statistic-card">
          <el-statistic :value="userCount">
            <template #title>
              <div style="display: inline-flex; align-items: center;">
                当前活跃用户数
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>较昨日</span>
              <span class="green">
              {{ userPercentage }}
              <el-icon>
                <CaretTop/>
              </el-icon>
            </span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col span="12" style="margin: 0 40px">
        <div class="statistic-card">
          <el-statistic :value="visitorTraffic" title="New transactions today">
            <template #title>
              <div style="display: inline-flex; align-items: center;margin-left: 10px">
                今日人流量
              </div>
            </template>
          </el-statistic>
          <div class="statistic-footer">
            <div class="footer-item">
              <span>较昨日</span>
              <span
                  :class="visitorPercentage.substring(0,1) == '-' ? 'red' : 'green'">
              {{ visitorPercentage }}
              <el-icon>
                <!--<CaretTop/>-->
                <component :is="visitorPercentage.substring(0,1) == '-' ? 'CaretBottom' : 'CaretTop'"></component>
              </el-icon>
            </span>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {CaretTop} from '@element-plus/icons-vue'
import {userGrowthRate, getVisitorTraffic} from '@/api/user'
import {ElMessage} from "element-plus";

//用户与用户较昨日增长率
const userCount = ref(0)
const userPercentage = ref('')
const getUserGrowthRate = async () => {
  let res = await userGrowthRate();
  if (res && res.code == 200) {
    userCount.value = res.data.userCount;
    userPercentage.value = res.data.userPercentage;
  } else {
    ElMessage.error("获取用户与用户较昨日增长率失败")
  }
}
//用户访问量与流量较昨日增长率
const visitorTraffic = ref(0)
const visitorPercentage = ref('')
const getVisitorTrafficData = async () => {
  let res = await getVisitorTraffic();
  if (res && res.code == 200) {
    visitorTraffic.value = res.data.todayCount;
    visitorPercentage.value = res.data.trafficPercentage;
  } else {
    ElMessage.error("获取用户与用户较昨日增长率失败")
  }
}
onMounted(() => {
  getUserGrowthRate()
  getVisitorTrafficData()
})
</script>

<style scoped lang="scss">
.visitor {
  margin-bottom: 10px;
}

:global(h2#card-usage ~ .example .example-showcase) {
  background-color: var(--el-fill-color) !important;
}

.el-statistic {
  --el-statistic-content-font-size: 28px;
}

.statistic-card {
  padding: 20px;
  border-radius: 4px;
  background-color: var(--el-bg-color-overlay);
}

.statistic-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  font-size: 12px;
  color: var(--el-text-color-regular);
  margin-top: 16px;
}

.statistic-footer .footer-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.statistic-footer .footer-item span:last-child {
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
}

.green {
  color: var(--el-color-success);
}

.red {
  color: var(--el-color-error);
}

::v-deep(.el-statistic__content) {
  text-align: center;
}
</style>
