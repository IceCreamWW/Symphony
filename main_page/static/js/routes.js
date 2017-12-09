//For Test Use
var $routeslistPS;
var $placeslistPS;

$(function() {
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

	var stylesheet = $('style[name=impostor_size]')[0].sheet;
    var rule = stylesheet.rules ? stylesheet.rules[0].style : stylesheet.cssRules[0].style;

	$('.sortable').sortable({
	    placeholder: 'marker',
	    items: 'li.place',
	    containment: 'parent',
	    axis: "y",
	    cursor: "default",
	    opacity: 0.5,
	    tolerance: "pointer",
	    start: function(ev, ui) {
	        var next = ui.item.nextAll('li:not(.marker)').first();
	        next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
	        /* 
        	开始拖拽后占位符长度应为 (fisrt-element ? 0 : margin-bottom +) margin-bottom +  outerHeight() 
          	由于prev-element具有margin-bottom, 只需要margin-bottom + outerHeight(true)
           	这恰好是一个格子的高度（因为这里的list-item不具有margin-top）
	        */
	        setPadding(rule, ui.helper.outerHeight(true));
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
	$placeslistPS = new PerfectScrollbar('#places-list');

	$('#create-route-wrapper').click(function(event) {
		mExtMap.routes.createRoute({
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



	/*Places Events*/
	var $placesList = $('ul#places-list')

	$('#add-place-wrapper').on('click', function(event) {
		if($(this).hasClass('active')){
			$placesList.trigger('place-add', [mExtMap.geoMarkers.curMarker])
		}
	});

	
	$placesList.on(
		{
			'marker-click': function(event, markerid) {
				var hasMarker = false;
				$(this).children('li.place').each(function(index, element) {
					if($(element).data('markerid') == markerid){
						$(element).addClass('active');
						hasMarker = true;
					}else{
						$(element).removeClass('active');
					}
				});	
				if (hasMarker) {
					$('#add-place-wrapper').removeClass('active');
				}else{
					$('#add-place-wrapper').addClass('active');
				}
			},
			'place-add': function(event, marker) {
				var newPlaceElement = createPlaceElement();
				/* 补全元素属性和html */
				newPlaceElement.data('markerid', marker.id);
				newPlaceElement.find('.place-index').text($placesList.children('li.place').length + 1);
				newPlaceElement.find('.place-name').text(marker.name);
				/* 补全元素事件 */
				newPlaceElement.click(function(event) {
					$('#add-place-wrapper').trigger('marker-click',[$(this).data('markerid')]);
				});
				/* 执行逻辑 */
				mExtMap.routes.getCurRoute().addMarker(marker.id);
				/* 添加元素UI */
				newPlaceElement.insertBefore("#add-place-wrapper").show(400, function() {
					$placesList.sortable("refresh")
					$placeslistPS.update();
				});
				/* 触发事件 */
				$('#add-place-wrapper').trigger('marker-click',[marker.id]);
			},
			'refresh': function(event){
				$placesList.children('li.place').remove();
				mExtMap.routes.getCurRoute().getMarkerArray().forEach( function (marker, index) {
					var newPlaceElement = createPlaceElement().css('display', 'block');
					/* 补全元素属性和html */
					newPlaceElement.data('markerid', marker.id);
					newPlaceElement.find('.place-index').text(index + 1);
					newPlaceElement.find('.place-name').text(marker.name);
					newPlaceElement.insertBefore("#add-place-wrapper");
				});
				/* 补全事件 */
				$placesList.children('li.place').click(function(event) {
					$('#add-place-wrapper').trigger('marker-click',[$(this).data('markerid')]);
				});
				$placesList.sortable("refresh")
				$placeslistPS.update();
			},
			'refresh-layout': function(event){
				$placeslistPS.update();
				$placesList.sortable("refresh")
			}
		});

});

function createPlaceElement(){
	var placeHTML =
	"\
	<li class='place' style='display:none'>\
        <div class='place-index'></div>\
        <div class='place-name'></div>\
    </li>\
    "
    return $(placeHTML);
}

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