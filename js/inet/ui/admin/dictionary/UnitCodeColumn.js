$(function () {
  iNet.ns("iNet.ui.grid.column");
  iNet.ui.grid.column.UnitCode = function (config) {
    config = config || {};
    iNet.apply(this, config);//apply configuration
    iNet.ui.grid.column.UnitCode.superclass.constructor.call(this) ;
  };
  iNet.extend(iNet.ui.grid.column.UnitCode, iNet.ui.grid.column.Textbox, {
    edit: function(v){
      v = !iNet.isEmpty(v) ? v : '';
      var __column = this.getColumn();
      var __align = __column.align || 'left';
      var __disabled = (!!__column.disabled) ? 'disabled="disabled"' : '';
      var $el = $(String.format('<input value="{0}" {1} style="text-align:{2}" placeholder="00.00.A00" class="uppercase"/>', v, __disabled, __align));
      var grid= this.getGrid();

      $el.on('keydown', function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        var __id = this.getRecordId();
        if (code == 13) {
          grid.save(__id);
        } else if (code == 27) {
          grid.cancel(__id);
        }
      }.createDelegate(this));

      $el.on('change', function (e) {
        grid.changeCell(this);
      }.createDelegate(this));

      this.setEl($el);
      this.applyUI();
      return this.getEl();
    },
    applyUI: function() {
      var $el = this.getEl();
      if (!$el) {
        throw new Error('$cell must not be null');
      }
      if(!$.fn.mask){
        console.error('mask plugin could not be found');
        return;
      }
      $el.mask("99.99.a99");
    }
  });

  iNet.ui.grid.ColumnManager.registerType('unitcode', iNet.ui.grid.column.UnitCode);

});