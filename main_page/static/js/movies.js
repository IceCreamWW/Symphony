$(function() {

	// var $moviesListPS = new PerfectScrollbar('#movies-list');
	$moviesList = $('#movies-list');
	$moviesList.niceScroll();

	$('#search-movie-form').submit(function(event) {
		event.preventDefault();
		$.getJSON('search_movie', $('#search-movie-form').serialize(), function(json, textStatus) {
				$moviesList.children('.movie').remove();
				$moviesList.children('.no-movie').hide();

				if (json.length == 0) {
					$moviesList.children('.no-movie').show();
					$moviesList.getNiceScroll().resize();
					// $moviesListPS.update();
					return;
				}

				json.forEach(function(movie){
					var movieElement = createMovieElement();
					movieElement.find('img.movie-img').attr({
						src: '/static/' + movie['img'],
					}); 
					movieElement.find('.movie-name').text(movie['name']);
					movieElement.find('.movie-name').attr('title',movie['name']);

					movieElement.find('.movie-description').text(movie['description']);
					movieElement.data('movie-id', movie['id']);

					$('#routes-slides').addLeftArrow(movieElement);
					movieElement.find('img').click(function(event) {
						$('#movie-plots-list').trigger('show-plots', movie['id']);
					});

					$moviesList.prepend(movieElement);
				})
				$moviesList.getNiceScroll().resize();
				// $moviesListPS.update();
		});	
	});
	
});

function createMovieElement(){
	var movieHTML=
	"\
	<div class='movie'>\
		<img class='movie-img'/>\
		<div class='movie-intro'>\
	        <h2 class='movie-name'></h2>\
	        <div class='movie-description'></div>\
	    </div>\
    </div>\
   ";
   return $(movieHTML);
}