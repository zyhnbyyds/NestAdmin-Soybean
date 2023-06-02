<template>
  <n-modal v-model:show="modalVisible" preset="card" :title="title" class="w-700px">
    <n-form ref="formRef" label-placement="left" :label-width="80" :model="formModel" :rules="rules">
      <n-grid :cols="24" :x-gap="18">
        <n-form-item-grid-item :span="12" label="用户名" path="userName">
          <n-input v-model:value="formModel.userName" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="密码" path="password">
          <n-input v-model:value="formModel.password" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="手机号" path="phone">
          <n-input v-model:value="formModel.phone" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="邮箱" path="email">
          <n-input v-model:value="formModel.email" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="状态" path="status">
          <n-select v-model:value="formModel.status" :options="userStatusOptions" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="昵称" path="nickName">
          <n-input v-model:value="formModel.nickName" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="头像" path="avatar">
          <n-input v-model:value="formModel.avatar" />
        </n-form-item-grid-item>
        <n-form-item-grid-item :span="12" label="角色" path="roleId">
          <n-select
            v-model:value="formModel.roleId"
            label-field="roleName"
            value-field="id"
            :options="roleList ? roleList : []"
          />
        </n-form-item-grid-item>
      </n-grid>
      <n-space class="w-full pt-16px" :size="24" justify="end">
        <n-button class="w-72px" @click="closeModal">取消</n-button>
        <n-button class="w-72px" type="primary" @click="handleSubmit">确定</n-button>
      </n-space>
    </n-form>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch } from 'vue';
import type { FormInst, FormItemRule } from 'naive-ui';
import { fetchAddUser, fetchEditUser, fetchGetRoleList } from '@/service';
import { formRules, createRequiredFormRule } from '@/utils';
import { userStatusOptions } from '@/constants';

export interface Props {
  /** 弹窗可见性 */
  visible: boolean;
  /**
   * 弹窗类型
   * add: 新增
   * edit: 编辑
   */
  type?: 'add' | 'edit';
  /** 编辑的表格行数据 */
  editData?: UserManagement.User | null;
}

export type ModalType = NonNullable<Props['type']>;

defineOptions({ name: 'TableActionModal' });

const props = withDefaults(defineProps<Props>(), {
  type: 'add',
  editData: null
});

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'update:table'): void;
}

const emit = defineEmits<Emits>();

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(visible) {
    emit('update:visible', visible);
  }
});
const closeModal = () => {
  modalVisible.value = false;
};

const title = computed(() => {
  const titles: Record<ModalType, string> = {
    add: '添加用户',
    edit: '编辑用户'
  };
  return titles[props.type];
});

const formRef = ref<HTMLElement & FormInst>();

type FormModel = Pick<
  UserManagement.User,
  'userName' | 'phone' | 'email' | 'status' | 'nickName' | 'avatar' | 'password' | 'roleId'
>;
type EditFormModel = TypeUtil.Merge<FormModel, { id: number }>;

const roleList = ref<ApiRole.Role[] | null>(null);

const formModel = reactive<FormModel | EditFormModel>(createDefaultFormModel());

const rules: Record<keyof FormModel, FormItemRule | FormItemRule[]> = {
  userName: createRequiredFormRule('请输入用户名'),
  phone: formRules.phone,
  email: formRules.email,
  status: createRequiredFormRule('请选择用户状态'),
  nickName: [
    {
      required: false
    }
  ],
  avatar: [
    {
      required: false
    }
  ],
  password: createRequiredFormRule('请输入密码'),
  roleId: createRequiredFormRule('请未用分配角色')
};

function createDefaultFormModel(): FormModel {
  return {
    userName: '',
    phone: '',
    email: null,
    status: 1,
    nickName: '',
    avatar: '',
    password: '',
    roleId: roleList.value ? roleList.value[0].id : 0
  };
}

function handleUpdateFormModel(model: Partial<FormModel>) {
  Object.assign(formModel, model);
}

function handleUpdateFormModelByModalType() {
  const handlers: Record<ModalType, () => void> = {
    add: () => {
      const defaultFormModel = createDefaultFormModel();
      handleUpdateFormModel(defaultFormModel);
    },
    edit: () => {
      if (props.editData) {
        handleUpdateFormModel(props.editData);
      }
    }
  };

  handlers[props.type]();
}

async function handleSubmit() {
  await formRef.value?.validate();
  if (props.type === 'add') {
    const { error } = await fetchAddUser<FormModel>(formModel);
    if (!error) {
      window.$message?.success('新增成功!');
      emit('update:table');
      closeModal();
    }
  } else if (props.type === 'edit') {
    const { error } = await fetchEditUser<EditFormModel>(formModel as EditFormModel);
    if (!error) {
      window.$message?.success('修改成功!');
      emit('update:table');
      closeModal();
    }
  }
}

async function getRoleList() {
  const { data, error } = await fetchGetRoleList();
  if (!error && data) {
    roleList.value = data.list;
  }
}

watch(
  () => props.visible,
  async newValue => {
    if (newValue) {
      // 避免重复的网络请求
      if (roleList.value === null) {
        getRoleList();
      }
      handleUpdateFormModelByModalType();
    }
  }
);
</script>

<style scoped></style>
