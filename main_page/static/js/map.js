var center_coordinate = {lat: 37.75771992816863, lng: -122.43760000000003};

var mExtMap;

var mSettings = {
    center: center_coordinate,
    zoom: 12,
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
    imagePath: '../static/img/m'
}

function initMap(){

    mExtMap = new ExtMap({
        mapId: 'map',
        hiddenMapId: 'hidden-map',
        lineSymbolSettings: lineSetting,
        mapDisplaySettings: mSettings,
        clusterSettings: mcSettings,
    });



    var searchBox = new google.maps.places.SearchBox(document.getElementById('pac-input'));
    mExtMap.geoMap.addListener('bounds_changed', function() {
      searchBox.setBounds(mExtMap.geoMap.getBounds());
    });
    searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();
          if (places.length == 0) {
            return;
          }
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          mExtMap.geoMap.fitBounds(bounds);
        });



    mExtMap.addControl($('#pac-input'), 'RIGHT_TOP');
    mExtMap.addControl($('#routes-div'), 'LEFT_TOP');

    mExtMap.initMarkersFrom('init_marks',function () {
        mExtMap.addMarkerEvent('click', function(event){
            $('#add-place-wrapper').trigger('marker-click',[this.id, true]);
        })
    });

    mExtMap.setMapStyle('../static/json/night_map_style.json/')

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

