<template>
  <n-card title="路由管理" :bordered="false" class="rounded-16px shadow-sm">
    <n-button type="primary" size="medium" class="mb-15px" @click="handleAddRoute(0)">添加路由</n-button>
    <n-data-table
      :columns="columns"
      :loading="loading"
      :row-key="(row: any) => row.id"
      striped
      :data="routers?.routes"
    />
    <ModalTable
      v-model:visible="visible"
      :click-id="clickId"
      :edit-data="editData"
      :route-list="routers"
      @update:table="getRoutes"
    ></ModalTable>
  </n-card>
</template>

<script setup lang="tsx">
import { h, ref } from 'vue';
import type { DataTableColumns } from 'naive-ui';
import { NTag, NButton, NSpace, NPopconfirm } from 'naive-ui';
import { cloneDeep, isEmpty } from 'lodash';
import dayjs from 'dayjs';
import { fetchDeleteRoute, fetchGetAllRoute } from '@/service';
import { useBoolean } from '@/hooks';
import ModalTable from './components/ModalTable.vue';

const routers = ref<RouteManagement.RouteRes | null>(null);

const { bool: loading, setBool: load } = useBoolean();
const { bool: visible, setTrue: openModal } = useBoolean();

const clickId = ref(0);
const editData = ref<RouteManagement.RemoteRoute | null>(null);

initData();

async function getRoutes() {
  load(true);
  const { data, error } = await fetchGetAllRoute();
  if (!error) {
    routers.value = data;
  }
  load(false);
}

function handleAddRoute(id: number) {
  clickId.value = id;
  editData.value = null;
  openModal();
}

function handleEditRoute(id: number, rowData: RouteManagement.RemoteRoute) {
  clickId.value = id;
  editData.value = cloneDeep(rowData);
  openModal();
}

async function handleDeleteRoute(id: number) {
  const { error } = await fetchDeleteRoute(id);
  if (!error) {
    getRoutes();
    window.$message?.success('删除成功');
  }
}

async function initData() {
  await getRoutes();
}

const columns: DataTableColumns<RouteManagement.RemoteRoute> = [
  {
    key: 'title',
    title: '路由标题',
    align: 'left',
    width: 200,
    render: row => {
      return row.meta.title;
    }
  },
  {
    key: 'icon',
    title: '图标',
    align: 'center',
    render: row => {
      return (
        <div class={'flex justify-center'}>
          <svg-icon
            class={'text-20px text-center'}
            icon={isEmpty(row.meta.icon) ? row.meta.localIcon : row.meta.icon}
          ></svg-icon>
        </div>
      );
    }
  },
  {
    key: 'order',
    title: '排序',
    align: 'center',
    render: row => {
      return row.meta.order;
    }
  },
  {
    key: 'type',
    title: '菜单类型',
    align: 'center',
    render: row => {
      // 策略模式执行
      const tagShowFn = (type: 'success' | 'info' | 'warning', showWord: string) => <NTag type={type}>{showWord}</NTag>;
      const menuType = {
        T: () => tagShowFn('success', '目录'),
        M: () => tagShowFn('info', '菜单'),
        B: () => tagShowFn('warning', '按钮')
      };
      return menuType[row.meta.type]();
    }
  },
  {
    key: 'apiPerms',
    title: '权限标识',
    align: 'center'
  },
  {
    key: 'name',
    title: '路由名称',
    align: 'center'
  },
  {
    key: 'path',
    title: '路由地址',
    align: 'center'
  },
  {
    key: 'hide',
    title: '状态',
    align: 'center',
    render: row => {
      if (row.meta.hide) {
        return h(NTag, { type: 'primary' }, { default: () => '隐藏' });
      }
      return h(NTag, { type: 'info' }, { default: () => '显示' });
    }
  },
  {
    key: 'createTime',
    title: '创建时间',
    align: 'center',
    render: (row: any) => {
      return dayjs(row.creteTime).format('YYYY-MM-DD  HH:mm:ss');
    }
  },
  {
    key: 'edit',
    title: '操作',
    align: 'center',
    width: 210,
    render: row => {
      return (
        <NSpace justify={'space-around'}>
          <NButton type={'primary'} size={'small'} onClick={() => handleEditRoute(row.id, row)}>
            编辑
          </NButton>
          <NButton type={'success'} size={'small'} onClick={() => handleAddRoute(row.id)}>
            新增
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDeleteRoute(row.id)}>
            {{
              default: () => '确认删除',
              trigger: () => (
                <NButton type={'warning'} size={'small'}>
                  删除
                </NButton>
              )
            }}
          </NPopconfirm>
        </NSpace>
      );
    }
  }
];
</script>

<style scoped></style>
