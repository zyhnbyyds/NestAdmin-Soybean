<template>
  <n-modal v-model:show="modalVisible" transform-origin="center" class="w-600px mt-150px">
    <n-card :title="props.editData ? '编辑路由' : '新增路由'">
      <n-form ref="formRef" :model="menuFormModel" label-width="80" :inline="false" label-placement="left">
        <n-grid :cols="2" :x-gap="18">
          <n-form-item-grid-item :span="2" label="上层路由" path="title">
            <n-tree-select
              v-model:value="treeSelectId"
              :default-value="props.editData ? props.editData.parentId : 0"
              :render-label="
                row => [
                  h('span', { class: 'font-bold' }, { default: () => row.option.label }),
                  h(
                    'span',
                    { class: 'font-bold text-[#888]' },
                    { default: () => (row.option.children ? ` (${row.option.children?.length})` : '') }
                  )
                ]
              "
              :options="routeTreeData"
            />
          </n-form-item-grid-item>
          <n-form-item-grid-item :span="2" label="菜单类型" path="type">
            <n-radio-group v-model:value="menuFormModel.type" name="radiogroup">
              <n-space>
                <n-radio key="T" value="T">目录</n-radio>
                <n-radio key="M" value="M">菜单</n-radio>
                <n-radio key="B" value="B">按钮</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="menuFormModel.type !== 'B'" :span="2" label="图标" path="icon">
            <icon-select v-model:value="menuFormModel.icon" :icons="icons" />
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="menuFormModel.type !== 'B'" :span="2" label="组件布局" path="multiTab">
            <n-radio-group v-model:value="menuFormModel.component" name="comType">
              <n-space>
                <n-radio :key="0" value="basic">基础布局</n-radio>
                <n-radio :key="1" value="blank">空白布局</n-radio>
                <n-radio :key="2" value="multi">多级路由</n-radio>
                <n-radio :key="3" value="self">子路由布局</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-grid-item>
          <n-form-item-grid-item label="路由标题" path="title">
            <n-input v-model:value="menuFormModel.title" />
          </n-form-item-grid-item>
          <n-form-item-grid-item label="排序" path="order">
            <n-input-number v-model:value="menuFormModel.order" />
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="menuFormModel.type === 'M'" label="路由名称" path="name">
            <n-input v-model:value="menuFormModel.name" />
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="menuFormModel.type === 'M'" label="路由地址" path="path">
            <n-input v-model:value="menuFormModel.path" />
          </n-form-item-grid-item>
          <n-form-item-grid-item label="权限标识" path="apiPerms">
            <n-input v-model:value="menuFormModel.apiPerms" />
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="menuFormModel.type !== 'B'" label="状态" path="path">
            <n-radio-group v-model:value="menuFormModel.hide" name="radiogroup">
              <n-space>
                <n-radio :key="0" :value="false">显示</n-radio>
                <n-radio :key="1" :value="true">隐藏</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="menuFormModel.type === 'M'" label="单个tab" path="multiTab">
            <n-radio-group v-model:value="menuFormModel.multiTab" name="radioTab">
              <n-space>
                <n-radio :key="0" :value="true">是</n-radio>
                <n-radio :key="1" :value="false">否</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-grid-item>
          <n-form-item-grid-item v-if="menuFormModel.type === 'M'" label="缓存" path="multiTab">
            <n-radio-group v-model:value="menuFormModel.keepAlive" name="radioCache">
              <n-space>
                <n-radio :key="0" :value="true">开启</n-radio>
                <n-radio :key="1" :value="false">关闭</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item-grid-item>
        </n-grid>
      </n-form>
      <n-space justify="end" class="w-full">
        <n-button type="primary" @click="hanldeConfig">确认</n-button>
        <n-button @click="modalVisible = false">取消</n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
import { computed, reactive, watch, h, ref } from 'vue';
import { fetchAddRoute, fetchEditRoute } from '~/src/service';
import { transformRoutesToTreeOptions } from '~/src/utils';
import { icons } from '~/src/views/plugin/icon/icons';

const menuFormModel = reactive<RouteManagement.AddRouteParams>(resetFormData());

interface Props {
  clickId: number;
  editData?: RouteManagement.RemoteRoute | null;
  visible: boolean;
  routeList: RouteManagement.RouteRes | null;
}

interface Emits {
  (e: 'update:visible', visible: boolean): void;
  (e: 'update:table'): void;
}

const emit = defineEmits<Emits>();
const treeSelectId = ref(0);

const props = withDefaults(defineProps<Props>(), {
  clickId: 0,
  editData: null
});

const modalVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

watch(
  () => props.clickId,
  newVal => {
    if (props.editData) {
      treeSelectId.value = props.editData.parentId;
    } else {
      treeSelectId.value = newVal;
    }
  }
);

watch(modalVisible, newValue => {
  if (newValue) {
    if (props.editData) {
      Object.assign(Object.assign(menuFormModel, props.editData.meta), props.editData);
    } else {
      Object.assign(menuFormModel, resetFormData());
    }
  }
});

// 处理接口数据为treeSelect数据
const routeTreeData = computed(() => {
  if (!props.routeList) return undefined;
  // 加上根目录
  const routeListTran = {
    label: '根目录',
    key: 0,
    children: transformRoutesToTreeOptions(props.routeList.routes)
  };
  return [routeListTran];
});

/** 点击进行添加和编辑的api操作 */
async function hanldeConfig() {
  if (!props.editData) {
    Reflect.deleteProperty(menuFormModel, 'id');
    menuFormModel.parentId = props.clickId;
    const { error } = await fetchAddRoute(menuFormModel);
    if (!error) {
      window.$message?.success('添加成功');
      modalVisible.value = false;
    }
  } else {
    const editFormModel: RouteManagement.EditRouteParams = {
      ...menuFormModel,
      id: props.clickId
    };
    const { error } = await fetchEditRoute(editFormModel);
    if (!error) {
      window.$message?.success('修改成功');
      modalVisible.value = false;
    }
  }
  emit('update:table');
  return true;
}

function resetFormData(): RouteManagement.AddRouteParams {
  return {
    name: '',
    path: '',
    component: 'basic',
    hide: false,
    href: '',
    keepAlive: true,
    multiTab: false,
    affix: false,
    order: 0,
    title: '',
    icon: '',
    localIcon: '',
    singleLayout: 'basic',
    requiresAuth: true,
    parentId: 0,
    type: 'T',
    apiPerms: ''
  };
}
</script>
<style scoped>
:deep(.n-form-item-label__text) {
  font-weight: bold;
}
</style>
