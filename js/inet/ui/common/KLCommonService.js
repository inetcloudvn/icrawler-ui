// #PACKAGE: inet-ikepler-common-service
// #MODULE: kLCommonService
$(function() {
  setInterval(function () {
    var $list = $('.timeago');
    for (var i = 0; i < $list.length; i++) {
      var $timeago = $($list[i]);
      $timeago.text($.timeago(Number($timeago.attr('data-time'))));
    }
  }, 60000);
  //=================================================================
  window.KLCommonService = {
    createNotify: function (type, title, content) {
      if (!KLCommonService._notify) {
        KLCommonService._notify = new iNet.ui.form.Notify({
          delay: iNet.delayMessage || 4000
        });
      }
      KLCommonService._notify.setType(type || 'error');
      KLCommonService._notify.setTitle(title || '');
      KLCommonService._notify.setContent(content || '');
      return KLCommonService._notify;
    },
    showMessage: function (type, title, content) {
      KLCommonService.createNotify(type, title, content).show();
    },
    loadDicts: function (key, callback, options) {
      var __options = options || {};
      var __fn = callback || iNet.emptyFn;
      var __key = key;
      return $.getJSON(iNet.getUrl('comm/dicts/findbykeys'), {
        keys: __key
      }, function (result) {
        var __result = result || {};
        var __datas = __result.data || {};
        __fn(__datas);
      }, __options);
    },
    loadSysConf: function (callback) {
      var __fn = callback || iNet.emptyFn;
      return $.getJSON(iNet.getUrl("admin/sysconfs/fvisible"), {}, function (result) {
        if (result.type != 'ERROR') {
          __fn(result);
        }
      });
    },
    saveFiles: function (attachments, callback, options) {
      var __attachments = attachments || [];
      var __options = options || {};
      var __fn = callback || iNet.emptyFn;
      var __params = {
        attachments: iNet.JSON.encode(__attachments),
        exeacode: SecurityUtils.getUserCode()
      };
      return $.postJSON(iNet.getUrl('document/atts/save'), __params, __fn, __options);
    },
    deleteFiles: function (ids, callback, options) {
      var __ids = ids;
      var __options = options || {};
      var __fn = callback || iNet.emptyFn;
      return $.postJSON(iNet.getUrl('document/atts/delete'), {
        ids: __ids,
        exeacode: SecurityUtils.getUserCode()
      }, __fn, __options);
    },
    getDataUrl: function (param) {
      var __param = iNet.getParam(param || 'data');
      return (__param) ? iNet.Base64.decodeObject(__param) || {} : {};
    },
    getDate: function (date) {
      return (!iNet.isEmpty(date)) ? date.toDate().format('c') : "";
    },
    convertStringToDate: function (date) {// tra len
      return (!iNet.isEmpty(date)) ? new Date(date).format(iNet.dateFormat) : "";
    },
    convertDateToString: function (date) {// luu xuong
      return (!iNet.isEmpty(date)) ? date.toDate().format('c') : "";
    },
    convertFullDateToString: function (date) {// luu xuong
      return (!iNet.isEmpty(date)) ? date.toFullDate().format('c') : "";
    },
    convertStringToFullDate: function (date) { // tra len
      var __date = (!iNet.isEmpty(date)) ? new Date(date).format(iNet.fullDateFormat) : "";
      var __hour = __date.substr(11);
      if (__hour == '00:00:00') {
        return __date.substr(0, 10);
      }
      else {
        return __date;
      }
    },
    convertLongToDate: function (number) {
      var __number = number || "";
      var __date = !iNet.isEmpty(__number) ? new Date(__number) : "";
      if(!iNet.isEmpty(__date)) {
        return __date.format('d/m/Y');
      }
      return "";
    }
  };
});