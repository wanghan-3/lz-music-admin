<!--
 * @Descripttion: 
 * @Author: Wang Xi
 * @version: 
 * @Date: 2024-07-17 00:40:11
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-18 23:31:09
-->
<template>
  <div class="tit-line">
    <span>{{ props.title }}</span>
    <div class="line"></div>
  </div>
</template>
<script lang="ts" setup>
import {} from "vue";
const props = defineProps<{ title: string }>();
</script>
<style scoped lang="scss">
.tit-line {
  position: relative;
  background-color: #fff;
  display: flex;
  position: relative;
  padding: 10px 0;
  color: #ccc;
  > span {
  }
  .line {
    flex: auto;
    height: 1px;
    background-color: #f1f1f1;
    transform: translateY(7px);
    margin-left: 6px;
  }
}
</style>
