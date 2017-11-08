
$(function() {
	$(".map-arrow-left").click(function() {
		movePreSlide('m-cur-slide-', 'map-right-div-section');
	});
	$(".map-arrow-right").click(function() {
		moveNextSlide('m-cur-slide-', 'map-right-div-section');
	});

	$('#search_movie_btn').click(function () {
	    var movie = $('#id-search-movie-input').val();
	    $.getJSON("search_movie", {"movie": movie}, function (json, textStatus) {
            $("#movies-content").html(json["html"])

            $("#movies-content img").load(function () {
            $("#movies-content").getNiceScroll().resize()
            }).each(function() {
                if(this.complete) $(this).load();
            });

            setTimeout(function () {
                $("#movies-content").getNiceScroll().resize()
            }, 100)
        } )

    })
});



