/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Trang Nguyen <trangnt@inetcloud.vn>
 *         on 10:34 AM 24/06/2016.
 * -------------------------------------------
 * @project kepler-ui
 * @author trangnt
 * @file AccountVerify.js
 */
$(function () {
  var $btnOk = $('#account-verify-btn-retry');
  var $btnClose = $('#account-verify-btn-close');
  var $btnAdmin = $('#account-verify-btn-admin');
  $btnClose.on('click',function(){
    $.ajax({
      type: "POST",
      url: iNet.getUrl('system/logout'),
      dataType: 'json',
      success: function (data, textStatus, jqXHR) {
        var $iframe = $('<iframe/>');
        $iframe.attr('style', 'display:none;');
        $iframe.appendTo($('body'));
        $iframe.load(function () {
          location.reload();
        });
        $iframe.attr('src', data.uuid);
      }
    });
  });

  $btnOk.on('click',function(){
    window.location.href = iNet.getUrl('/icrawler/page/index');
  });
  $btnAdmin.on('click',function(){
    window.location.href = iNet.getUrl('/icrawler/page/admin/index');
  });

});