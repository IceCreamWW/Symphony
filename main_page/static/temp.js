$(function() {
	var route = new Route();
	$('#add_route_btn').click(function(event) {
		/* Act on the event */
	});
	$('#add_marker_btn').click(function(event) {
		var marker = all_markers.getMarkerById(cur_marker);
		var path = poly.getPath();
		path.push(marker.position);
	});
});