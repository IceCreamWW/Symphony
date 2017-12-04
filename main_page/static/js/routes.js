$(function() {
	$('#routes-slides').mslider();
	$('#create-route-icon').click(function(event) {
		extMap.routes.createRoute({
			callback: function(route){

			}
		})
	});
});

function createRrouteDiv(options){
	var routehtml = 
	"\
	<div class='route'>\
		<img class='route-thumbnail'>\
		<div class='route-control'>\
			<div class='route-name'></div>\
			<div class='route-icon-list'>\
				<div class='route-remove-icon route-icon'></div>\
				<div class='route-detail-icon route-icon'></div>\
			</div>\
		</div>\
	</div>\
	" 
	var routeDiv = $(routehtml).attr({
		route-id: options.id
	});
}