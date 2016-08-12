/**
 * Copyright (c) 2016 iNet Solutions Corp.,
 * Created by Trang Nguyen <trangnt@inetcloud.vn>
 *         on 2:39 PM 24/06/2016.
 * -------------------------------------------
 * @project kepler-ui
 * @author trangnt
 * @file SecurityUtils.js
 */
// #PACKAGE: inet-icrawler-utilities
// #MODULE: SecurityUtils
window.SecurityUtils = {
  getUserCode : function() {
    return $.jStorage.get('acode') || '';
  },
  getFullname: function(){
    return $.jStorage.get('aname') || 'Anonymous';
  },
  getRank: function(){
    return $.jStorage.get('rank') || 'administrator';
  },
  getDeptCode: function(){
    return $.jStorage.get('deptCode') || '';
  },
  getUnitCode: function(){
    return $.jStorage.get('unitCode') || '';
  },
  getUnitName: function(){
    return $.jStorage.get('unitName') || '';
  },
  clear: function(){
    $.jStorage.deleteKey('acode');
    $.jStorage.deleteKey('aname');
    $.jStorage.deleteKey('rank');
    $.jStorage.deleteKey('deptCode');
    $.jStorage.deleteKey('unitName');
  },
  getEmail: function(){
    return  iNet.usercode;
  },
  getDisplayName: function(){
    return iNet.displayName;
  },
  isLeader: function(){
    var leaders = ['org_leader', 'unit_leader', 'leader'];
    return (leaders.indexOf(SecurityUtils.getRank()) > -1);
  },
  isAdministrator: function() {
    var admins = ['org_administrator', 'dept_administrator', 'administrator'];
    return (admins.indexOf(SecurityUtils.getRank()) > -1);
  }
};
