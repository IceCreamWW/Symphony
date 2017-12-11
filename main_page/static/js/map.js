var center_coordinate = {lat: -34.397, lng: 150.644};
var poly;
var mExtMap;

var mSettings = {
    center: center_coordinate,
    zoom: 5,
    zoomControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    gestureHandling: 'cooperative',
}


var lineSymbol = {
    path: 'M 0,-1 0,1',
    strokeOpacity: 1,
    scale: 4
};

var lineSetting = {
    strokeColor: '#FFFF33',
    strokeOpacity: 0,
    icons: [{
        icon: lineSymbol,
        offset: '0',
        repeat: '20px'
    }],
    strokeWeight: 3,
}


var mcSettings = {
    imagePath: 'http://localhost:8000/static/img/m'
}

function initMap(){

    mExtMap = new ExtMap({
        mapId: 'map',
        hiddenMapId: 'hidden-map',
        lineSymbolSettings: lineSetting,
        mapDisplaySettings: mSettings,
        clusterSettings: mcSettings,
    });


    mExtMap.addControl($('#routes-div'), 'LEFT_TOP')
    mExtMap.initMarkersFrom('init_marks',function () {
        mExtMap.addMarkerEvent('click', function(event){
            $('#add-place-wrapper').trigger('marker-click',[this.id, true]);
        })
    });

    mExtMap.setMapStyle('http://localhost:8000/static/json/night_map_style.json/')

    $('#map').on('marker-click', function(event, curMarkerId) {
        var preMarker = mExtMap.geoMarkers.curMarker;
        var curMarker = mExtMap.geoMarkers.getMarkerById(curMarkerId);
        mExtMap.geoCluster.removeMarker(curMarker);
        curMarker.setAnimation(google.maps.Animation.BOUNCE);

        if (preMarker == curMarker) return;

        var curRoute = mExtMap.routes.getCurRoute();
        mExtMap.geoCluster.animateMarker_ = curMarker;
        preMarker && preMarker.setAnimation(null)
        preMarker && (!curRoute || !curRoute.hasMarker(preMarker.id)) && mExtMap.geoCluster.addMarker(preMarker);
                
        mExtMap.geoMarkers.curMarker = curMarker;
    });
}




function load_map(map_style_json) {
    
    map = new google.maps.Map(document.getElementById('map'), {
        // center: center_coordinate,
        // zoom: 5,
        // zoomControl: false,
        // streetViewControl: false,
        // fullscreenControl: false,
        // mapTypeControl: false,
        // gestureHandling: 'cooperative',
        mapTypeControlOptions: {
            mapTypeIds: ['roadmap', 'map_night']
        }
    });

    // Define a symbol using SVG path notation, with an opacity of 1.
        // var lineSymbol = {
        //   path: 'M 0,-1 0,1',
        //   strokeOpacity: 1,
        //   scale: 4
        // };

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

