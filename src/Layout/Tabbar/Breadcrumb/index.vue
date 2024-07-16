<!--
 * @Descripttion: 
 * @Author: Wang Xi
 * @version: 
 * @Date: 2024-06-05 22:32:25
 * @LastEditors: Wang Xi
 * @LastEditTime: 2024-07-07 15:53:57
-->
<template>
  <el-breadcrumb class="breadcrumb_container" separator="/">
    <template
      v-if="$route.matched[0].children && $route.matched[0].children.length > 1"
    >
      <template v-for="item in $route.matched" :key="item.path">
        <el-breadcrumb-item :to="{ path: item.path }">
          <el-icon size="16">
            <component :is="item.meta?.icon"></component>
          </el-icon>

          {{ item.meta.title }}
        </el-breadcrumb-item>
      </template>
    </template>
    <template v-else>
      <el-breadcrumb-item :to="{ path: $route.matched[0].children[0].path }">
        <el-icon size="16">
          <component :is="$route.matched[0].children[0].meta?.icon"></component>
        </el-icon>
        {{ $route.matched[0].children[0].meta?.title }}
      </el-breadcrumb-item>
    </template>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const $route = useRoute();
</script>
<style scoped lang="scss">
.breadcrumb_container {
  ::v-deep .el-breadcrumb__inner {
    .el-icon {
      vertical-align: top;
    }
  }
}
</style>
