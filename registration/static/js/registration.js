$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) {
              callback();
            }
        });
        return this;
    }
});
$(function() {
    $('input[type="text"]').attr('autocomplete', 'off');
    $('input[type="text"]').attr('spellcheck', 'false');

    $("input").not('input[type="submit"]').focus(function () {
        $(this).parent().addClass('input-focused');
    });

    /* 不能使用focus，Chrome自动聚焦会直接消除错误样式 */
    $("input").not('input[type="submit"]').keyup(function () {
        if ($(this).attr("id").indexOf("id_password") < 0) {
            $(this).siblings(".error-div").addClass("no-error-div").removeClass("error-div")
        }
    });

    $("input").not('input[type="submit"]').hover(
        function () {
            $(this).parent().addClass('input-hovered');
        },
        function () {
            $(this).parent().removeClass('input-hovered');
        });

    $("#login-form").submit(function (e) {
        if ($(".login-wrapper .error-div").length != 0) {
            $(".login-wrapper .error-div").animateCss('flash');
            e.preventDefault()
        }
    });

    $("#signup-form").submit(function (e) {
        if ($(".signup-wrapper .error-div").length != 0) {
            $(".signup-wrapper .error-div").animateCss('flash');
            e.preventDefault()
        }
    });

    $("input").not('input[type="submit"]').focusout(function () {
        $(this).parent().removeClass('input-focused')
    });

    /* Ajax 检测login email是否有效 */
	$("#id_login_email").blur(function () {
	    var email = $(this).val();
	    if(email.length === 0){
	        return;
        }
	    if(!is_email_valid(email)){
	        addError.call(this, "Email格式无效");
            return;
        }
        var self = $(this);
        $.getJSON("check_login_email", {"email": email}, function (json, textStatus) {
            if(json["valid"]){
                removeError.call(self);
            }else{
                addError.call(self, "Email不存在")
            }
        })
	});
    /* Ajax 检测signup email是否有效 */
    $("#id_signup_email").blur(function () {
        var email = $(this).val();
        if(email.length === 0){
            return;
        }
	    if(!is_email_valid(email)){
            addError.call(this, "Email格式无效");
            return;
        }
        var self = $(this);
        $.getJSON("check_signup_email", {"email": email}, function (json, textStatus) {
            if(json["valid"]){
                removeError.call(self)
            }else{
                addError.call(self, "Email已被注册")
            }
        });
    });

	/* 密码长度检测 */
    $("#id_password").keyup(function () {
        if($(this).val().length < 5){
            addError.call(this, "密码长度至少为5");
        }else{
            removeError.call(this)
        }
    });

    /* 密码一致性检测 */
	$("#id_password, #id_password_again").on('keyup', function () {
        if($("#id_password_again").val().length !== 0){
            check_password();
        }
    });
});

function check_password(){
    if ($("#id_password_again").val().length !== 0){
        if($("#id_password_again").val() !== $("#id_password").val()) {
            addError.call($('#id_password_again'), "两次输入密码不一致");
        }else {
            removeError.call($('#id_password_again'))
        }
    }
}

function is_email_valid(email) {
    email_regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if(email.search(email_regex) != 0){
        return false;
    } else{
      return true;
    }
}
function removeError(){
    $(this).siblings('.error-div,.no-error-div').removeClass('error-div').addClass('no-error-div')
}
function addError(errorText){
    $(this).siblings('.error-div,.no-error-div')
        .removeClass('no-error-div').text(errorText).addClass('error-div')
}
