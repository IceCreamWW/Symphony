
$(function() {
	$(".map-arrow-left").click(function(event) {
		movePreSlide('m-cur-slide-', 'map-right-div-section');
	});
	$(".map-arrow-right").click(function(event) {
		moveNextSlide('m-cur-slide-', 'map-right-div-section');
	});
});
