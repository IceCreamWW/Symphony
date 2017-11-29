
$(function() {

    $("#map-info-slides").mslider();

	
    //Prevent Tab Break Layout
    $("#map-info-slides").on('keydown', '*', function(event) {
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



