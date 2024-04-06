<template>
<div class="header-container">
  <Collapse></Collapse>
  <BreadCrumb></BreadCrumb>
</div>
</template>

<script setup lang="ts">
import Collapse from "@/layout/header/Collapse.vue";
import BreadCrumb from "@/layout/header/BreadCrumb.vue";
</script>

<style scoped lang="scss">
.header-container{
  display: flex;
  align-items: center;
}

</style>