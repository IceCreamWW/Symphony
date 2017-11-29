(function ($) {
	$.fn.mslider = function (options) {
		var settings = $.extend({

			initAnimate			: 	false,
			transition			: 	'500ms',
			extendTransition 	: 	false,	 // Not Implemented
			initSlide			: 	0,
			leftArrow			: 	undefined,
			rightArrow			:  	undefined,
			menu 				: 	undefined,

		}, options)

		var self = $(this);

		self.children().wrapAll('<div class="m-slider"></div>')
		var $slider = self.getMSlider();
		self.css('overflow-x', 'hidden');


		$slider.css({
			position	: 	'relative',
			height		: 	'100%',
			width 		: 	self.getSlideCnt() + '00%',
			transition	: 	settings.transition,
		});
		$slider.children('.m-slide').css({
			width 	: 	100 / self.getSlideCnt() + '%',
			float	: 	'left',
		});
		$slider.children('.m-slide').first().addClass('m-slide-active')

		$slider.data('m-menu', settings.menu);
		$slider.data('m-leftArrow', settings.leftArrow);
		$slider.data('m-rightArrow', settings.rightArrow);

		if(settings.initAnimate){
			this.moveToSlideNumber(settings.initSlide);
		}else{
			this.silentMoveToSlideNumber(settings.initSlide);
		}


		// Menu Item Click Event, Animate to Div According Menu Item Index
		$(settings.menu).children().click(function() {
			self.moveToSlideNumber($(this).index())
		});
		

		$(settings.leftArrow).click(function() {
			self.moveLeft()
		})
		$(settings.rightArrow).click(function() {
			self.moveRight()
		})
	}	

	$.fn.moveToSlideNumber = function (target) {
		var slidesCnt = $(this).getSlideCnt();
		target = (target + slidesCnt) % slidesCnt;
		var translateX = -target * 100 / slidesCnt  + "%";
		var $slider = $(this).getMSlider();


		$slider.css('transform', 'translateX('+ translateX + ')');
		$slider.children('.m-slide').eq(target)
				.addClass('m-slide-active')
				.siblings('.m-slide').removeClass('m-slide-active');

		$menu = $($slider.data('m-menu'))
		typeof $menu != "undefined" && 
				$menu.children().eq(target)
						.addClass('m-menu-active').siblings()
						.removeClass('m-menu-active');
	}

	$.fn.moveToSlideSelector = function (target) {
		var target = $(this).getMSlider().children(target + '.m-slide').index();
		$(this).moveToSlideNumber(target)	
	}
	$.fn.moveLeft = function () {
		var curSlideIndex = $(this).getActiveSlideIndex();
		typeof curSlideIndex != 'undefined' && curSlideIndex != -1 && $(this).moveToSlideNumber(curSlideIndex - 1)
	}
	$.fn.moveRight = function () {
		var curSlideIndex = $(this).getActiveSlideIndex();
		typeof curSlideIndex != 'undefined' && curSlideIndex != -1 && $(this).moveToSlideNumber(curSlideIndex + 1)	
	}
	$.fn.silentMoveToSlideNumber = function (target) {
		var $slider = $(this).getMSlider();
		var transition = $slider.css('transition');
		$slider.css('transition', 'none');
		$(this).moveToSlideNumber(target);
		setTimeout(function(){
			$slider.css('transition', transition);
		}, 10)
	}
	$.fn.silentMoveLeft = function () {
		var curSlideIndex = $(this).getActiveSlideIndex();
		typeof curSlideIndex != 'undefined' && curSlideIndex != -1 && $(this).silentMoveToSlideNumber(curSlideIndex - 1)
	}
	$.fn.silentMoveRight = function () {
		var curSlideIndex = $(this).getActiveSlideIndex();
		typeof curSlideIndex != 'undefined' && curSlideIndex != -1 && $(this).silentMoveToSlideNumber(curSlideIndex + 1)	
	}
	$.fn.silentMoveToSlideSelector = function (target) {
		var target = $(this).getMSlider().children(target + '.m-slide').index();
		$(this).silentMoveToSlideNumber(target)	
	}
	
	$.fn.getSlideCnt = function () {
		return $(this).getMSlider().children('.m-slide').length;
	}
	$.fn.getActiveSlideIndex = function(){
		return $(this).getMSlider().children('.m-slide-active').index();
	}
	$.fn.getActiveSlide = function(){
		return $(this).getMSlider().children('.m-slide-active');
	}
	$.fn.getMSlider = function () {
		return $(this).children('.m-slider').first();
	}
	$.fn.getMSliderTransition = function(){
		var rawTransition = $(this).getMSlider().css('transition')
		return parseFloat(rawTransition.split(' ')[1])
	}

}(jQuery));