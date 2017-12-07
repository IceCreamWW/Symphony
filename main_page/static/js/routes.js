//For Test Use
var $routeslistPS;

$(function() {

	var stylesheet = $('style[name=impostor_size]')[0].sheet;
    var rule = stylesheet.rules ? stylesheet.rules[0].style : stylesheet.cssRules[0].style;

	// For Test Use
	$('#routes-slides').addRightArrow($('.route-edit-icon .fa'))
	$('#routes-slides').addLeftArrow($('.route-tool-return-routes .fa'))
	// --

	$('#routes-slides').mslider({
		initSlide: 1,
		done: function(target){
				$routeslistPS && target==0 && $routeslistPS.update();
			}
	});

	setPadding($('li.place').outerHeight() * 2)
	$('.sortable').sortable({
	    placeholder: 'marker',
	    // placeholder: 'place',
	    items: 'li.place',
	    containment: 'parent',
	    axis: "y",
	    cursor: "default",
	    opacity: 0.5,
	    tolerance: "pointer",
	    start: function(ev, ui) {
	        var next = ui.item.nextAll('li.place').first();
	        next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
	        setPadding(rule, ui.item.outerHeight() + (ui.item.outerHeight() - ui.item.height()));
	        setTimeout(next.css.bind(next, {'transition':'border-top-width 0.1s ease-in'}));
	    },
	    change: function(){
	    	var fixme = 1;
	    },
	    stop: function(ev, ui) {
	        var next = ui.item.next();
	        next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
	        setTimeout(next.css.bind(next, {'transition':'border-top-width 0.1s ease-in'}));
	    }
	});

	$routeslistPS = new PerfectScrollbar('#routes-list');
	$('#create-route-wrapper').click(function(event) {
		extMap.routes.createRoute({
			callback: function(route){
				var routeDiv = createRrouteDiv({
					id: route.id,
					name: route.name
				});
				routeDiv.prependTo($('#routes-list')).show(400, function(){
					// Refresh SlideBar
					$routeslistPS.update();
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
					<div class='route-share-icon route-icon'>\
                        <i class='fa fa-share-square-o' aria-hidden='true'></i>\
                    </div>\
					<div class='route-delete-icon route-icon'>\
						<i class='fa fa-trash-o' aria-hidden='true'></i>\
					</div>\
					<div class='route-edit-icon route-icon'>\
						<i class='fa fa-pencil-square-o' aria-hidden='true'></i>\
					</div>\
				</div>\
			</div>\
		</div>\
	</div>\
	" 
	var routeDiv = $(routehtml).attr({
		"route-id": options.id
	});
	routeDiv.find(".route-name").text(options.name);
	updateRouteEvents(routeDiv);
	return routeDiv;
}
function updateRouteEvents(routeDiv){
	$('#routes-slides').addRightArrow(routeDiv.find('.route-edit-icon .fa'));
}
function setPadding(rule, atHeight) {
    rule.cssText = 'border-top-width: '+ atHeight+'px'; 
};