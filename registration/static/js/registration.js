$(function() {
	$('input[type="text"]').attr('autocomplete','off');
	$('input[type="text"]').attr('spellcheck','false');
	$('form').attr('autocomplete','off');


	$("input").not('input[type="submit"]').focusin(function() {
		$(this).parent().addClass('input-focused');
	});

	$(".login-wrapper input").not('input[type="submit"]').click(function () {
		$(".login-wrapper .error-div").remove();
    });
	$(".signup-wrapper input").not('input[type="submit"]').click(function () {
		$(".signup-wrapper .error-div").remove();
    });

    $("input").not('input[type="submit"]').hover(
        function() {
            $(this).parent().addClass('input-hovered');
        },
        function () {
            $(this).parent().removeClass('input-hovered');
        });

	$("input").not('input[type="submit"]').focusout(function() {
		$(this).parent().removeClass('input-focused')
	});

	$('#login-btn').click(function () {
        login_click.call(this, false)
    });
	$('#signup-btn').click(function () {
        signup_click.call(this, false);
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