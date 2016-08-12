/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Trang Nguyen <trangnt@inetcloud.vn>
 *         on 10:35 AM 17/06/2016.
 * -------------------------------------------
 * @project kepler-ui
 * @author trangnt
 * @file GatewayService.js
 */

/** CAU HINH TRUNG TAM LIEN THONG **/
$(function() {
  var changeAddress = false;
  var changeSecretKey = false;
  var changeAccessKey = false;
  var dataConfig = {};
  var $toolbar = {
    SAVE: $('#gateway-btn-save'),
    DELETE: $('#gateway-btn-delete'),
    ACTIVE:$('#gateway-btn-active')
  };
  var url = {
    save: iNet.getUrl('admin/gw/save'),
    update: iNet.getUrl('admin/gw/update'),
    del: iNet.getUrl('admin/gw/delete'),
    active: iNet.getUrl('admin/gw/active'),
    load: iNet.getUrl('admin/gw/loadconfig')
  };

  var $input = {
    type: $('#gateway-txt-type'),
    address: $('#gateway-txt-address'),
    secretKey: $('#gateway-txt-secret-key'),
    accessKey: $('#gateway-txt-access-key'),
    application: $('#gateway-txt-app-access'),
    chkactive: $('#gateway-txt-active')
  };
  var $formContent = $('#gateway-wg-frm');
  var getText = function(text) {
    if (!iNet.isEmpty(text)) {
      return iNet.resources.ikepler.admin.gateway[text] || text;
    }
    else {
      return "";
    }
  };
  var notify = null;
  var showMessage = function(type, title, content) {
    if(!notify) {
      notify = new iNet.ui.form.Notify({
        delay: iNet.delayMessage || 4000,
        title: getText("update_title")
      });
    }
    notify.setType(type);
    notify.setTitle(title);
    notify.setContent(content);
    notify.show();
  };
  var validate = new iNet.ui.form.Validate({
    id: $formContent.prop('id'),
    rules: [{
      id: $input.address.prop('id'),
      validate: function(v) {
        if (iNet.isEmpty(v))
          return getText("address_not_empty");
      }
    }, {
      id: $input.secretKey.prop('id'),
      validate: function(v) {
        if (iNet.isEmpty(v) && $input.type.val() == 'IMERCURY')
          return getText("secret_key_not_empty");
      }
    }, {
      id: $input.accessKey.prop('id'),
      validate: function(v) {
        if (iNet.isEmpty(v) && $input.type.val() == 'IMERCURY') {
          return getText("access_key_not_empty");
        }
      }
    }, {
      id: $input.application.prop('id'),
      validate: function(v) {
        if (iNet.isEmpty(v) && $input.type.val() == 'IMERCURY') {
          return getText("app_not_empty");
        }
      }
    }]
  });
  $input.address.on('change', function() {
    if ($input.address.val() != $input.address.attr('data-default')) {
      changeAddress = true;
    }
    else {
      changeAddress = false;
    }
  });
  $input.secretKey.change(function() {
    if ($input.secretKey.val() != $input.secretKey.attr('data-default')) {
      changeSecretKey = true;
    }
    else {
      changeSecretKey = false;
    }
  });
  $input.accessKey.change(function() {
    if ($input.accessKey.val() != $input.accessKey.attr('data-default')) {
      changeAccessKey = true;
    }
    else {
      changeAccessKey = false;
    }
  });

  var getData = function() {
    var __chk = $input.chkactive.is(':checked');
    var __dataConfig = dataConfig || {};
    var __data = {
      url: $input.address.val(),
      apiKey: $input.accessKey.val(),
      secrectKey: $input.secretKey.val(),
      appication: $input.application.val(),
      type: $input.type.val(),
      active: __chk
    };
    if(!iNet.isEmpty(__dataConfig.uuid)) {
      __data.uuid = __dataConfig.uuid;
    }
    return __data;
  };
  var resetData = function () {
    dataConfig = {};
    $input.address.val('');
    $input.secretKey.val('');
    $input.accessKey.val('');
    $input.type.val('CAMEL');
    $input.chkactive.prop('checked',true);
    $input.address.focus();
  };
  var setData = function(data) {
    var __data = data || {};
    dataConfig = __data;
    $input.address.val(__data.url);
    $input.secretKey.val(__data.secrectKey);
    $input.accessKey.val(__data.apiKey);
    $input.type.val(__data.type);
    $input.chkactive.prop('checked',(__data.active == true));
    FormUtils.showButton($toolbar.DELETE, !iNet.isEmpty(__data.uuid));
  };

  var onSave = function() {
    var __data = getData() || {};
    if(!validate.check() || iNet.isEmpty(__data)){
      return;
    }
    var __url = url.save;
    if(!iNet.isEmpty(__data.uuid)) {
      __url = url.update;
    }
    $.postJSON(__url, __data, function(result) {
      var __result = result || {};
      if (__result.type == 'ERROR') {
        showMessage('error', getText("update_title"), getText("update_error"));
      }
      else {
        setData(__result);
        showMessage('success', getText("update_title"), getText("update_success"));
      }
    }, {
      mask: $formContent,
      msg: iNet.resources.ajaxLoading.updating
    });
  };

  $formContent.on('keydown', function(e) {
    var code = e.keyCode ? e.keyCode : e.which;
    if (code == 13) {
      $toolbar.SAVE.trigger('click');
    }
  });

  // DELETE CONFIG
  var confirmDeleteDialog = new iNet.ui.dialog.ModalDialog({
    id: 'modal-confirm-gateway-delete' + iNet.generateId(),
    title: iNet.resources.message.dialog_confirm_title,
    content: getText("comfirm_content_del"),
    buttons: [{
      text: iNet.resources.message.button.ok,
      cls: 'btn-primary',
      icon: 'icon-ok icon-white',
      fn: function() {
        var __dataOld = dataConfig;
        $.postJSON(url.del, {uuid: __dataOld.uuid || ""}, function(result) {
          var __result = result || {};
          if (__result.type == 'ERROR') {
            showMessage('error', getText("del_title"), getText("del_error"));
          }
          else {
            dataConfig = {};
            showMessage('success', getText("del_title"), getText("del_success"));
            loadConfig();
          }
        }, {
          mask: $formContent,
          msg: iNet.resources.ajaxLoading.deleting
        });
        this.hide();
      }
    }, {
      text: iNet.resources.message.button.cancel,
      icon: 'icon-remove',
      fn: function() {
        this.hide();
      }
    }]
  });
  var confirmActive = new iNet.ui.dialog.ModalDialog({
    id: 'modal-confirm-gateway-active-' + iNet.generateId(),
    title: 'Xác nhận',
    content: 'Bạn có chắc chắn ngừng hoạt động dịch vụ này không?',
    buttons: [{
      text: iNet.resources.message.button.ok,
      cls: 'btn-primary',
      icon: 'icon-ok icon-white',
      fn: function() {
        var __data = this.getData() || {};
        $.postJSON(url.active, __data, function (result) {
          var __result = result || {};
          if(__result.type == 'ERROR') {
            showMessage('error','Đổi trạng thái', 'Có lỗi khi đổi trạng thái');
          } else {
          }
        });
        this.hide();
      }
    }, {
      text: iNet.resources.message.button.cancel,
      icon: 'icon-remove',
      fn: function() {
        $input.chkactive.prop('checked',true);
        this.hide();
      }
    }]
  });
  // ACTIVE CONFIG
  var activeConfig = function (active) {
    var __dataConfig = dataConfig || {};
    var __data = {
      uuid: __dataConfig.uuid,
      active: active
    };
    if(iNet.isEmpty(__dataConfig.uuid)) {
      return;
    }
    if(active == false) {
      confirmActive.setData(__data);
      confirmActive.show();
    } else {
      $.postJSON(url.active, __data, function (result) {
        var __result = result || {};
        if(__result.type == 'ERROR') {
          showMessage('error','Đổi trạng thái', 'Có lỗi khi đổi trạng thái');
        }
      });
    }
  };

  var loadConfig = function(){
    $.getJSON(url.load, function(result) {
      var __result = result || {};
      if (__result.type == 'ERROR') {
        showMessage('error', getText("load_config"), getText("load_error"));
        return;
      }
      var __els = __result.elements || [];
      if(__els.length > 0) {
        var __data = __els[0] || {};
        setData(__data);
      } else {
        resetData();
      }

    }, {
      mask: $formContent,
      msg: iNet.resources.ajaxLoading.loading
    });
  };
  loadConfig();
  $input.chkactive.on('change', function () {
    var __chk = $input.chkactive.is(':checked');
    activeConfig(__chk);
  });
  $toolbar.DELETE.click(function(){
    confirmDeleteDialog.show();
  });
  $toolbar.SAVE.click(function (){
    onSave();
  });
});