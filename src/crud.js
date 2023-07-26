import $ from 'jquery';
import BootstrapDialog from 'bootstrap4-dialog';
import { tmpl, assign } from './lib';
import DEFAULTS from './default';
import methods from './methods';
import DIALOGTMP from './templates';

class TableCRUD {
  /**
   * TableCRUD 建構子
   * @param {Element} element - 指定渲染的DOM
   * @param {Object} [options={}] - 覆寫的選項參數
   */
  constructor(element, options = {}) {
    this.element = element;
    // 合併初始選項參數 (options 變更)
    this.options = assign({}, DEFAULTS, $.isPlainObject(options) && options);
    // 儲存當下的資料
    this.saveData = [];
    // 執行初始化
    this.init(this.options);
  }

  /**
   * 初始化 TableCRUD 實例
   * @param {Object} [options={}] - 變更的選項參數
   */
  init(options = {}) {
    this.options = options;
    this.saveData = options.data;
    this.refetchTable(options.data);
    this.bindEvents(options);
  }

  /**
   * 重新渲染 Table
   * @param {Array} [data=[]] - 欄位資料
   */
  refetchTable(data = []) {
    const { element } = this;

    $(element).empty();

    if (data?.length > 0) {
      $.each(data, (key, item) => {
        const row = $('<tr></tr>');

        row.append($(`<td style="width:5%;"></td>`).html(item.id));
        row.append($(`<td style="width:20%;"></td>`).html(item.name));
        row.append($(`<td style="width:10%;"></td>`).html(item.email));
        row.append($(`<td style="width:20%;"></td>`).html(item.phone));
        row.append($(`<td style="width:10%;"></td>`).html(item.date));
        row.append(
          $(
            `<td style="width:20%;" data-id="${item.id}"><a class="btn btn-success edit-btn">Edit</a> | <a class="btn btn-danger delete-btn">Delete</a></td>`
          )
        );

        $(element).append(row);
      });
    } else {
      const row = $('<tr></tr>');
      row.append($(`<td colspan="6"></td>`).html('no data'));
      $(element).append(row);
    }
  }

  /**
   * 綁定事件
   * @param {Object} [options={}] - 變更的選項參數
   */
  bindEvents(options = {}) {
    $('.edit-btn').on('click', (event) => {
      const ele = $(event.target).parent();
      const dataID = $(event.target).parent().data('id');
      let rowData = {};

      $.each(options.data, (index, data) => {
        if (parseInt(dataID, 10) === parseInt(data.id, 10)) {
          rowData = {
            id: data.id,
            name: data.name,
            email: data.email,
            phone: data.phone,
            date: data.date,
          };
        }
      });

      if ($.isFunction(options.onEdit)) {
        options.onEdit(ele, rowData);
      }
    });

    $('.delete-btn').on('click', (event) => {
      const dataID = $(event.target).parent().data('id');

      if ($.isFunction(options.onDelete)) {
        options.onDelete(dataID);
      }
    });
  }

  /**
   * 開啟編輯彈窗
   * @param {Object} [options={}] - The dialog options.
   */
  showEditDialog(options = {}) {
    const DIALOGDEFAULT = {
      // 操作模式: add|edit
      mode: 'add',
      // 標題
      title: '',
      // 表單資料
      formData: {
        id: '',
        name: '',
        email: '',
        phone: '',
      },
      // 儲存按鈕的callback
      onSave: null,
    };

    const newOpt = assign(
      {},
      DIALOGDEFAULT,
      $.isPlainObject(options) && options
    );

    /**
     * 使用 BootstrapDialog 套件
     *
     * @see https://nakupanda.github.io/bootstrap3-dialog/
     */
    BootstrapDialog.show({
      title: newOpt.title,
      buttons: [
        {
          id: 'close',
          label: 'Close',
          cssClass: 'btn-light',
          action(dialog) {
            dialog.close();
          },
        },
        {
          id: 'save',
          label: 'Save',
          cssClass: 'btn-primary',
          action(dialog) {
            if ($.isFunction(newOpt.onSave)) {
              const formData = {
                id: dialog.initSelector.$id.val(),
                name: dialog.initSelector.$name.val(),
                email: dialog.initSelector.$email.val(),
                phone: dialog.initSelector.$phone.val(),
              };

              newOpt.onSave(dialog, formData);
            }

            dialog.close();
          },
        },
      ],
      onshow(dialog) {
        const modalBody = dialog.getModalBody();

        // 建立彈窗內容表單樣板
        dialog.templateForm = tmpl(DIALOGTMP);

        dialog.initSelector = {
          $id: dialog.templateForm.find('#uid'),
          $name: dialog.templateForm.find('#name'),
          $email: dialog.templateForm.find('#email'),
          $phone: dialog.templateForm.find('#phone'),
        };

        if (newOpt.mode === 'add') {
          dialog.initSelector.$id.val('');
          dialog.initSelector.$name.val('');
          dialog.initSelector.$email.val('');
          dialog.initSelector.$phone.val('');
        } else {
          dialog.initSelector.$id.val(newOpt.formData.id);
          dialog.initSelector.$name.val(newOpt.formData.name);
          dialog.initSelector.$email.val(newOpt.formData.email);
          dialog.initSelector.$phone.val(newOpt.formData.phone);
        }

        modalBody.append(dialog.templateForm);
      },
    });
  }
}

// 合併對外方法 (Methods)
assign(TableCRUD.prototype, methods);

export default TableCRUD;
