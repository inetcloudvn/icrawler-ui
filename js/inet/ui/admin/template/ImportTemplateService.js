// #PACKAGE: ikepler-admin-import-template
// #MODULE: ImportTemplate
$(function() {
  var $toolbar = {
    CREATE: $('#import-template-btn-create'),
    SAVE: $('#import-template-btn-save')
  };
  var template = "";
  var url = {
    create: iNet.getUrl('report/template/create'),
    update: iNet.getUrl('report/template/update'),
    del: iNet.getUrl('report/template/delete'),
    load: iNet.getUrl('report/template/list')
  };
  // NOTIFY MESSAGE
  var notify = null;
  var showMessage = function(type, title, content) {
    if(!notify){
      notify = new iNet.ui.form.Notify({
        delay: iNet.delayMessage || 4000
      });
    }
    notify.setType(type);
    notify.setTitle(title);
    notify.setContent(content);
    notify.show();
  };
  var getText = function(text){
    if (!iNet.isEmpty(text) && iNet.resources.ikepler.admin.template) {
      return iNet.resources.ikepler.admin.template[text] || text;
    }
    return "";
  };
  var update = false;
  var fileStore = new Hashtable();
  var dataDel = new Hashtable();
  var file_format = '(xls)|(xlsx)|(doc)|(docx)';
  var file_maxsize = 1024;
  var isFile = true;
  var isMaxSize = true;
  var detectFile = function(filename){
    if (iNet.isEmpty(filename)) {
      return;
    }
    filename = filename.toLowerCase();
    var reg = new RegExp("^.*\\.(" + file_format + ")$");
    return reg.test(filename);
  };
  //var $fileContainer = $('#import-template-btn-file-upload');
  var $grid = $('#report-import-template-search-grid');
  var $frmSubmit = $('#import-template-frm');
  var $containerInputFile = $('#import-template-file');
  var $input = {
    application: $('#report-import-template-txt-application'),
    module: $('#report-import-template-txt-module'),
    name: $('#report-import-template-txt-name'),
    description: $('#report-import-template-txt-description'),
    file: $('#import-template-txt-file'),
    template: $('#import-template-value-template'),
    type:$('#report-import-template-cb-type')
  };
  var moduleObject = [{
    app: 'ikepler',
    value: 'edoc',
    text: getText("module_edoc")
  }];
  //============ DATA TYPE ==============//
  var dataType = [{
    module:'edoc',
    value: 'RP_ED_IN',
    text: getText("type_rp_ed_in")
  }, {
    module:'edoc',
    value: 'RP_ED_OUT',
    text: getText("type_rp_ed_out")
  }, {
    module:'edoc',
    value: 'RP_SPECIALIST',
    text: getText("type_rp_specialist")
  }, {
    module:'edoc',
    value: 'RP_PROCESS_ED_SITUATION',
    text: getText("type_rp_process_ed_situation")
  }, {
    module:'edoc',
    value: 'RP_OVERSEE_DEPARTMENT',
    text: getText("type_rp_oversee_department")
  }, {
    module:'edoc',
    value: 'RP_PUBLISH_DEPARTMENT',
    text: getText("type_rp_publish_department")
  }, {
    module:'edoc',
    value: 'RP_RECEIVE_SPECIALIST',
    text: getText("type_rp_receive_specialist")
  },{
    module:'task',
    value: 'RP_TASK_PROCESS',
    text: getText("type_rp_task_process")
  }, {
    module:'steering',
    value: 'RP_MEETING',
    text: getText("type_rp_meeting")
  }, {
    module:'steering',
    value: 'RP_STEERING_STATISTIC',
    text: 'Thống kê báo cáo'
  },{
    module:'steering',
    value: 'RP_STEERING_STATISTIC_DETAIL',
    text: 'Thống kê chi tiết'
  },{
    module:'submit',
    value: 'RP_SUBMIT_TASK',
    text: getText("type_rp_submit_task")
  }, {
    module:'edoc',
    value: 'RP_ED_LATED',
    text: getText("type_rp_ed_lated")
  }, {
    module:'edoc',
    value: 'RP_ED_SITUATION',
    text: getText("type_rp_ed_situation")
  }, {
    module:'edoc',
    value: 'RP_ED_SITUATION_STATISTIC',
    text: getText("type_rp_ed_situation_statistic")
  },{
    module:'edoc',
    value: 'RP_ED_RECOVERDAY',
    text: getText("Văn bản tiếp nhận vượt quá số ngày quy định")
  },{
    module:'edoc',
    value: 'RP_ED_PROPOSAL_DOCX',
    text: getText("Phiếu đề xuất")
  }, {
    module:'record',
    value: 'RP_RECORD_REP',
    text: getText("Báo cáo hồ sơ công việc")
  }];
  var fillDataToModule = function(datas) {
    var __datas = datas || [];
    $input.module.empty();
    for (var i = 0; i < __datas.length; i++) {
      var __data = __datas[i];
      $input.module.append(String.format('<option value="{0}" data-app="{1}">{2}</option>', __data.value, __data.app, __data.text));
    }
  };
  var fillDataToType = function(datas) {
    var __datas = datas || [];
    $input.type.empty();
    for (var i = 0; i < __datas.length; i++) {
      var __data = __datas[i] || {};
      $input.type.append(String.format('<option value="{0}" data-module="{1}">{2}</option>', __data.value, __data.module, __data.text));
    }
  };
  var fillTypeByModule = function(module, datas) {
    var __module = module || 'edoc';
    var __datas = datas || [];
    var __items = [];
    for (var i = 0; i < __datas.length; i++) {
      var __data = __datas[i];
      if (__data.module == __module) {
        __items.push(__data);
      }
    }
    fillDataToType(__items);
  };
  var findModuleByApp = function(app, datas) {
    var __app = app;
    var __datas = datas || [];
    
    var __items = [];
    for (var i = 0; i < __datas.length; i++) {
      var __data = __datas[i];
      if (__data.app == __app) {
        __items.push(__data);
      }
    }
    fillDataToModule(__items);
  };
  findModuleByApp('ikepler', moduleObject);
  fillTypeByModule('edoc',dataType);
  $input.module.change(function(){
    var __val = $(this).val();
    fillTypeByModule(__val,dataType);
  });
  
  var confirmFileDeleteDialog = new iNet.ui.dialog.ModalDialog({
    id: 'modal-confirm-file-delete',
    title: iNet.resources.message.button.del,
    content: getText("confirm_del"),
    buttons: [{
      text: iNet.resources.message.button.ok,
      cls: 'btn-primary',
      icon: 'icon-ok icon-white',
      fn: function() {
        var __dataDel = dataDel.get('dataDel');
        if (!iNet.isEmpty(__dataDel)) {
          var __data = {
            template: __dataDel.uuid,
            application: __dataDel.application,
            module: __dataDel.module
          };
          $.postJSON(url.del, __data, function(result) {
            grid.remove(__dataDel.uuid);
            dataDel.clear();
            confirmFileDeleteDialog.hide();
          }, {
            mask: this.getMask(),
            msg: iNet.resources.ajaxLoading.deleting
          });
        }
      }
    }, {
      text: iNet.resources.message.button.cancel,
      icon: 'icon-remove',
      fn: function() {
        this.hide();
      }
    }]
  });
  var dataSource = new DataSource({
    columns: [{
      label: 'STT',
      type: 'rownumber',
      align: 'center',
      width: 40,
      cls: 'hidden-320'
    }, {
      property: 'module',
      label: getText("module"),
      sortable: true,
      type: 'select',
      width: 200,
      valueField: 'value',
      displayField: 'text',
      editData: moduleObject
    }, {
      property: 'type',
      label: getText("type"),
      sortable: true,
      type: 'select',
      width: 200,
      valueField: 'value',
      displayField: 'text',
      editData: dataType
    }, {
      property: 'description',
      label: getText("description"),
      sortable: true,
      type: 'label'
    }, {
      label: '',
      type: 'action',
      separate: '&nbsp;',
      align: 'center',
      buttons: [{
        text: iNet.resources.message.button.edit,
        icon: 'icon-pencil',
        fn: function(record) {
          update = true;
          grid.selectById(record.uuid);
          //setData(record);
        }
      },{
        text: iNet.resources.message.button.download,
        icon: 'icon-download-alt',
        fn: function(record) {
          var __uuid = record.uuid || "";
          $.download(iNet.getUrl('report/template/download'), {
            uuid: __uuid
          });
        }
      }, {
        text: iNet.resources.message.button.del,
        icon: 'icon-trash',
        labelCls: 'label label-important',
        fn: function(record) {
          dataDel.put('dataDel', record);
          confirmFileDeleteDialog.show();
        }
      }]
    }]
  });
  var createValidate = new iNet.ui.form.Validate({
    id: $frmSubmit.prop('id'),
    rules: [{
      id: 'import-template-file',
      validate: function(v) {
        if (iNet.isEmpty($input.file.val())) {
          return getText("template_not_blank");
        }else{
          if(!isFile){
            return String.format(getText("template_is_required"),file_format);
          }
          if(!isMaxSize){
            return String.format(getText("template_size_is_required"),file_maxsize);
          }
        }
      }
    },{
      id: $input.module.prop('id'),
      validate: function(v) {
        if (iNet.isEmpty(v))
          return getText("module_not_blank");
      }
    }]
  });
  var setData = function(data) {
    var __data = data || [];
    update = true;
    template = __data.uuid;
    $input.template.val(__data.uuid);
    $input.module.val(__data.module).prop('disabled', true);
    $input.description.val(__data.description);
    $input.name.val(__data.name).prop('disabled', true);
    $input.type.val(__data.type).prop('disabled', true);
   // $containerInputFile.find('span[data-title]').attr('data-title', __data.name);
    //$input.file.val('');
  };
  var initForm = function() {
    template = "";
    update = false;
    $input.template.val('');
    $input.module.prop('disabled', false);
    $input.name.val('').prop('disabled', false);
    $input.type.prop('disabled', false);
    $input.description.val('');
    $input.file.val('');
    $input.module.val('edoc');
    $input.type.val('RP_ED_IN');
    //$containerInputFile.find('span.ace-file-name').attr('data-title', '...');
  };
  var resetData = function() {
    template = "";
    update = false;
    $input.template.val('');
    $input.module.prop('disabled', false);
    $input.name.val('').prop('disabled', false);
    $input.type.prop('disabled', false);
    $input.description.val('');
    $input.file.val('');
    //$containerInputFile.find('span[ace-file-name]').attr('data-title', '...');
    $input.description.focus();
  };
  var getParams = function() {
    var __data = {
      application: 'ikepler',
      module: $input.module.val()
    };
    return __data;
  };
  var grid = new iNet.ui.grid.Grid({
    id: $grid.prop('id'),
    url: url.load,
    params: getParams(),
    dataSource: dataSource,
    idProperty: 'uuid',
    firtLoad: false,
    convertData: function(data) {
      var __data = data || {};
      grid.setTotal(__data.total);
      return __data.items || [];
    },
    pageSize: iNet.pageSize
  });
  grid.on('selectionchange', function(sm, data) {
    var __records = sm.getSelection();
    var __data = data || {};
    if (__records.length > 0) {
      setData(__data);
    }
    else {
      resetData();
    }
  });
  $input.module.change(function() {
    var __params = getParams();
    if (!update) {
      grid.setParams(__params);
      grid.load();
    }
  });
  // ************ UPLOAD FILE TEMPLATE *****************//
  /*$containerInputFile.click(function() {
    $input.file.trigger('click');
  });*/
  /*$input.file.on('change', function(result) {
    if (this.files.length < 1) {
      this.files = [];
      return;
    }
    var __nameFile = this.files[0].name;
    $containerInputFile.find('span.ace-file-name').attr('data-title', __nameFile);
    isFile = detectFile(this.files[0].name);
    isMaxSize = this.files[0].size <= file_maxsize * 1024;
  });*/
  $containerInputFile.ace_file_input({
    no_file:'No File ...',
    btn_choose:'Choose',
    btn_change:'Change',
    droppable:true,
    onchange:null,
    thumbnail:false, //| true | large
    allowExt: ['doc','docx','xlsx','xls'],
    maxSize: (file_maxsize * 1024)
  });

  var actionSubmit = function(url) {
    $frmSubmit.ajaxForm({
      url: url,
      beforeSubmit: function() {
      },
      uploadProgress: function(event, position, total, percentComplete) {
      },
      success: function() {
      },
      complete: function(xhr) {
        
        var __responseJSON = xhr.responseJSON || {};
        var __responseText = xhr.responseText || {};
        if (!$.isEmptyObject(__responseJSON)) {
          if (update) {
            grid.update(__responseJSON);
            grid.commit();
            showMessage('info', getText("upload_template"), getText("template_update_success"));
            setData(__responseJSON);
          }
          else {
            grid.insert(__responseJSON);
            grid.commit();
            showMessage('info', getText("upload_template"), getText("template_create_success"));
            // after save
            template = "";
            $input.description.val('');
            $input.file.val('');
            $input.template.val('');
            $containerInputFile.find('span[data-title]').attr('data-title', '...');
          }
        }
        else {
          showMessage('error', getText("upload_template"), getText("template_save_error"));
        }
        
      }
    });
  };

  initForm();

  $toolbar.SAVE.click(function() {
    var __url = update ? url.update : url.create;
    if (createValidate.check()) {
      actionSubmit(__url);
    }
  });
  $toolbar.CREATE.click(function() {
    resetData();
  });
});