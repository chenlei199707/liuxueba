//一般直接写在一个js文件中
layui.use(['layer', 'form'], function () {
    var layer = layui.layer,
        form = layui.form
    // layer.msg('Hello World layui');
})


$(function () {
    document.querySelector(".link-btn.lin-menu").onclick = function () {
        document.getElementById("eject").style.display = "block";
    };
    document.getElementById("point").onclick = function () {
        document.getElementById("eject").style.display = "none";
    };

    $('.pulldown-model,.bank-model').click(function(){ $(this).hide() })
})