<template>
  <n-card title="用户管理" :bordered="false" class="rounded-16px shadow-sm">
    <n-space class="pb-12px" justify="space-between">
      <n-space>
        <n-button type="primary" @click="handleAddTable">
          <icon-ic-round-plus class="mr-4px text-20px" />
          新增
        </n-button>
        <n-popconfirm positive-text="确认" negative-text="取消" @positive-click="handleDeleteUserMany">
          <template #trigger>
            <n-button :disabled="checkRowKeys.length === 0" type="error">
              <icon-ic-round-delete class="mr-4px text-20px" />
              删除
            </n-button>
          </template>
          确认删除多个用户吗？
        </n-popconfirm>

        <n-button type="success">
          <icon-uil:export class="mr-4px text-20px" />
          导出Excel
        </n-button>
      </n-space>
      <n-space align="center" :size="18">
        <n-button size="small" type="primary" @click="getTableData">
          <icon-mdi-refresh class="mr-4px text-16px" :class="{ 'animate-spin': loading }" />
          刷新表格
        </n-button>
        <column-setting v-model:columns="columns" />
      </n-space>
    </n-space>
    <n-data-table
      :row-key="(row: UserManagement.User) => row.id"
      :columns="columns"
      :data="tableData"
      :loading="loading"
      :pagination="pagination"
      @update-checked-row-keys="handleCheckedKeysChange"
    />
    <table-action-modal
      v-model:visible="visible"
      :type="modalType"
      :edit-data="editData"
      @update:table="getTableData"
    />
  </n-card>
</template>

<script setup lang="tsx">
import { reactive, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag } from 'naive-ui';
import type { DataTableColumns, PaginationProps } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetUserList, fetchDeleteUser, fetchDeleteUserMany } from '@/service';
import { useBoolean, useLoading } from '@/hooks';
import { userStatusLabels } from '@/constants';
import TableActionModal from './components/TableActionModal.vue';
import type { ModalType } from './components/TableActionModal.vue';
import ColumnSetting from './components/ColumnSetting.vue';

const { loading, startLoading, endLoading } = useLoading(false);
const { bool: visible, setTrue: openModal } = useBoolean();

const tableData = ref<UserManagement.User[]>([]);

const pagination: PaginationProps = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageCount: 0,
  pageSizes: [10, 15, 20, 25, 30],
  onChange: (page: number) => {
    pagination.page = page;
    getTableData();
  },
  onUpdatePageSize: (pageSize: number) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    getTableData();
  }
});

const checkRowKeys = ref<number[]>([]);

function setTableData(data: UserManagement.User[]) {
  tableData.value = data;
}

async function getTableData() {
  startLoading();
  const { data } = await fetchGetUserList({
    pageNum: pagination.page as number,
    pageSize: pagination.pageSize as number
  });
  if (data) {
    // eslint-disable-next-line require-atomic-updates
    pagination.pageCount = data.count as number;
    setTableData(data.list);
    endLoading();
  }
}

const columns: Ref<DataTableColumns<UserManagement.User>> = ref([
  {
    type: 'selection',
    align: 'center'
  },
  {
    key: 'userName',
    title: '用户名',
    align: 'center'
  },
  {
    key: 'role',
    title: '角色名',
    align: 'center',
    render: row => {
      return <NTag type={'primary'}>{row.role.roleName}</NTag>;
    }
  },
  {
    key: 'phone',
    title: '手机号码',
    align: 'center'
  },
  {
    key: 'email',
    title: '邮箱',
    align: 'center'
  },
  {
    key: 'userStatus',
    title: '状态',
    align: 'center',
    render: row => {
      if (row.status !== null) {
        const tagTypes: Record<UserManagement.UserStatusKey, NaiveUI.ThemeColor> = {
          0: 'error',
          1: 'primary'
        };
        return <NTag type={tagTypes[row.status]}>{userStatusLabels[row.status]}</NTag>;
      }
      return <span></span>;
    }
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center',
    render: row => {
      return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    key: 'actions',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type={'primary'} onClick={() => handleEditTable(row.id)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteTable(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton size={'small'} type={'warning'}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
]) as Ref<DataTableColumns<UserManagement.User>>;

const modalType = ref<ModalType>('add');

function setModalType(type: ModalType) {
  modalType.value = type;
}

const editData = ref<UserManagement.User | null>(null);

function setEditData(data: UserManagement.User | null) {
  editData.value = data;
}

function handleAddTable() {
  setModalType('add');
  openModal();
}

function handleEditTable(rowId: number) {
  const findItem = tableData.value.find(item => item.id === rowId);
  if (findItem) {
    setEditData(findItem);
  }
  setModalType('edit');
  openModal();
}

async function handleDeleteTable(rowId: number) {
  const { error } = await fetchDeleteUser(rowId);
  if (!error) {
    window.$message?.success('删除成功~');
    getTableData();
  }
}

function handleCheckedKeysChange(e: unknown[]) {
  checkRowKeys.value = e as number[];
}

/** 删除多个用户 */
async function handleDeleteUserMany() {
  const { error } = await fetchDeleteUserMany(checkRowKeys.value);
  if (!error) {
    window.$message?.success('成功删除~');
    getTableData();
  }
  return true;
}

function init() {
  getTableData();
}

// 初始化
init();
</script>

<style scoped></style>
