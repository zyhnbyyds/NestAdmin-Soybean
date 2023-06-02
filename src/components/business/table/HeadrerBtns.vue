<template>
  <n-space class="pb-12px" justify="space-between">
    <n-space>
      <n-button type="primary" @click="emits('addFn')">
        <icon-ic-round-plus class="mr-4px text-20px" />
        新增
      </n-button>
      <n-button type="error" @click="emits('delMutiFn')">
        <icon-ic-round-delete class="mr-4px text-20px" />
        删除
      </n-button>
      <n-button type="success">
        <icon-uil:export class="mr-4px text-20px" />
        导出Excel
      </n-button>
      <slot name="front"></slot>
    </n-space>
    <n-space align="center" :size="18">
      <n-button size="small" type="primary" @click="emits('refresh')">
        <icon-mdi-refresh class="mr-4px text-16px" />
        刷新表格
      </n-button>
      <slot name="back"></slot>
      <!-- <column-setting v-model:columns="columns" /> -->
    </n-space>
  </n-space>
</template>

<script lang="ts" setup>
interface Emits {
  (e: 'addFn'): void;
  (e: 'delMutiFn'): void;
  (e: 'exportExcel'): void;
  (e: 'refresh'): void;
}

const emits = defineEmits<Emits>();
</script>
<style scoped></style>
