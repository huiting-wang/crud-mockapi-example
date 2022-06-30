import $ from 'jquery';
import { assign } from './lib';

export default {
  // 更新 TableCRUD 實例
  updateOptions(updateOpt = {}) {
    this.init(updateOpt);
  },
  // 動態設置 TableCRUD 選項參數
  setOptions(setOpt = {}) {
    const { options } = this;
    const currentOptions = assign(
      {},
      options,
      $.isPlainObject(setOpt) && setOpt
    );

    this.updateOptions(currentOptions);
  },
  // 新增欄位資料
  addData(data = {}) {
    const { saveData, options } = this;

    saveData.push(data);
    // 更新資料
    this.refetchTable(saveData);
    // 重新綁定事件
    this.bindEvents(options);
  },
  // 更新單筆欄位資料
  updateData(data = {}) {
    const { saveData, options } = this;
    const indexID = saveData.findIndex((item) => item.id === data.id);

    saveData[indexID].name = data.name;
    saveData[indexID].email = data.email;
    saveData[indexID].phone = data.phone;

    // 更新資料
    this.refetchTable(saveData);
    // 重新綁定事件
    this.bindEvents(options);
  },
  // 刪除單筆欄位資料
  removeDataByID(id) {
    const { saveData, options } = this;

    saveData.forEach((obj, i) => {
      if (obj.id === id) {
        saveData.splice(i, 1);
      }
    });

    // 更新資料
    this.refetchTable(saveData);
    // 重新綁定事件
    this.bindEvents(options);
  },
  // 打開彈窗
  openEditDialog(options = {}) {
    this.showEditDialog(options);
  },
};
