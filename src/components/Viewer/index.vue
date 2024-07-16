<!--
 * @Descripttion: 
 * @Author: Wang Xi
 * @version: 
 * @Date: 2024-07-07 18:39:40
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-12 22:38:10
-->
<template>
  <el-card class="viewer_container" v-bind="$attrs">
    <template #header v-if="$slot?.header">
      <slot name="header"></slot>
    </template>
    <slot></slot>
    <template #footer v-if="$slot?.footer">
      <slot name="footer"></slot>
    </template>
  </el-card>
</template>

<script lang="ts" setup>
import { useSlots } from "vue";
const $slot = useSlots();
console.log($slot);
</script>
<style scoped lang="scss">
.viewer_container {
  height: 100%;
  display: flex;
  flex-direction: column;
  :deep(.el-card__header) {
    display: flex;
    align-items: center;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  :deep(.el-card__body) {
    flex: 1;
    height: 0;
  }
}
</style>
