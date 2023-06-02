import type { Ref } from 'vue';
import { reactive, ref } from 'vue';
import { useBoolean } from '@/hooks';

type ApiFn<T, P> = (args: P) => Promise<Service.RequestResult<T>>;

export interface UseTableApiRes<T = any, A = any, E = any, D = any> {
  tableData: Ref<T | undefined>;
  refreshTable: () => Promise<void>;
  addAct: ApiFn<any, A>;
  editAct: ApiFn<any, E>;
  deleteAct: ApiFn<any, D>;
  modalStatus: (args: boolean) => void;
  modalVisible: Ref<boolean>;
  loadStatus: (args: boolean) => void;
  loading: Ref<boolean>;
}

interface Options<P> {
  /** 添加成功的提示 */
  addSuccessMsg?: string;
  /** 编辑~ */
  editSuccessMsg?: string;
  /** 删除~ */
  delSuccessMsg?: string;
  /** 获取table数据的参数 */
  getTableDataParams: P;
}

/**
 * table传参
 * @type T table表格的格式限定
 * @type G 查询table的参数类型
 * @type A 添加接口~
 * @type E 编辑接口~
 * @type D 删除接口~
 */
interface TableParams<T = any, G = ApiCommon.SearchQuery, A = any, E = any, D = any> {
  getTableApi: ApiFn<ApiCommon.DataRes<T>, G>;
  addTableApi: ApiFn<any, A>;
  editTableApi: ApiFn<any, E>;
  deleteTableApi: ApiFn<any, D>;
  options?: Options<G>;
}

/**
 * table表单api的hooks简化操作函数
 * @type T table表格的格式限定
 * @type G 查询table的参数类型
 * @type A 添加接口~
 * @type E 编辑接口~
 * @type D 删除接口~
 * @params 生成时的传参
 */
export default function useTableApi<T, G, A, E, D>(params: TableParams<T, G, A, E, D>) {
  const { getTableApi, addTableApi, editTableApi, deleteTableApi, options } = params;

  const { bool: modalVisible, setBool: modalStatus } = useBoolean(false);
  const { bool: loading, setBool: loadStatus } = useBoolean(false);

  const tableData = ref<T>();

  const searchQuery = reactive<ApiCommon.SearchQuery>({
    pageNum: 1,
    pageSize: 10
  });

  const getTableParams = Object.assign(searchQuery, options?.getTableDataParams);

  const refreshTable = async () => {
    loadStatus(true);
    const { data, error } = await getTableApi(getTableParams);
    if (error) return;
    if (data) {
      tableData.value = data.list;
    }
    loadStatus(false);
  };

  const addAct = async (args: A) => {
    const { error, data } = await addTableApi(args);
    if (!error) {
      refreshTable();
      window.$message?.success(options?.addSuccessMsg || '操作成功');
      modalStatus(false);
      return data;
    }
    return error;
  };

  const editAct = async (args: E) => {
    const { error, data } = await editTableApi(args);
    if (!error) {
      refreshTable();
      window.$message?.success(options?.editSuccessMsg || '操作成功');
      modalStatus(false);
      return data;
    }
    return error;
  };

  const deleteAct = async (args: D) => {
    const { error, data } = await deleteTableApi(args);
    if (!error) {
      refreshTable();
      window.$message?.success(options?.delSuccessMsg || '删除成功');
      modalStatus(false);
      return data;
    }
    return error;
  };

  return {
    tableData,
    refreshTable,
    addAct,
    editAct,
    deleteAct,
    modalStatus,
    modalVisible,
    loadStatus,
    loading
  };
}
