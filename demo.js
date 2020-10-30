$(document).ready(function () {
    // alert('abc');
    var url = "ajax/ajaxCard";
    var ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.getall();

    // table change color
    $("#cardtable td").hover(function(){
      $(this).addClass("chgaim")
      var cellindex = this.cellIndex
      $("#cardtable tr>td:nth-child("+(cellindex+1)+")").addClass("aimcol")
    },function(){
      $(this).removeClass("chgaim")
      $("#cardtable td").removeClass("aimcol")
    })

    // bootstrap
    $('button').addClass("btn btn-outline-secondary")

    // 新增按鈕
    $("#addbutton").click(function () {
        $("#dialog-addconfirm").modal('show');
        
        $('#dialog-addconfirm-addbtn').on('click',function (e) {
            var url = "ajax/ajaxCard";
            var cnname = $("#addcnname").val();
            var enname = $("#addenname").val();
            var sex = $('input:radio:checked[name="addsex"]').val();
            // 5.
            var phone = $("#addphone").val();
            var email = $("#addemail").val();
            var ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.cnname = cnname;
            ajaxobj.enname = enname;
            ajaxobj.sex = sex;
            ajaxobj.phone = phone;
            ajaxobj.email = email;
            ajaxobj.add();

            e.preventDefault(); // avoid to execute the actual submit of the form.
        });
        $('#dialog-addconfirm-resetbtn').on('click',function () {
            $("#addform")[0].reset();
        });

    })
    // 搜尋按鈕
    $("#searchbutton").click(function () {
        $("#dialog-searchconfirm").dialog({
            resizable: true,
            height: $(window).height() * 0.4,// dialog視窗度
            width: $(window).width() * 0.4,
            modal: true,
            buttons: {
                // 自訂button名稱
                "搜尋": function (e) {
                    var url = "ajax/ajaxCard";
                    // var data = $("#searchform").serialize();
                    var cnname = $("#secnname").val();
                    var enname = $("#seenname").val();
                    var sex = $('input:radio:checked[name="sesex"]').val();
                    var ajaxobj = new AjaxObject(url, 'json');
                    ajaxobj.cnname = cnname;
                    ajaxobj.enname = enname;
                    ajaxobj.sex = sex;
                    ajaxobj.search();

                    e.preventDefault(); // avoid to execute the actual submit of the form.
                },
                "重新填寫": function () {

                    $("#searchform")[0].reset();
                },
                "取消": function () {
                    $(this).dialog("close");
                }
            }
        });
    })
    // 修改鈕
    // 3.
    $("#cardtable").on('click', '.modifybutton', function () {
        var ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.modify_get();
    })
    // 3.
    $("#cardtable").on('click', '.deletebutton', function () {
        $("#deletedialog").modal('show');

        $("#dialog-delete").on('click',function () {
            var deleteid = $(this).attr('id').substring(12);
            var url = "ajax/ajaxCard";
            var ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.id = deleteid;
            ajaxobj.delete();

            $("#deletedialog").modal('hide');
        });
    })

    // 自適應視窗
    $(window).resize(function () {
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.4;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.4;
        $("#dialog-confirm").dialog("option", "width", dWidth);
        $("#dialog-confirm").dialog("option", "height", dHeight);
    });
});
function refreshTable(data) {
    // var HTML = '';
    $("#cardtable tbody > tr").remove();
    $.each(data, function (key, item) {
        var strsex = '';
        if (item.sex == 0)
            strsex = '男';
        else
            strsex = '女';
        var row = $("<tr id='response"+key+"'></tr>");
        row.append($("<td></td>").html(item.cnname).attr('data-toggle',"tooltip").tooltip({
          title:`[${strsex}]${item.cnname}(${item.enname})`,
          placement:'right'
        }));
        row.append($("<td></td>").html(item.enname));
        row.append($("<td></td>").html(strsex));
        // 5.phone number
        row.append($("<td></td>").html(item.phone).popover({content:`${String(item.phone).substr(0,4)+"-"+String(item.phone).substr(4,3)+"-"+String(item.phone).substr(7,3)}`}));
        // attr({'data-trigger':"focus",'tabindex':""});
        row.append($("<td></td>").html(item.email));
        row.append($("<td></td>").html('<button id="modifybutton' + item.s_sn + '" class="modifybutton" style="font-size:16px;font-weight:bold;">修改 <span class="glyphicon glyphicon-list-alt"></span></button>'));
        row.append($("<td></td>").html('<button id="deletebutton' + item.s_sn + '" class="deletebutton" style="font-size:16px;font-weight:bold;">刪除 <span class="glyphicon glyphicon-trash"></span></button>'));
        $("#cardtable").append(row);
    });
}

function initEdit(response) {
  var modifyid = $("#cardtable").attr('id').substring(12);
  // var modifyid = response.s_sn;
  console.log("modifyid is"+modifyid)
  $("#mocnname").val(response[0].cnname);
  $("#moenname").val(response[0].enname);
  if (response[0].sex == 0) {
      $("#modifyman").prop("checked", true);
      $("#modifywoman").prop("checked", false);
  }
  else {
      $("#modifyman").prop("checked", false);
      $("#modifywoman").prop("checked", true);
  }
  $("#modifysid").val(modifyid);
// 3. 
  $("#dialog-modifyconfirm").modal('show');

  $('#dialog-modifyconfirm-modifybtn').on('click',function (e) {
    // $("#modifyform").submit();
    var url = "ajax/ajaxCard";
    var cnname = $("#mocnname").val();
    var enname = $("#moenname").val();
    var sex = $('input:radio:checked[name="mosex"]').val();
    var ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.cnname = cnname;
    ajaxobj.enname = enname;
    ajaxobj.sex = sex;
    ajaxobj.id = modifyid;
    ajaxobj.modify();

    e.preventDefault(); // avoid to execute the actual submit of the form.
  });
  $('#dialog-modifyconfirm-resetbtn').on('click',function () {
    $("#modifyform")[0].reset();
  });
  
  // form vaild 表單驗證
  $('form').bootstrapValidator({
    message:'',
    feedbackIcons:{},
    fields:{
      cnname:{
        message: '(必填)請輸入中文名字',
        vaildators: {}
      },
      phone:{
        message: '(必填)請輸入電話',
        vaildators: {}
      },
      email:{
        message: '(必填)請輸入信箱',
        vaildators: {}
      }
    }
  })


}

/**
 * 
 * @param string
 *          url 呼叫controller的url
 * @param string
 *          datatype 資料傳回格式
 * @uses refreshTable 利用ajax傳回資料更新Table
 */
function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;
}
AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname= '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.id = 0;
AjaxObject.prototype.alertt = function () {
    alert("Alert:");
}
AjaxObject.prototype.getall = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0","phone":"0911456789"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1","phone":"0900123456"}]';
  refreshTable(JSON.parse(response));
}
AjaxObject.prototype.add = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"},{"s_sn":"52","cnname":"新增帳號","enname":"NewAccount","sex":"1"}]';
  refreshTable(JSON.parse(response));
//   5.
  $("#addform")[0].reset();
  $("#dialog-addconfirm").modal("hide");
}
AjaxObject.prototype.modify = function () {
  response = '[{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
  refreshTable(JSON.parse(response));
  //   5.
//   $("#modifyform")[0].reset();
  $("#dialog-modifyconfirm").modal("hide");
}
AjaxObject.prototype.modify_get = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
  initEdit(JSON.parse(response));
}
AjaxObject.prototype.search = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"}]';
  refreshTable(JSON.parse(response));
  $("#dialog-searchconfirm").dialog("close");
}
AjaxObject.prototype.delete = function () {
  response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
  refreshTable(JSON.parse(response));
}
