var center_coordinate = {lat: -34.397, lng: 150.644}; 
var map, markercluster;
var allMarkers = []


function MapStatus(){

}


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
    map = new google.maps.Map(document.getElementById('map'), {
      center: center_coordinate,
      zoom: 5,
      zoomControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative',
      mapTypeControlOptions: {
        mapTypeIds: ['roadmap', 'map_night']
        }
      });
    
    map.mapTypes.set('map_night', styledMapType);
    map.setMapTypeId('map_night');
    var map_right_div = $('#map_right_info_div')
    map_right_div.index = 1;
    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(map_right_div[0])

    $.getJSON('init_marks', null, function(json, textStatus) {
        /*optional stuff to do after success */
        init_marks(json);
    });

    //http://localhost:8000/static/img/markercluster.png

    /*
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
        //map.panTo(marker.getPosition())
        map.setCenter(marker.getPosition())
    })
    */

    
  }
function init_marks(markers){
  for(var i in markers){
      var map_marker = new google.maps.Marker({
        position: markers[i]['latlng'],
        map: map,
      })
      map_marker.addListener('click', onMarkerClicked)
      allMarkers.push(map_marker)
  }
  markercluster = new MarkerClusterer(map, allMarkers,  
    {imagePath: 'http://localhost:8000/static/img/m'});
}
function onMarkerClicked(event){
  alert(event)
}