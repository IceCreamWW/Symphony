// 检查关注数是否为零，是则隐藏显示关注者的列表，并显示提示无关注的div
function check_follow_empty() {
    if ($("#profile_follow_ul > li").size() == 0) {
        $("#profile_content_empty_user").show();
        $("#profile_follow_body_wrapper").hide();
    } else {
        $("#profile_content_empty_user").hide();
        $("#profile_follow_body_wrapper").show();
    }
}

// 检查路线数是否为零，是则隐藏显示路线的列表，并显示提示无路线的div
function check_route_empty() {
    if ($("#profile_route_ul > li").size() == 0) {
        $("#profile_content_empty_route").show();
        $("#profile_route_body_wrapper").hide();
    } else {
        $("#profile_content_empty_route").hide();
        $("#profile_route_body_wrapper").show();
    }
}

// 切换标签栏时转换颜色
function switch_nav(nav_id) {
    var selector = "#profile_nav_" + nav_id;
    for (i = 1; i <= 5; i++) {
        $("#profile_nav_" + i).attr("class", "")
    }
    $(selector).attr("class", "nav_selected");
}

// 关注者列表/路线列表滚动
$(document).ready(
    function () {
        $(".profile_content_body").niceScroll({});
        $("#profile_detail_wrapper").niceScroll({});
    }
);

// 检查关注用户数量是否为零
$(document).ready(
    check_follow_empty
);

// 检查关注路线数量是否为零
$(document).ready(
    check_route_empty
);

// 通过导航切换标签页到我的关注
$(document).on('click', '#profile_nav_1', function () {
    switch_nav(1);
    $("#profile_content_1").show();
    $("#profile_content_body_1").getNiceScroll().show().resize();
    $("#profile_content_2").hide();
    $("#profile_content_body_2").getNiceScroll().hide();
    $("#profile_content_3").hide();
    $("#profile_content_4").hide();
    $(".profile_detail_wrapper").getNiceScroll().hide();
    $("#profile_content_5").hide();

});

// 通过导航切换标签页到我的路线
$(document).on('click', '#profile_nav_2', function () {
    switch_nav(2);
    $("#profile_content_1").hide();
    $("#profile_content_body_1").getNiceScroll().hide();
    $("#profile_content_2").show();
    $("#profile_content_body_2").getNiceScroll().show().resize();
    $("#profile_content_3").hide();
    $("#profile_content_4").hide();
    $("#profile_detail_wrapper").getNiceScroll().hide();
    $("#profile_content_5").hide();
});

// 通过导航切换标签页到推荐路线
$(document).on('click', '#profile_nav_3', function () {
    switch_nav(3);
    $("#profile_content_1").hide();
    $("#profile_content_body_1").getNiceScroll().hide();
    $("#profile_content_2").hide();
    $("#profile_content_body_2").getNiceScroll().hide();
    $("#profile_content_3").show();
    $("#profile_content_4").hide();
    $("#profile_detail_wrapper").getNiceScroll().hide();
    $("#profile_content_5").hide();
});

// 通过导航切换标签页到个人资料
$(document).on('click', '#profile_nav_4', function () {
    switch_nav(4);
    $("#profile_content_1").hide();
    $("#profile_content_body_1").getNiceScroll().hide();
    $("#profile_content_2").hide();
    $("#profile_content_body_2").getNiceScroll().hide();
    $("#profile_content_3").hide();
    $("#profile_content_4").show();
    $("#profile_detail_wrapper").getNiceScroll().show().resize();
    $("#profile_content_5").hide();
});

// 通过导航切换标签页到修改密码
$(document).on('click', '#profile_nav_5', function () {
    switch_nav(5);
    $("#profile_content_1").hide();
    $("#profile_content_body_1").getNiceScroll().hide();
    $("#profile_content_2").hide();
    $("#profile_content_body_2").getNiceScroll().hide();
    $("#profile_content_3").hide();
    $("#profile_content_4").hide();
    $("#profile_detail_wrapper").getNiceScroll().hide();
    $("#profile_content_5").show();
});

// 通过顶部切换至我的关注
$(document).on('click', '#profile_follow_user_num_td', function () {
    switch_nav(1);
    $("#profile_content_1").show();
    $("#profile_content_body_1").getNiceScroll().show().resize();
    $("#profile_content_2").hide();
    $("#profile_content_body_2").getNiceScroll().hide();
    $("#profile_content_3").hide();
    $("#profile_content_4").hide();
    $("#profile_detail_wrapper").getNiceScroll().hide();
    $("#profile_content_5").hide();
});

// 通过顶部切换标签页到我的路线
$(document).on('click', '#profile_follow_route_num_td', function () {
    switch_nav(2);
    $("#profile_content_1").hide();
    $("#profile_content_body_1").getNiceScroll().hide();
    $("#profile_content_2").show();
    $("#profile_content_body_2").getNiceScroll().show().resize();
    $("#profile_content_3").hide();
    $("#profile_content_4").hide();
    $("#profile_detail_wrapper").getNiceScroll().hide();
    $("#profile_content_5").hide();
});

// 修改密码
$(document).on('click', '#profile_password_submit', function () {
    var cur_password = $("#profile_ori_password").val();
    var new_password = $("#profile_new_password").val();
    var new_password_again = $("#profile_new_password_again").val();
    if (cur_password == "" || new_password == "" || new_password_again == "") {
        $("#profile_password_warning").text("请输入原密码与新密码");
        return;
    }
    if (new_password != new_password_again) {
        $("#profile_password_warning").text("两次输入的新密码不一致");
        return;
    }
    $.post("change_password", {
        "cur_password": cur_password,
        "new_password": new_password
    }, function (json, textStatus) {
        if (json["status"] == "success") {
            switch_nav(1);
            $("#profile_content_1").show();
            $("#profile_content_body_1").getNiceScroll().show().resize();
            $("#profile_content_2").hide();
            $("#profile_content_body_2").getNiceScroll().hide();
            $("#profile_content_3").hide();
            $("#profile_content_4").hide();
            $(".profile_detail_wrapper").getNiceScroll().hide();
            $("#profile_content_5").hide();
        } else if (json["status"] == "fail") {
            $("#profile_password_warning").text("原密码错误");
        } else {
            $("#profile_password_warning").text("操作异常");
        }
    });
});