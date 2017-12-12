$(function() {
	$('#map').on('marker-click', function(event, curMarkerId, realClick) {
		mExtMap.geoInfoWindow.close()
		if (!realClick) {
			return false;
		}
		$.getJSON('get_marker_plots', {id: curMarkerId}, function(json, textStatus) {
			var marker = mExtMap.geoMarkers.getMarkerById(curMarkerId);
			var outerWrapper = $("<div></div>");
			var plotsWrapper = createPlotsWrapper();
			plotsWrapper.find(".site-name").text(json['site']['name']);
			$plotsList = plotsWrapper.find('.plots-list');
			json['plots'].forEach(function(plot){
				var plotElement = createPlotElement();
				if(plot['img'].length == 0){
					plotElement.find('.plot-img').attr('src', '/static/movie.video/null.jpg');
				}else{
					plotElement.find('.plot-img').attr('src', '/static/' + plot['img']);
				}

				plotElement.find('.plot-movie-name').text(plot['movie_name']);
				plotElement.find('.plot-description').text(plot['description']);
				plotElement.find('img').on("error", function () {
					$(this).attr("src", "../static/movie.video/null.jpg");
            	})
				$plotsList.append(plotElement);
			});
			outerWrapper.html(plotsWrapper);
			mExtMap.geoInfoWindow.setOptions(
				{
					content: outerWrapper.html(),
					maxWidth: 450,
				});
			mExtMap.geoInfoWindow.open(mExtMap.geoMap, marker);


			$('.plots-content').css('overflow-x',"hidden !important")
			$('.gm-style-iw').prev('div').children().last().addClass('info-window');
        	$('.gm-style-iw').prev('div').children().attr('data-html2canvas-ignore', 'true');
        	$('.plots-content').attr('data-html2canvas-ignore', 'true');
        	$('.gm-style-iw').children().first().addClass('info-window-close');
        	$('.info-window-close').niceScroll();
			$('.gm-style-iw').next('div').addClass('close-icon');
		});
	});
});

function createPlotElement(){
	var plotHTML = 
	"\
	<li class='plot'>\
		<img class='plot-img'>\
		<div class='plot-intro'>\
			<div class='plot-movie-name'></div>\
			<div class='plot-description'></div>\
		</div>\
	</li>\
	";
	return $(plotHTML);
}
function createPlotsWrapper(){
	var wrapperHTML = 
	"<div class='plots-content'>\
		<div class='site-name'></div>\
		<ul class='plots-list'>\
		</ul>\
	</div>\
	";
	return $(wrapperHTML);
}