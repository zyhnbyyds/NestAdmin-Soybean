<template>
  <div class="h-full w-full">
    <TableCommon
      card-title="角色管理"
      :row-key="(row: ApiRole.Role) => row.id"
      :cloumns="cloumns"
      @add-btn-click="handleClickAdd"
    />
    <n-modal v-model:show="modalVisible" preset="card" :title="addOrEdit ? '添加角色' : '编辑角色'" class="w-500px">
      <n-form ref="formRef" :model="formModel" label-width="80" :inline="false" label-placement="left">
        <n-form-item label="角色名" path="roleName">
          <n-input v-model:value="formModel.roleName" placeholder="请输入角色名" />
        </n-form-item>
        <n-form-item label="角色key" path="roleKey">
          <n-input v-model:value="formModel.roleKey" placeholder="请输入角色key值(英文)" />
        </n-form-item>
        <n-form-item label="昵称" path="nickName">
          <n-input v-model:value="formModel.nickName" placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item label="权限分配" path="authDistribute">
          <div class="w-full">
            <div class="pb-10px h-34px leading-34px">
              <n-space>
                <n-checkbox v-model:checked="treeOptions.expendAll">展开/折叠</n-checkbox>
                <n-checkbox v-model:checked="treeOptions.allOrNot">全选</n-checkbox>
                <n-checkbox v-model:checked="treeOptions.childAndDad">父子联动</n-checkbox>
              </n-space>
            </div>
            <div class="border border-[#e5e5e5] w-full rounded-5px">
              <n-tree
                ref="treeRef"
                block-line
                :data="treeOriginData"
                key-field="id"
                label-field="title"
                :default-checked-keys="checkTreeIds"
                :cascade="treeOptions.childAndDad"
                :default-expand-all="treeOptions.expendAll"
                checkable
                expand-on-click
                selectable
              />
            </div>
          </div>
        </n-form-item>
        <n-form-item label="状态" path="status">
          <n-radio-group v-model:value="formModel.status" name="roleStatus">
            <n-space>
              <n-radio :key="1" :value="1"> 启用 </n-radio>
              <n-radio :key="0" :value="0"> 禁用 </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item>
          <n-space justify="end" class="w-full">
            <n-button type="primary" @click="handleConfig">确认</n-button>
            <n-button @click="res.modalStatus(false)">取消</n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>

<script setup lang="tsx">
import { provide, reactive, ref } from 'vue';
import type { DataTableColumns, TreeInst } from 'naive-ui';
import { NSpace, NButton, NPopconfirm } from 'naive-ui';
import { cloneDeep } from 'lodash-es';
import dayjs from 'dayjs';
import {
  fetchGetRoleList,
  fetchAddRole,
  fetchDeleteRole,
  fetchEditRole,
  fetchGetRoleMenuList,
  fetchGetAllRoute
} from '@/service';
import { useTableApi, useBoolean } from '~/src/hooks';

const { setTrue: addModalAct, setFalse: editModalAct, bool: addOrEdit } = useBoolean();
const formModel = ref<ApiRole.RoleEdit>(resetForm());
const treeRef = ref<TreeInst>();

const res = useTableApi<ApiRole.Role[], ApiCommon.SearchQuery, ApiRole.RoleAdd, ApiRole.RoleEdit, number>({
  addTableApi: fetchAddRole,
  editTableApi: fetchEditRole,
  getTableApi: fetchGetRoleList,
  deleteTableApi: fetchDeleteRole
});

const { modalStatus, addAct, editAct, modalVisible, deleteAct } = res;
const checkTreeIds = ref<number[]>([]);
const treeOriginData = ref<RouteManagement.RemoteRoute[]>([]);
const treeOptions = reactive({
  allOrNot: false,
  expendAll: false,
  childAndDad: true
});

provide('apiRes', res);

const cloumns: DataTableColumns<ApiRole.Role> = [
  {
    type: 'selection',
    align: 'center'
  },
  {
    key: 'id',
    align: 'center',
    title: '序号',
    render: (_row, index) => {
      return index + 1;
    }
  },
  {
    key: 'roleName',
    title: '角色名',
    align: 'center'
  },
  {
    key: 'nickName',
    title: '昵称',
    align: 'center'
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
    key: 'doSome',
    title: '操作',
    align: 'center',
    render: row => {
      return (
        <NSpace justify={'center'}>
          <NButton size={'small'} type={'primary'} onClick={() => handleClickEdit(row)}>
            编辑
          </NButton>
          <NPopconfirm onPositiveClick={() => deleteAct(row.id)}>
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
];

getMenusList();

async function handleClickEdit(row: ApiRole.Role) {
  editModalAct();
  await getAuthList(row.id);
  formModel.value = { ...cloneDeep(row), checkedKeys: [] };
  modalStatus(true);
}

function handleClickAdd() {
  addModalAct();
  formModel.value = resetForm();
  modalStatus(true);
}

function handleConfig() {
  if (addOrEdit.value) {
    addAct({
      ...formModel.value,
      checkedKeys: treeRef.value?.getCheckedData().keys ? (treeRef.value?.getCheckedData().keys as number[]) : []
    });
  } else {
    editAct({
      ...formModel.value,
      checkedKeys: treeRef.value?.getCheckedData().keys ? (treeRef.value?.getCheckedData().keys as number[]) : []
    });
  }
}

// id为0为删除操作
function resetForm(): ApiRole.RoleEdit {
  return {
    roleName: '',
    roleKey: '',
    nickName: '',
    status: 1,
    id: 0,
    checkedKeys: []
  };
}

async function getAuthList(roleId: number) {
  const { data, error } = await fetchGetRoleMenuList(roleId);
  if (!error && data) {
    checkTreeIds.value = data;
  }
}

async function getMenusList() {
  const { data, error } = await fetchGetAllRoute();
  if (!error && data) {
    treeOriginData.value = handleUpTitle(data?.routes);
  }
}

/** 提升title位置到一级对象 */
function handleUpTitle(authList: RouteManagement.RemoteRoute[]) {
  return authList.map(item => {
    item.title = item.meta.title;
    if (item.children && item.children.length !== 0) {
      item.children = handleUpTitle(item.children);
    }
    return item;
  });
}
</script>

<style scoped></style>
