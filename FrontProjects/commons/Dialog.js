const Dialog = {
    showInput(title, callback, backdrop = true, keyboard = true, showCloseBtn = true, cancelBtnLabel = "取消", okBtnLabel = "确定") {
        $(`<div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">${title}</h5>
        ${showCloseBtn ? "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>" : ""}
      </div>
      <div class="modal-body">
        <input type="text" class="message-input form-control">
      </div>
      <div class="modal-footer">
        ${cancelBtnLabel ? "<button type=\"button\" class=\"btn btn-secondary\" data-dismiss=\"modal\">" + cancelBtnLabel + "</button>" : ""}
        ${okBtnLabel ? "<button type=\"button\" class=\"btn btn-primary\" data-dismiss=\"modal\">" + okBtnLabel + "</button>" : ""}
      </div>
    </div>
  </div>
</div>`).appendTo(document.body).modal({
            keyboard: keyboard,
            backdrop: backdrop
        }).on("hidden.bs.modal", function () {
            let jqThis = $(this);
            if (callback) {
                callback(jqThis.find(".message-input").val());
            }
            jqThis.remove();
        });
    },

    showMessageBox(msg, title = "", closeCallback = null) {
        $(`<div class="modal fade" id="staticBackdrop" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">${title}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        ${msg}
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" data-dismiss="modal">OK</button>
      </div>
    </div>
  </div>
</div>`).appendTo(document.body).modal().on("hidden.bs.modal", function () {
            $(this).remove();

            if (closeCallback) {
                closeCallback();
            }
        });
    },


    showLoading(msg) {
        return $(`<div class="modal" tabindex="-1" role="dialog" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">
        ${msg}
      </div>
    </div>
  </div>
</div>`).modal({
            keyboard: false,
            backdrop: "static"
        }).on("hidden.bs.modal", function () {
            $(this).remove();
        });
    }
};

export default Dialog;