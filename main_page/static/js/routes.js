$(function() {
	var $placesList = $('ul#places-list');
	var $routesList = $('ul#routes-list');
	var $routeslistPS = new PerfectScrollbar('#routes-list');
	var $placeslistPS = new PerfectScrollbar('#places-list');
	var stylesheet = $('style[name=impostor_size]')[0].sheet;
    var rule = stylesheet.rules ? stylesheet.rules[0].style : stylesheet.cssRules[0].style;

    var ROUTES_SLIDE = 2;
    var PLACES_SLIDE = 3;

	// For Test Use
	$('#routes-slides').addLeftArrow($('.places-tool-return-routes .fa'))
	// --

	$('#routes-slides').mslider({
		initSlide: ROUTES_SLIDE,
		menu: "#routes-menu",
		after: function(target){
			switch(target){
				case ROUTES_SLIDE:
					if (!mExtMap.routes.getCurRoute()) {
						break;
					}
					$routesList.trigger('commit', [$('.route.active')]);
					$routeslistPS && $routeslistPS.update();
					$routesList.sortable('refresh');
					break;
				case PLACES_SLIDE:
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
						newRouteElement.find('a').attr('href', genSNShref(route.name, 'http://localhost:8000/static/img/default_thumbnail.jpg'));

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
			'load-routes': function(event){
				mExtMap.routes.loadRoutes(function(routes){
					routes.forEach(function(route){
						var newRouteElement = createRrouteElement();
						/*补全HTML */
						newRouteElement.data('route-id', route.id);
						newRouteElement.find('.route-name').text(route.name);
						newRouteElement.find('a').attr('href', genSNShref(route.name, 'http://localhost:8000/static/img/default_thumbnail.jpg'));

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
						newRouteElement.prependTo($('#routes-list')).show(function(){
							// Refresh SlideBar
							$routeslistPS && $routeslistPS.update();
							$routesList.sortable('refresh');
						});
					})
					$placesList.children().first().click();
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
					mExtMap.geoMarkers.curMarker && $('#map').trigger('marker-click', [mExtMap.geoMarkers.curMarker.id]);
				});
				return false;
			},
			'commit': function(event, routeElement){
				mExtMap.toImageSrc('png', function(src){
					routeElement.find('img').attr('src', src);
					mExtMap.routes.getRouteById(routeElement.data('route-id')).save();
				});
				return false;
			},
		}
	);


	$('#create-route-wrapper').click(function(event) {
		$routesList.trigger('add-route');
	});

	/* Undo and Redo */
	$(document).keydown(function(e){
		if($('#routes-slides').getActiveSlideIndex() != PLACES_SLIDE){
			return true;
		}
		if( e.which === 90 && e.ctrlKey && !e.shiftKey ){
			$placesList.trigger('undo');
		} 
		if( e.which === 90 && e.ctrlKey && e.shiftKey ){
			$placesList.trigger('redo');
    	}
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
	$('.places-tool-delete .fa').click(function(event) {
		$placesList.trigger('remove-place', [mExtMap.geoMarkers.curMarker.id])
	});
	$('.places-tool-undo .fa').click(function(event) {
		$placesList.trigger('undo');
	});
	$('.places-tool-redo .fa').click(function(event) {
		$placesList.trigger('redo');
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
	    	mExtMap.routes.getCurRoute().forceCommit();
	    },
	    change: function(ev, ui){
	    	var tragetPosition = ui.placeholder.index("#places-list li:not(.ui-sortable-helper)");
	    	var markerId = ui.item.data('marker-id');
	    	mExtMap.routes.getCurRoute().changeMarkerToPosition(markerId ,tragetPosition);
	    },
	    stop: function(ev, ui) {
	        var next = ui.item.next();
	        next.css({'-moz-transition':'none', '-webkit-transition':'none', 'transition':'none'});
	        setTimeout(next.css.bind(next, {'transition':'border-top-width 70ms linear'}));
	    	$placesList.trigger('sort-list');
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
				hasMarker ? $('.places-tool-delete').addClass('active') : $('.places-tool-delete').removeClass('active');
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
					$placeslistPS.update();
					$placesList.sortable("refresh");
				});

				mExtMap.routes.getCurRoute().canUndo() ? 
				$('.places-tool-undo').addClass('active') : $('.places-tool-undo').removeClass('active');
				
				mExtMap.routes.getCurRoute().canRedo() ? 
				$('.places-tool-redo').addClass('active') : $('.places-tool-redo').removeClass('active');
				
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
					});
					mExtMap.routes.getCurRoute().canUndo() ? 
					$('.places-tool-undo').addClass('active') : $('.places-tool-undo').removeClass('active');
					
					mExtMap.routes.getCurRoute().canRedo() ? 
					$('.places-tool-redo').addClass('active') : $('.places-tool-redo').removeClass('active');
				}
				return false;
			},
			'undo': function(event){
				if (!mExtMap.routes.getCurRoute().canUndo()) {
					return false;
				}
				mExtMap.routes.getCurRoute().undo();
				$placesList.trigger('refresh');
			},
			'redo': function(event){
				if(!mExtMap.routes.getCurRoute().canRedo()){
					return false;
				}
				mExtMap.routes.getCurRoute().redo();
				$placesList.trigger('refresh');
			},
			'sort-list': function(event){
				var hasChange = false;
				$('ul#places-list li.place').each(function(index, el) {
					if ($(el).find('.place-index').text() != index + 1) {
						hasChange = true;
						$(el).find('.place-index').text(index + 1);
					}
				});
				if (!hasChange) {
					mExtMap.routes.getCurRoute().undo();
					mExtMap.routes.getCurRoute().clearStateQueue();
				}
				mExtMap.routes.getCurRoute().canUndo() ? 
				$('.places-tool-undo').addClass('active') : $('.places-tool-undo').removeClass('active');
				
				mExtMap.routes.getCurRoute().canRedo() ? 
				$('.places-tool-redo').addClass('active') : $('.places-tool-redo').removeClass('active');
			},
			'refresh': function(event, forceRefresh){
				forceRefresh = forceRefresh || false

				var curRoute = mExtMap.routes.getCurRoute();
				var oldRouteId = $placesList.data('route-id');
				var newRouteId = curRoute ? curRoute.id : -1;

				// 不需要更新
				if(newRouteId == oldRouteId && !forceRefresh){
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

				mExtMap.routes.getCurRoute().canUndo() ? 
				$('.places-tool-undo').addClass('active') : $('.places-tool-undo').removeClass('active');
				
				mExtMap.routes.getCurRoute().canRedo() ? 
				$('.places-tool-redo').addClass('active') : $('.places-tool-redo').removeClass('active');
				
				$placeslistPS.update();
				$placesList.sortable("refresh");
				mExtMap.geoMarkers.curMarker && $placesList.trigger('marker-click', [mExtMap.geoMarkers.curMarker.id]);
				
				return false;
			},
		}
	);
	setTimeout(function(){
		$routesList.trigger('load-routes')
	},2000);
    
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
						<a>\
                        	<i class='fa fa-share-alt' aria-hidden='true'></i>\
                    	</a>\
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

function genSNShref(title, datasrc){
    var p = {
        url: "http://symphony.yuhong-zhong.com", /*要分享的网站的URL*/
        desc: '', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
        title: title, /*分享标题(可选)*/
        summary: '来自Symphony', /*分享摘要(可选)*/
        pics: datasrc, /*分享图片(可选)*/
        flash: '', /*视频地址(可选)*/
        site: 'site', /*分享来源(可选) 如：QQ分享*/
        style: '100',
        width: 32,
        height: 32
    };
    var s = [];
    for (var i in p) {
        s.push(i + '=' + encodeURIComponent(p[i] || ''));
    }
    return "http://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
    // document.write(['<a class="qcShareQQDiv" href="http://connect.qq.com/widget/shareqq/index.html?', s.join('&'), '"target="_blank">分享给QQ好友</a>'].join(''));
}