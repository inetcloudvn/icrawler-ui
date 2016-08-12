/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Trang Nguyen <trangnt@inetcloud.vn>
 *         on 4:54 PM 05/07/2016.
 * -------------------------------------------
 * @project kepler-ui
 * @author trangnt
 * @file SideBar.js
 */
$(function () {
  /**
   * @class iNet.ui.ikepler.Menu
   * @extends iNet.ui.common.Menu
   */
  iNet.ns("iNet.ui.icrawler","iNet.ui.icrawler.Menu");
  iNet.ui.icrawler.Menu = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);
    this.$element = $("#sidebar")
  };

  iNet.extend(iNet.ui.icrawler.Menu, iNet.ui.common.Menu, {
    getEl : function() {
      return this.$element;
    }
  });
});