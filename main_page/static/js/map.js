function initMap() {
	$.ajax({
    type: "get",
    url: "../static/json/night_map_style.json",
    dataType: "json",
    success: function(data) {
      load_map(data)
    },
    error: function() { 
      alert("json load failed")
      load_map(null) 
    }
  });
}
function load_map(map_style_json){
    var styledMapType = new google.maps.StyledMapType(map_style_json, {name:"夜间模式"})
    var center_coordinate = {lat: -34.397, lng: 150.644}; 
    var map = new google.maps.Map(document.getElementById('map'), {
      center: center_coordinate,
      zoom: 5,
      zoomControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative',
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'map_night']
        }
      });

    var marker = new google.maps.Marker({
      position: center_coordinate,
      map: map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5,
        strokeColor: "rgba(255,255,0,0.5)",
        strockOpacity: 0.5
      },
      draggable: false,
      user_tag : "test_tag"
    })
    marker.addListener('click', function () {
        map.setZoom(8)
        map.panTo(marker.getPosition())
    })

    map.mapTypes.set('map_night', styledMapType);
    map.setMapTypeId('map_night');
    var map_right_div = $('#map_right_info_div')
    map_right_div.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(map_right_div[0])
  }