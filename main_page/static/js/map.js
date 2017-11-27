var center_coordinate = {lat: -34.397, lng: 150.644};
var map, markercluster;
var poly;
var all_markers = new Markers();
var all_routes = new Routes();
var cur_marker;

function initMap() {
    $.ajax({
        type: "get",
        url: "../static/json/night_map_style.json",
        dataType: "json",
        success: function (data) {
            load_map(data)
        },
        error: function () {
            alert("json load failed")
            load_map(null)
        }
    });

}

function load_map(map_style_json) {
    
    var styledMapType = new google.maps.StyledMapType(map_style_json, {name: "夜间模式"});
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

    // Define a symbol using SVG path notation, with an opacity of 1.
        var lineSymbol = {
          path: 'M 0,-1 0,1',
          strokeOpacity: 1,
          scale: 4
        };


    
    poly = new google.maps.Polyline({
          strokeColor: '#FFFF33',
          strokeOpacity: 0,
          icons: [{
            icon: lineSymbol,
            offset: '0',
            repeat: '20px'
          }],
          strokeWeight: 3,
          map: map
        });




    google.maps.event.addListenerOnce(map, 'idle', function(){
        $('.map-custom-control').css('display','block');
    });

    map.mapTypes.set('map_night', styledMapType);
    map.setMapTypeId('map_night');
    var map_right_div = $('#map_right_info_div');
    
    var add_marker_btn = $('#add_marker_btn');
    var route_tools = $('#route-tools-div');
    var add_route_btn = $('#add_route_btn');


    // map_right_div.index = 1;

    map.controls[google.maps.ControlPosition.RIGHT_TOP].push(map_right_div[0])
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(route_tools[0])
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(add_marker_btn[0])

    $.getJSON('init_marks', null, function (json, textStatus) {
        init_marks(json);
    });

}

function init_marks(markers) {

    // for (var i in markers) {
    //     var map_marker = new google.maps.Marker({
    //         position: markers[i]['latlng'],
    //         map: map,
    //         id: markers[i]['id']
    //     })

    markers.forEach(function(marker){
        var map_marker = new google.maps.Marker({
            position: marker['latlng'],
            map: map,
            id: marker['id']
        })   
        map_marker.addListener('click', function () {
            cur_marker = this.id;
            var csrftoken = getCookie('csrftoken');
        //  var data = {"id": this.id, "csrfmiddlewaretoken": csrftoken}
            var data = {"id": 1, "csrfmiddlewaretoken": csrftoken};

            $.getJSON('get_marker_plots', data, function (json, textStatus) {
                $("#plots-content").html(json['html']);

                $('.plots-info>h1').text(json['site']);
                moveToSlide('m-cur-slide-', 'map-right-div-section', 2);
            });
        });
        all_markers.addMarker(map_marker);     
    })
    markercluster = new MarkerClusterer(map, all_markers.asArray(),
        {imagePath: 'http://localhost:8000/static/img/m'});
}

