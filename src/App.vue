<template>
  <div class="box">
    <div class="box-left"></div>
    <div class="box-center"></div>
    <div class="box-right"></div>
  </div>
</template>

<script lang="ts" setup>
import { useStore } from './stores'

const store = useStore()

// 使用请求数据方法
store.getList()
</script>

<style lang="less">
.box {
  height: 100%;
  overflow: hidden;

  display: flex;
  &-left {
    width: 400px;
  }
  &-center {
    flex: 1;
  }
  &-right {
    width: 400px;
  }
}
</style>
