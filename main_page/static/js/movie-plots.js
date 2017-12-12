$(function() {
	$moviePlotsList = $('#movie-plots-list');
	$moviePlotsList.niceScroll();
	// var $moviePlotsListPS = new PerfectScrollbar('#movie-plots-list');

	$moviePlotsList.on('show-plots', function(event, movieId) {
		$.getJSON('get_movie_plots', {id: movieId}, function(json, textStatus) {
			$moviePlotsList.children('.movie-plot').remove();
			json.forEach(function(plot){
				var plotElement = createMoviePlotElement();
				plotElement.find('.movie-plot-keyword').text(plot['keyword']);
				plotElement.find('.movie-plot-description').text(plot['description']);
				plotElement.attr('marker-id', plot['site_id']);
				plotElement.prependTo($moviePlotsList);
				plotElement.click(function(event) {
					$('#map').trigger('marker-click',[plot['site_id'], true]);
				});
			})
			$moviePlotsList.getNiceScroll().resize();
		});
		return false;		
	});
});

function createMoviePlotElement(){
	var plotHTML = 
	"\
	<li class='movie-plot'>\
		<div class='movie-plot-intro'>\
	        <h2 class='movie-plot-keyword'></h2>\
	        <div class='movie-plot-description'></div>\
	    </div>\
    </li>\
   ";
   return $(plotHTML)
}