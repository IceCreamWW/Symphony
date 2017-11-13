
$(function() {
	$(".map-arrow-left").click(function() {
		movePreSlide('m-cur-slide-', 'map-right-div-section');
	});
	$(".map-arrow-right").click(function() {
		moveNextSlide('m-cur-slide-', 'map-right-div-section');
	});

    $("#map_right_info_div").on('keydown', '*', function(event) {
        if (event.keyCode == 9) {
            event.preventDefault();            
        }
    });

	$('#id-search-movie-form').submit(function (e) {
        e.preventDefault();
	    var movie = $('#id-search-movie-input').val();
	    $.getJSON("search_movie", {"movie": movie}, function (json, textStatus) {
            $("#movies-content").html(json["html"])

            $("#movies-content img").load(function () {
                setTimeout(function() {
                    $("#movies-content").getNiceScroll().resize()
                },100)
            }).each(function() {
                if(this.complete) $(this).load();
            });
        })
    })

});



