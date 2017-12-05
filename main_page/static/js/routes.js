var $routeslistPS;
$(function() {
	$('#routes-slides').mslider();
	$routeslistPS = new PerfectScrollbar('#routes-list');
	$('#create-route-icon').click(function(event) {
		extMap.routes.createRoute({
			callback: function(route){
				var routeDiv = createRrouteDiv({
					id: route.id,
					name: route.name
				});
				routeDiv.prependTo($('#routes-list')).show(400, function(){
					$routeslistPS.update();
					// Refresh SlideBar
				})
			}
		})
	});
});

function createRrouteDiv(options){
	var routehtml = 
	"\
	<div class='route' style='display:none'>\
		<img class='route-thumbnail' src='http://localhost:8000/static/img/default_thumbnail.jpg'>\
		<div class='route-control'>\
			<div class='route-name-wrapper'>\
				<div class='route-name'></div>\
			</div>\
            <hr align='center'>\
			<div class='route-icons-list'>\
				<div class='route-icons-wrapper'>\
					<div class='route-edit-icon route-icon'>\
                        <i class='fa fa-pencil-square-o' aria-hidden='true'></i>\
                    </div>\
					<div class='route-delete-icon route-icon'>\
						<i class='fa fa-trash-o' aria-hidden='true'></i>\
					</div>\
					<div class='route-detail-icon route-icon'>\
						<i class='fa fa-list-ul' aria-hidden='true'></i>\
					</div>\
				</div>\
			</div>\
		</div>\
	</div>\
	" 
	var routeDiv = $(routehtml).attr({
		"route-id": options.id
	});
	routeDiv.find(".route-name").text(options.name)
	$('#routes-slides').addRightArrow(routeDiv.find('.route-detail-icon .fa'))	
	return routeDiv;
}