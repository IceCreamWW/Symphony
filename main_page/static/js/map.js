var center_coordinate = {lat: -34.397, lng: 150.644}; 
var map, markercluster;
var allMarkers = []

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
      streetViewControl: false,
      fullscreenControl: false,
      mapTypeControl: false,
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
        init_marks(json);
    });

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
        id: markers[i]['id']
      })
      map_marker.addListener('click', onMarkerClicked.call(this))
      all_markers.addMarker(map_marker);
  }
  markercluster = new MarkerClusterer(map, all_markers.asArray(),
    {imagePath: 'http://localhost:8000/static/img/m'});
}

function onMarkerClicked(){
  var csrftoken = getCookie('csrftoken');
//  var data = {"id": this.id, "csrfmiddlewaretoken": csrftoken}
  var data = {"id": 1, "csrfmiddlewaretoken": csrftoken}

  $.getJSON('get_marker_plots', data, function(json, textStatus) {
    $("#plots-content").html(json['html']);
    
    $('.plots-info>h1').text(json['site'])
    moveToSlide('m-cur-slide-', 'map-right-div-section', 2);
  });
}

