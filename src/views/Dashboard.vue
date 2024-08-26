<template>
  <div class="container">
    <div class="echart">
      <VisitorTraffic></VisitorTraffic>
      <GoodEcharts></GoodEcharts>
    </div>
    <div class="shop">
      <ShopCart></ShopCart>
    </div>
  </div>
</template>

<script setup lang="ts">
import ShopCart from "@/components/ShopCart.vue";
import GoodEcharts from "@/components/GoodEcharts.vue";
import VisitorTraffic from "@/components/VisitorTraffic.vue";

</script>

<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;

  .shop {
    flex: 2;
    box-sizing: border-box;
    width: 600px;
    height: 100%;
  }

  .echart {
    flex: 1;
    box-sizing: border-box;
    width: 500px;
    height: 100%;
  }
}
</style>
