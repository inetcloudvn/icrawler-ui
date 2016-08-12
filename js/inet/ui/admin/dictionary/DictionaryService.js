$(function() {
  var url = {
    findByKey : iNet.getUrl('comm/dicts/findbykeys'),
    save : iNet.getUrl('admin/dicts/save'),
    update : iNet.getUrl('admin/dicts/update'),
    del: iNet.getUrl('admin/dicts/delete')
  };
  var $typeSelect = $('#ikepler-dict-select-type');
  var $keySelect = $('#ikepler-dict-select-key');
  var deleteIds = null;
  var splitChar = ';';
  var $gridMask =$('#ikepler-dictionary-grid-id');
  var $warning = $('#ikepler-dictionary-warning');

  var $toolbar = {
    CREATE : $('#ikepler-dict-btn-create'),
    DELETE : $('#ikepler-dict-btn-delete')
  };

  var confirmDeleteDialog = new iNet.ui.dialog.ModalDialog({
    id : 'ikepler-modal-confirm-delete',
    title : iNet.resources.message.dialog_confirm_title,
    content : iNet.resources.message.dialog_confirm_content,
    buttons : [{
      text : iNet.resources.message.button.ok,
      cls : 'btn-primary',
      icon : 'icon-ok icon-white',
      fn : function() {
        if (!iNet.isEmpty(deleteIds)) {
          this.hide();
          $.postJSON(url.del, {
            ids : deleteIds
          }, function() {
            var __ids= deleteIds.split(splitChar);
            for (var i =0;i<__ids.length;i++) {
              grid.remove(__ids[i]);
            }
            deleteIds = null;
          },{mask: this.getMask() , msg: iNet.resources.ajaxLoading.deleting});
        }
      }
    }, {
      text : iNet.resources.message.button.cancel,
      icon : 'icon-remove',
      fn : function() {
        this.hide();
      }
    }]
  });
  var fillKeysToSelect = function(keys){
    var __keys = keys || [];
    var __options='';
    for(var i=0;i<__keys.length;i++){
      var __key = __keys[i] || {};
      __options+=String.format('<option value="{0}">{1}</option>',__key.value,__key.text);
    }
    $keySelect.html(__options).trigger('change');
  };

  var loadKeys = function(type) {
    var __type = type || 'incoming';
    var __keys = [];
    switch (__type.toLowerCase()) {
      case 'incoming': //incoming electronic document
        __keys= [{
          value: 'ed_in_publish_parent_unit',
          text: iNet.resources.ikepler.admin.ed.publish_parent_unit
        },{
          value: 'ed_in_publish_unit',
          text: iNet.resources.ikepler.admin.ed.publish_unit
        },{
          value: 'ed_in_doc_category',
          text: iNet.resources.ikepler.admin.ed.doc_category
        },{
          value: 'ed_in_field',
          text: iNet.resources.ikepler.admin.ed.field
        },{
          value: 'ed_in_signer',
          text: iNet.resources.ikepler.admin.ed.signer
        },{
          value: 'ed_in_signer_position',
          text: iNet.resources.ikepler.admin.ed.signer_position
        },{
          value: 'ed_in_signer_competence',
          text: iNet.resources.ikepler.admin.ed.competence
        },{
          value: 'ed_in_location',
          text: iNet.resources.ikepler.admin.ed.location
        }];
        break;
      case 'outgoing': //outgoing electronic document
        __keys = [{
          value: 'ed_out_publish_parent_unit',
          text: iNet.resources.ikepler.admin.ed.publish_parent_unit
        },/*{
         value: 'ed_out_publish_unit',
         text: iNet.resources.ikepler.admin.ed.publish_unit
         },*/{
          value: 'ed_out_doc_category',
          text: iNet.resources.ikepler.admin.ed.doc_category
        },{
          value: 'ed_out_field',
          text: iNet.resources.ikepler.admin.ed.field
        },{
          value: 'ed_out_signer',
          text: iNet.resources.ikepler.admin.ed.signer
        },{
          value: 'ed_out_signer_position',
          text: iNet.resources.ikepler.admin.ed.signer_position
        },{
          value: 'ed_out_signer_competence',
          text: iNet.resources.ikepler.admin.ed.competence
        },{
          value: 'ed_out_location',
          text: iNet.resources.ikepler.admin.ed.location
        }];
        break;
    }
    fillKeysToSelect(__keys);
  };

  $typeSelect.on('change',function(){
    loadKeys($(this).val());
  });
  $keySelect.on('change',function(){
    var __params= {keys: $(this).val()};
    grid.setParams(__params);
    grid.load();
  });

  var dataSource = new DataSource({
    columns : [{
      type : 'selection',
      align: 'center',
      width : 30
    },{
      property : 'value',
      label : iNet.resources.ikepler.admin.dict.value_field,
      sortable : true,
      type : 'text',
      width : 200,
      validate : function(v) {
        if (iNet.isEmpty(v))
          return iNet.resources.ikepler.admin.dict.value_field_required;
      }
    },{
      property : 'description',
      label : iNet.resources.ikepler.admin.dict.desc_field,
      sortable : true,
      type : 'text',
      validate : function(v) {
        if (iNet.isEmpty(v))
          return iNet.resources.ikepler.admin.dict.desc_field_required;
      }
    },{
      property : 'order',
      label : iNet.resources.ikepler.admin.dict.order_field,
      sortable : true,
      align: 'right',
      width : 125,
      type : 'text',
      validate : function(v) {
        if (!iNet.isEmpty(v) && !iNet.isNumber(Number(v)))
          return iNet.resources.ikepler.admin.dict.order_number_valid;
      }
    },{
      label : '',
      type : 'action',
      separate: '&nbsp;',
      align: 'center',
      buttons : [{
        text : iNet.resources.message.button.edit,
        icon : 'icon-pencil',
        fn : function(record) {
          grid.edit(record.uuid);
        }
      },{
        text : iNet.resources.message.button.del,
        icon : 'icon-trash',
        labelCls: 'label label-important',
        fn : function(record) {
          deleteIds = (record.uuid || '').toString();
          confirmDeleteDialog.show();
        }
      }]
    }]
  });
  var dataAgencySource = new DataSource({
    columns : [{
      type : 'selection',
      align: 'center',
      width : 30
    },{
      property : 'value',
      label : iNet.resources.ikepler.admin.dict.value_field,
      sortable : true,
      type : 'text',
      width : 200,
      validate : function(v) {
        if (iNet.isEmpty(v))
          return iNet.resources.ikepler.admin.dict.value_field_required;
      }
    },{
      property : 'description',
      label : iNet.resources.ikepler.admin.dict.desc_field,
      sortable : true,
      type : 'text',
      validate : function(v) {
        if (iNet.isEmpty(v))
          return iNet.resources.ikepler.admin.dict.desc_field_required;
      }
    },{
      property : 'code',
      label : 'Mã cơ quan',
      sortable : true,
      type : 'unitcode',
      width : 130,
      validate : function(v) {
        if (iNet.isEmpty(v))
          return 'Mã cơ quan không được để trống';
      }
    },{
      property : 'order',
      label : iNet.resources.ikepler.admin.dict.order_field,
      sortable : true,
      align: 'right',
      width : 125,
      type : 'text',
      validate : function(v) {
        if (!iNet.isEmpty(v) && !iNet.isNumber(Number(v)))
          return iNet.resources.ikepler.admin.dict.order_number_valid;
      }
    },{
      label : '',
      type : 'action',
      separate: '&nbsp;',
      align: 'center',
      buttons : [{
        text : iNet.resources.message.button.edit,
        icon : 'icon-pencil',
        fn : function(record) {
          grid.edit(record.uuid);
        }
      },{
        text : iNet.resources.message.button.del,
        icon : 'icon-trash',
        labelCls: 'label label-important',
        fn : function(record) {
          deleteIds = (record.uuid || '').toString();
          confirmDeleteDialog.show();
        }
      }]
    }]
  });
  var grid = new iNet.ui.grid.Grid({
    id : 'ikepler-dictionary-grid-id',
    url : url.findByKey,
    dataSource : dataSource,
    idProperty : 'uuid',
    firstLoad: false,
    pageSize: iNet.pageSize,
    convertData : function(data) {
      var __params = this.getParams() || {};
      return data.data[__params.keys] || []
    }
  });

  $keySelect.on('change', function () {
    var __val = $(this).val();
    if(__val == 'ed_in_publish_unit') {
      grid.setDataSource(dataAgencySource);
      $warning.show();
    } else {
      $warning.hide();
      grid.setDataSource(dataSource);
    }
  });

  $warning.on('click','button[data-dismiss="alert"]', function () {
    var $el = $(this);
    $el.parent().parent().hide();
  });

  var confirmUpdate = function() {
    var r = confirm(iNet.resources.message.confirm_update);
    if (r == true) {
      grid.endEdit();
    } else {
      grid.cancelEdit();
    }
  };

  grid.on('save', function(data) {
    var __data = data || {};
    __data.key = $keySelect.val();
    $.postJSON(url.save, __data, function(result) {
      var __result = result || {};
      if(__result.type != 'ERROR') {
        grid.insert(__result);
        grid.newRecord();
      }
    },{mask: $gridMask , msg: iNet.resources.ajaxLoading.saving});
  });
  grid.on('update', function(data, odata) {
    var __data = data || {};
    __data.key = $keySelect.val();
    $.postJSON(url.update, __data, function(result) {
      var __result = result || {};
      if(__result.type != 'ERROR') {
        grid.update(__result);
        grid.commit();
      }
    },{mask: $gridMask , msg: iNet.resources.ajaxLoading.saving});
  });

  grid.on('blur', function(action, control) {
    if (action == 'update') {
      confirmUpdate();
    }
  });

  grid.on('selectionchange', function(sm, data){
    var records = sm.getSelection();
    var count =  records.length;
    FormUtils.showButton($toolbar.DELETE, count>0);
    var uuids = [];
    for(var i=0;i<count;i++){
      var __record = records[i];
      uuids.push(__record.uuid);
    }
    deleteIds = uuids.join(splitChar);
  });

  $toolbar.CREATE.click(function() {
    grid.newRecord();
  });

  $toolbar.DELETE.click(function() {
    confirmDeleteDialog.show();
  });

  //first load
  $typeSelect.trigger('change');
});