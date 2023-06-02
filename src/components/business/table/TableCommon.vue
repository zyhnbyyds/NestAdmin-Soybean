<template>
  <n-card :title="props.cardTitle" :bordered="false" class="rounded-16px shadow-sm">
    <HeadrerBtns @refresh="refreshTable" @add-fn="handleAddFn">
      <template #front>
        <slot name="frontCom"></slot>
      </template>
      <template #back>
        <slot name="backCom"></slot>
      </template>
    </HeadrerBtns>
    <n-data-table
      :row-key="props.rowKey"
      :loading="loading"
      :columns="props.cloumns"
      :data="tableData"
      :bordered="false"
    />
  </n-card>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import type { UseTableApiRes } from '~/src/hooks/business/useTableApi';

interface Props {
  cardTitle: string;
  cloumns: DataTableColumns<any>;
  rowKey: (args: any) => any;
}

interface Emits {
  (e: 'addBtnClick'): void;
}

const emits = defineEmits<Emits>();

const props = defineProps<Props>();

const { refreshTable, loading, tableData } = inject<UseTableApiRes>('apiRes') as UseTableApiRes;

function handleAddFn() {
  emits('addBtnClick');
}

function init() {
  refreshTable();
}

init();
</script>
<style scoped></style>
