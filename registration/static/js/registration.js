$(function() {
	$('input[type="text"]').attr('autocomplete','off');
	$('input[type="text"]').attr('spellcheck','false');

	$("input").not('input[type="submit"]').focusin(function() {
		$(this).parent().addClass('input-focused')
	});
	$("input").not('input[type="submit"]').focusout(function() {
		$(this).parent().removeClass('input-focused')
	});
	$('#login-btn').click(function() {
		$(this).siblings('.title-btn').removeClass('section-active')
		$(this).addClass('section-active')
		moveToSlide('m-cur-slide-','log-section',1)
	});
	$('#signup-btn').click(function() {
		$(this).siblings('.title-btn').removeClass('section-active')
		$(this).addClass('section-active')
		moveToSlide('m-cur-slide-','log-section',2)
	});
});