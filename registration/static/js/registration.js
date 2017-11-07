$(function() {
    $('input[type="text"]').attr('autocomplete', 'off');
    $('input[type="text"]').attr('spellcheck', 'false');

    $("input").not('input[type="submit"]').keyup(function () {
        $(this).parent().addClass('input-focused');
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

    $('#login-btn').click(function () {
        login_click.call(this, false)
    });
    $('#signup-btn').click(function () {
        signup_click.call(this, false);
    });

    /* Ajax 检测login email是否有效 */
	$("#id_login_email").blur(function () {
	    var email = $(this).val();
	    if(email.length === 0){
	        return;
        }
	    if(!is_email_valid(email)){
	        addError(this, "Email格式无效");
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
function login_click(silent) {
        $(this).siblings('.title-btn').removeClass('menu-slide-active');
		$(this).addClass('menu-slide-active');
		$(".login-wrapper input").removeAttr("tabindex");
		$(".signup-wrapper input").attr('tabindex', "-1");
		if(silent) {
		    silentMoveToSlide('m-cur-slide-', 'log-section', 1)
        }else{
            moveToSlide('m-cur-slide-', 'log-section', 1);
        }
}
function signup_click(silent) {
    $(this).siblings('.title-btn').removeClass('menu-slide-active');
    $(this).addClass('menu-slide-active');
    $(".signup-wrapper input").removeAttr("tabindex");
    $(".login-wrapper input").attr('tabindex', "-1");
    if(silent){
        silentMoveToSlide('m-cur-slide-','log-section',2);
    }else{
        moveToSlide('m-cur-slide-','log-section',2);
    }
}
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
