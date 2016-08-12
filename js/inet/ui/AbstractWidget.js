
$(function () {
  iNet.ns("iNet.ui.kepler");
  iNet.ui.kepler.AbstractWidget = function (config) {
    var __config = config || {};
    iNet.apply(this, __config);
    this.notify= null;
    iNet.ui.kepler.AbstractWidget.superclass.constructor.call(this);
  };
  iNet.extend(iNet.ui.kepler.AbstractWidget, iNet.ui.Widget, {
    showMessage: function (type, title, content) {
      if (!this.notify) {
        this.notify = new iNet.ui.form.Notify( {
          delay: iNet.delayMessage || 4000
        });
      }
      this.notify.setType(type || 'error');
      this.notify.setTitle(title|| '');
      this.notify.setContent(content || '');
      this.notify.show();
    },
    getNotify: function(){
      return this.notify;
    },
    getParent: function(){
      return this.parent || null;
    },
    setParent: function(parent){
      this.parent = parent;
    }
  });

});