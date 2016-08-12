// #PACKAGE: ikepler-admin-system-config
// #MODULE: SystemConfig
/**-----------------*
 *  SYSTEM CONFIG
 *==================*/
$(function () {
  var notify;
  var url = {
    list: iNet.getUrl('admin/sysconfs/fvisible'),
    update: iNet.getUrl('admin/sysconfs/update')
  };
  var MAX_SIZE_UPLOAD = 'max_size_upload';
  var MESSAGE_TIME_OUT = 'message_time_out';
  var INT_KEYS = [MAX_SIZE_UPLOAD, MESSAGE_TIME_OUT, 'item_per_page', 'number_day_of_process_ed', 'exchange_max_error_transfer'];
  var BOOLEAN_KEYS = ['delete_processing_ed', 'automatic_select_book_when_create_ed', 'submit_when_draft_ratified', 'uniform_book_and_sign_number',
    'administrator_of_this_unit_receive_comm_ed_of_other_unit', 'continue_process_when_administrator_transfer_ed', 'inbook_report_find_last_main_processor',
    'hide_time_when_transfer_ed','filter_one_main_processor_on_ed', 'choose_one_main_processor_on_ed'];
  var DATE_KEYS = ['system_startup_date'];
  var dataSource = new DataSource({
    columns: [{
      label: 'STT',
      type: 'rownumber',
      align: 'center',
      width: 40,
      cls: 'hidden-320'
    }, {
      property: 'description',
      label: iNet.resources.ikepler.admin.config.desc_field,
      sortable: true,
      width: 300,
      type: 'label'
    }, {
      property: 'value',
      label: iNet.resources.ikepler.admin.config.value_field,
      sortable: true,
      type: 'text',
      renderer: function (v, data) {
        var __data = data || {};
        switch (__data.key) {
          case MAX_SIZE_UPLOAD:
            return parseInt(Number(v) / 1024 / 1024);
          case MESSAGE_TIME_OUT:
            return (Number(v) / 1000);
          default:
            return v;
        }
      }

    }, {
      label: '',
      type: 'action',
      separate: '&nbsp;',
      align: 'center',
      buttons: [{
        text: iNet.resources.message.button.edit,
        icon: 'icon-pencil',
        fn: function (record) {
          grid.edit(record.uuid);
        }
      }]
    }]
  });
  var grid = new iNet.ui.grid.Grid({
    id: 'system-config-grid-id',
    url: url.list,
    dataSource: dataSource,
    idProperty: 'uuid',
    pageSize: iNet.pageSize
  });

  var showMessage = function (type, title, content) {
    if (!notify) {
      notify = new iNet.ui.form.Notify({
        delay: 4000
      });
    }
    notify.setType(type || 'error');
    notify.setTitle(title || '');
    notify.setContent(content || '');
    notify.show();
  };

  var getValue = function (data) {
    var __data = data || {};
    var __value = __data.value;
    switch (__data.key) {
      case MAX_SIZE_UPLOAD:
        return parseInt(Number(__value) * 1024 * 1024);
      case MESSAGE_TIME_OUT:
        return (Number(__value) * 1000);
      default:
        return __value;
    }
  };


  grid.on('update', function (data, odata) {
    var __data = data || {};
    var __odata = odata || {};
    var __key = __odata.key;
    var datePattern = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4})$/;
    if (INT_KEYS.indexOf(__key) > -1 && !iNet.isNumber(Number(__data.value))) {
      showMessage('error', 'Lỗi cấu hình', 'Dữ liệu phải có giá trị là kiểu số nguyên');
      return;
    } else if (BOOLEAN_KEYS.indexOf(__key) > -1 && !(__data.value=='true' || __data.value=='false')) {
      showMessage('error', 'Lỗi cấu hình', 'Dữ liệu phải có giá trị là <b>true</b> hoặc <b>false</b>');
      return;
    } else if (DATE_KEYS.indexOf(__key) > -1 && !datePattern.test(__data.value)) {
      showMessage('error', 'Lỗi cấu hình', 'Dữ liệu phải có giá trị là định dạng dd/mm/yyyy (ngày/tháng/năm)');
      return;
    }

    __data.key = __key;
    __data = {uuid: __data.uuid, value: getValue(__data)};

    $.postJSON(url.update, __data, function (result) {
      var __result = result || {};
      var __ndata = iNet.apply(__odata,__result);
      grid.update(__ndata);
      grid.commit();
    }, {mask: grid.getMask(), msg: iNet.resources.ajaxLoading.saving});
  });
});