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

// 切换导航栏
function switch_nav(tarId) {
    for (var i = 1; i <= 6; ++i) {
        $("#profile_nav_" + i).attr("class", "")
        $("#profile_content_" + i).hide();
        $("#profile_content_body_" + i).getNiceScroll().hide();
    }

    // $('#nav').children().eq(tarId)

    $("#profile_nav_" + tarId).attr("class", "nav_selected");
    $("#profile_content_" + tarId).show();
    $("#profile_content_body_" + tarId).getNiceScroll().show().resize();
    if (tarId == 4) {
        $("#profile_detail_wrapper").getNiceScroll().show().resize();
    } else {
        $("#profile_detail_wrapper").getNiceScroll().hide();
    }
}

// 关注者列表/路线列表滚动
$(function () {
    $(".profile_content_body").niceScroll({});
    $("#profile_detail_wrapper").niceScroll({});
});


// 检查关注用户数量是否为零
$(check_follow_empty);

// 检查关注路线数量是否为零
$(check_route_empty);

// 通过导航栏转移
$(function () {
    $(".profile_nav_aside > p").on("click", function () {
        switch_nav($(this).attr("index"));
    })
});

// 通过顶部标签栏转移
$(function () {
    $("#profile_follow_user_num_td").on("click", function () {
        switch_nav(1);
    })
});
$(function () {
    $("#profile_follow_route_num_td").on("click", function () {
        switch_nav(2);
    })
});

// 取消关注用户
$(function () {
    $(".profile_user_follow").on("click", function () {
        var data = {
            "email": $(this).attr("email")
        };
        var self = this;
        $.post('unfollow_user', data, function (json) {
            if (json["status"] == "success") {
                var li_id = "#" + $(self).attr("li_id");
                $(li_id).remove();
                var cur_num = $("#profile_follow_user_counter").text() - 1;
                $("#profile_follow_user_counter").text(cur_num);
                check_follow_empty();
            }
        });
    })
});

// 删除路线
$(function () {
    $(".profile_route_follow").on("click", function () {
        var data = {
            "id": $(this).attr("route_id")
        };
        var self = $(this);
        $.post('delete_route', data, function (json) {
            self.parent().remove();
            var cur_num = $("#profile_follow_route_counter").text() - 1;
            $("#profile_follow_route_counter").text(cur_num);
            check_route_empty();
            $('li.route').each(function (index, el) {
                if ($(el).data('route-id') == self.attr("route_id")) {
                    $('ul#routes-list').trigger('remove-route', [$(el), true]);
                }
            })
        });
    })
});

// 路线点击跳转
$(function () {

    $('.profile_route_entry').click(function (event) {
        if (event.target != this) {
            return;
        }
        ;
        $('#fullpage').moveLeft();
        var self = $(this);
        $('li.route').each(function (index, el) {
            if ($(el).data('route-id') == self.find(".profile_route_follow").attr("route_id")) {
                $(el).click();
            }
        })

    });
});

// 添加路线同步
$(function () {
    $('#profile_route_ul').on("add-route", function (event, route) {
        var newEl = createProfileRouteElement();
        newEl.find(".profile_route_name").text(route.name);
        newEl.find(".profile_route_date").text(route.date);
        newEl.find(".profile_route_site").text(route.getMarkerNamesArray());
        newEl.find(".profile_route_follow").attr("route_id", route.id);

        newEl.click(function (event) {
            if (event.target != this) {
                return;
            }
            ;
            var self = $(this);
            $('#fullpage').moveLeft();
            $('li.route').each(function (index, el) {
                if ($(el).data('route-id') == self.find(".profile_route_follow").attr("route_id")) {
                    $(el).click();
                }
            })
        });
        newEl.find(".profile_route_follow").on("click", function () {
            var data = {
                "id": $(this).attr("route_id")
            };
            var self = $(this);
            $.post('delete_route', data, function (json) {
                self.parent().remove();
                var cur_num = $("#profile_follow_route_counter").text() - 1;
                $("#profile_follow_route_counter").text(cur_num);
                check_route_empty();
                $('li.route').each(function (index, el) {
                    if ($(el).data('route-id') == self.attr("route_id")) {
                        $('ul#routes-list').trigger('remove-route', [$(el), true]);
                    }
                })
            });
        });

        $("#profile_route_ul").prepend(newEl);
        $("#profile_route_body_wrapper").show();
        $("#profile_content_empty_route").hide();
        var cur_num = parseInt($("#profile_follow_route_counter").text()) + 1;
        $("#profile_follow_route_counter").text(cur_num);
    })
});

function createProfileRouteElement() {
    var profileRouteHTML = "<li class=\"profile_route_entry\">\n" +
        "<div class=\"profile_route_name\"></div>\n" +
        "<div class=\"profile_route_date\"></div>\n" +
        "<div class=\"profile_route_site\"></div>\n" +
        "<div class=\"profile_route_follow\">\n" +
        "删除路线\n" +
        "</div>\n" +
        "</li>";
    return $(profileRouteHTML);
}


// 删除路线同步
$(function () {
    $('#profile_route_ul').on("remove-route", function (event, routeId) {
        $("#profile_route_ul").find("[route_id=" + routeId + "]").parent().remove();
        var cur_num = $("#profile_follow_route_counter").text() - 1;
        $("#profile_follow_route_counter").text(cur_num);
        check_route_empty();
    })
});

// 改名同步
$(function () {
    $('#profile_route_ul').on("change-name", function (event, routeId, newName) {
        $("#profile_route_ul").find("[route_id=" + routeId + "]").parent().find(".profile_route_name").text(newName);
    })
});