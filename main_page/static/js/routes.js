$(function() {
	var $placesList = $('ul#places-list');
	var $routesList = $('ul#routes-list');
	var $routeslistPS = new PerfectScrollbar('#routes-list');
	var $placeslistPS = new PerfectScrollbar('#places-list');
	var stylesheet = $('style[name=impostor_size]')[0].sheet;
    var rule = stylesheet.rules ? stylesheet.rules[0].style : stylesheet.cssRules[0].style;

	// For Test Use
	$('#routes-slides').addRightArrow($('.route-edit-icon .fa'))
	$('#routes-slides').addLeftArrow($('.route-tool-return-routes .fa'))
	// --

	$('#routes-slides').mslider({
		initSlide: 0,
		handler: function(target){
			switch(target){
				case 0:
					$routesList.trigger('update-thumbnail');
					$routeslistPS && $routeslistPS.update();
					$routesList.sortable('refresh')
					break;
				case 1:
					break;
			}
		}
	});


	$routesList.sortable({
	    placeholder: 'marker',
	    items: 'li.route',
	    containment: 'parent',
	    axis: "y",
	    cursor: "default",
	    opacity: 0.5,
	    tolerance: "pointer",
	    start: function(ev, ui) {
	        var next = ui.item.nextAll('li:not(.marker)').first();
	        next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
	        setPadding(rule, ui.helper.outerHeight(true));
	        setTimeout(next.css.bind(next, {'transition':'border-top-width 150ms linear'}));
	    },
	    stop: function(ev, ui) {
	        var next = ui.item.next();
	        next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
	        setTimeout(next.css.bind(next, {'transition':'border-top-width 150ms linear'}));
	    }
	});


	$routesList.on(
		{
			'add-route': function(event){
				var newRouteElement = createRrouteElement();

				mExtMap.routes.createRoute({
					callback: function(route){

						/*补全HTML */
						newRouteElement.data('route-id', route.id);
						newRouteElement.find('.route-name').text(route.name);

						/* 补全事件 */
						newRouteElement.click(function(event) {
							$(this).addClass('active').siblings('.route').removeClass('active');
							mExtMap.routes.showRoute($(this).data('route-id'));
							mExtMap.geoMarkers.curMarker && $('#map').trigger('marker-click', [mExtMap.geoMarkers.curMarker.id]);
							$placesList.trigger('refresh');
						});


						 // Edit Icon
						$('#routes-slides').addRightArrow(newRouteElement.find('.route-edit-icon .fa'));

						// Delete Icon
						newRouteElement.find('.route-delete-icon .fa').click(function(event) {
							$routesList.trigger('remove-route', [newRouteElement]);
							return false;
						});
						/* 添加元素UI */
						newRouteElement.prependTo($('#routes-list')).show(400, function(){
							// Refresh SlideBar
							$routeslistPS && $routeslistPS.update();
							$routesList.sortable('refresh');
						});
						newRouteElement.trigger('click');
						return false;
					}
				})
			},
			'remove-route': function(event, routeElement){
				var route = mExtMap.routes.getRouteById(routeElement.data('route-id'));
				mExtMap.routes.removeRoute(route.id);
				routeElement.hide(400, function() {
					routeElement.remove();
					$routeslistPS && $routeslistPS.update();
					$routesList.sortable('refresh');
					// $routesList.trigger('refresh-layout');
					$('#map').trigger('marker-click', [mExtMap.geoMarkers.curMarker.id])
				});
				return false;
			},
			'update-thumbnail': function(event){
				mExtMap.toImageSrc('png', function(src){
					$routesList.children('.route.active').find('img').attr('src', src);
				});
				return false;
			},
		}
	);


	$('#create-route-wrapper').click(function(event) {
		$routesList.trigger('add-route');
	});



	/* Input */
	$('.route-name-editable-wrapper').click(function(event) {
		$(this).addClass('editable');
		$(this).children('input').select();
	});
	$('.route-name-editable-wrapper input').keypress(function(e) {
	    if(e.which == 13) {
	        $(this).trigger('blur');
	    }
	});
	$('.route-name-editable-wrapper input').blur(function(event) {
		var newName = $(this).val();
		$.post('modify_route_name', {id: mExtMap.routes.getCurRoute().id, name: newName}, function(data) {
			mExtMap.routes.getCurRoute().name = data['name'];
			$routesList.children('.active').find('.route-name').text(data['name']);
		});

		$(this).parent().removeClass('editable');
	});

	/* Places Tools */
	$('.route-tool-delete .fa').click(function(event) {
		$placesList.trigger('remove-place', [mExtMap.geoMarkers.curMarker.id])
	});


	/*Places Events*/

	$placesList.sortable({
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
	        setTimeout(next.css.bind(next, {'transition':'border-top-width 70ms linear'}));
	    },
	    change: function(ev, ui){
	    	var tragetPosition = ui.placeholder.index("#places-list li:not(.ui-sortable-helper)");
	    	var markerId = ui.item.data('marker-id');
	    	mExtMap.routes.getCurRoute().changeMarkerToPosition(markerId ,tragetPosition);
	    	$placesList.trigger('sort');
	    },
	    stop: function(ev, ui) {
	        var next = ui.item.next();
	        next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
	        setTimeout(next.css.bind(next, {'transition':'border-top-width 70ms linear'}));
	    }
	});

	$('#add-place-wrapper').on('click', function(event) {
		if($(this).hasClass('active')){
			$placesList.trigger('add-place', [mExtMap.geoMarkers.curMarker.id])
		}
	});


	$placesList.on(
		{
			'marker-click': function(event, markerId) {
				var hasMarker = false;
				$(this).children('li.place').each(function(index, element) {
					if($(element).data('marker-id') == markerId){
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
				hasMarker ? $('.route-tool-delete').show() : $('.route-tool-delete').hide()
			},
			'add-place': function(event, markerId) {
				var marker = mExtMap.geoMarkers.getMarkerById(markerId);
				var newPlaceElement = createPlaceElement();
				/* 补全元素属性和html */
				newPlaceElement.data('marker-id', marker.id);
				newPlaceElement.find('.place-index').text($placesList.children('li.place').length + 1);
				newPlaceElement.find('.place-name').text(marker.name);
				/* 补全元素事件 */
				newPlaceElement.click(function(event) {
					$('#add-place-wrapper').trigger('marker-click',[$(this).data('marker-id')]);
				});
				/* 执行逻辑 */
				mExtMap.routes.getCurRoute().addMarker(marker.id);
				/* 添加元素UI */
				newPlaceElement.insertBefore("#add-place-wrapper").show(400, function() {
					$placesList.trigger('refresh-layout');
				});
				/* 触发事件 */
				$('#add-place-wrapper').trigger('marker-click',[marker.id]);
				return false;
			},
			'remove-place': function(event, markerId){
				var toRemove = $('.place.active');
				if(toRemove){
					mExtMap.routes.getCurRoute().removeMarker(markerId);
					toRemove.hide(400, function() {
						toRemove.remove();
						$placesList.trigger('refresh-layout');
					});
				}
				return false;
			},
			'refresh': function(event){
				var curRoute = mExtMap.routes.getCurRoute();

				var oldRouteId = $placesList.data('route-id');
				var newRouteId = curRoute ? curRoute.id : -1;

				// 不需要更新
				if(newRouteId == oldRouteId){
					return false;
				}
				$placesList.children('li.place').remove();
				$placesList.children('input').val('');

				// 更新但没有路线
				if(newRouteId == -1){
					$placeslistPS && $placeslistPS.update();
					$placesList.sortable("refresh")
					return false;
				}
				$('.places-content input').val(mExtMap.routes.getCurRoute().name)
				mExtMap.routes.getCurRoute().getMarkerArray().forEach( function (marker, index) {
					var newPlaceElement = createPlaceElement().css('display', 'block');
					/* 补全元素属性和html */
					newPlaceElement.data('marker-id', marker.id);
					newPlaceElement.find('.place-index').text(index + 1);
					newPlaceElement.find('.place-name').text(marker.name);
					newPlaceElement.insertBefore("#add-place-wrapper");
				});
				/* 补全事件 */
				$placesList.children('li.place').click(function(event) {
					$('#add-place-wrapper').trigger('marker-click',[$(this).data('marker-id')]);
				});
				$placeslistPS && $placeslistPS.update();
				$placesList.sortable("refresh");
				mExtMap.geoMarkers.curMarker && $placesList.trigger('marker-click', [mExtMap.geoMarkers.curMarker.id]);
				return false;
			},
			'refresh-layout': function(event){
				$placeslistPS.update();
				$placesList.sortable("refresh");
				return false;
			}
		}
	);
});

function createRrouteElement(options){
	var routeHTML =
	"\
	<li class='route' style='display:none'>\
		<img class='route-thumbnail' src='http://localhost:8000/static/img/default_thumbnail.jpg'>\
		<span class='fa-stack fa-2x checked-icon'>\
	        <i class='fa fa-circle fa-stack-2x'></i>\
	        <i class='fa fa-check fa-stack-1x'></i>\
	    </span>\
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
	</li>\
	" 
	return $(routeHTML);
}

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

function setPadding(rule, atHeight) {
    rule.cssText = 'border-top-width: '+ atHeight+'px'; 
};