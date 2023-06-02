import { ref } from 'vue';
import { defineStore } from 'pinia';
import { useBoolean } from '~/src/hooks';

export const useTableCommonStore = defineStore('table-common-store', () => {
  const { bool: modalVisible, setTrue: openModal, setFalse: closeModal } = useBoolean();
  const { bool: addOrEdit, setBool: toDoAct } = useBoolean();

  const editData = ref<unknown>();

  return { modalVisible, addOrEdit, openModal, closeModal, toDoAct, editData };
});
