Object.prototype.updateAttrs = function(attrs){
    var self = this;
    Object.keys(attrs).forEach(function(key){
        self[key] = attrs[key];
    })
}


lineSetting = {
    strokeColor: '#FFFF33',
    strokeOpacity: 0,
    icons: [{
    icon: lineSymbol,
    offset: '0',
    repeat: '20px'
    }],
    strokeWeight: 3,
}


function Markers() {
    this.markers = new Map();
    this.curMarker = null
}
Markers.prototype = {
    constructor: Markers,
    getCurMarker: function () {
        return this.curMarker;
    },
    getMarkerById: function (id) {
        return this.markers.get(id);
    },
    addMarker: function (marker) {
        this.markers.set(marker.id, marker)
    },
    removeMarker: function (id) {
        this.markers.delete(id);
    },
    addMarkers: function (markers) {
        self = this;
        markers.forEach(function (marker) {
            self.markers.set(marker.id, marker)
        })
    },
    asIterable: function () {
        return this.markers.values()
    },
    asArray: function () {
        return Array.from(this.markers.values())
    }
}

/*Route 组合继承 Marker*/
function RouteState(options){
    Markers.call(this);
    this.settings = $.extend({
        id: -1,
        geomap: null,
        geocluster: null,
        geomarkers: null,
        name: undefined,
        routelineSetting: lineSetting    //json expected
    }, options);

    this.routeLine = null;
    this.updateAttrs(settings);
    this.order = [];


}
RouteState.prototype = new Markers();
RouteState.prototype.constructor = RouteState;
RouteState.prototype.save = function (isNew) {
    var self = this;
    routeInfo = {};
    routeInfo["isNew"] = isNew;
    $.getJSON('save_route',routeInfo, function (json) {
        // 若isNew，赋值id
        // 否则返回success
        alert(json['success'])
    });
}                         
RouteState.prototype.clear = function(){
    var self = this;
    this.asIterable().forEach(function(marker){
        self.routeLine.setMap(null);
    })
}

RouteState.prototype.updateRouteline = function(){
    // FIX_ME
    var self = this;
    if (this.routeLine) {
        this.routeLine.setMap(null);
    }
    this.routeLine = new google.maps.Polyline(routelineSetting);

    path = this.routeLine.getPath();
    this.order.forEach(function(id){
        path.push(self.getMarkerById(id).position);
    })
}

RouteState.prototype.exchangeMarker = function(id1, id2){
    index1 = this.order.indexOf(id1);
    index2 = this.order.indexOf(id2);
    this.order[index1] = id2;
    this.order[index2] = id1;
}

RouteState.prototype.display = function(){
    var self = this;
    this.asIterable().forEach(function(marker){
        self.routeLine.setMap(self.geomap);
    })
}

RouteState.prototype.addMarker = function (marker, nodraw=false) {
    this.markers.set(marker.id, marker);
    this.order.push(marker.id);
    this.geocluster.removeMarker(this.geomarkers.getMarkerById(id), nodraw)
}

RouteState.prototype.removeMarker = function (id) {
    this.markers.delete(id);
    this.order.splice(this.order.indexOf(id), 1);
    this.geocluster.addMarker(this.geomarkers.getMarkerById(id))
}


function Route(options){
    
    this.settings = $.extend({
        id: -1,
        geomap: null,
        geocluster: null,
        geomarkers: null,
        name: undefined,
        isNew : true,
        routelineSetting: lineSetting    //json expected
    }, options);

    this.updateAttrs(settings);

    this.routeStates = [];
    this.curRouteIndex = -1;
    this.latestIndex = -1;
    this.newState = new RouteState(this.settings)
}

Route.prototype = {
    constructor: Route,
    undo: function(){
        if (this.curRouteIndex <= 0) {
            return;
        }else{
            this.changeState(this.curRouteIndex - 1);
        }
    },
    redo: function(){
        if(this.latestIndex == this.curRouteIndex){
            return;
        }else{
            this.changeState(this.curRouteIndex + 1);
            this.latestIndex = this.curRouteIndex;
        }
    },
    show: function(){
        this.routeStates[this.curRouteIndex].display();
    },
    hide: function(){
        this.routeStates[this.curRouteIndex].clear();
    },
    changeState: function(newRouteIndex){
        this.routeStates[this.curRouteIndex].clear()
        this.routeStates[newRouteIndex].updateRouteline();
        this.routeStates[newRouteIndex].display();
        this.curRouteIndex = this.newRouteIndex;
    }

    addMarker: function(id){
        this.latestIndex = this.curRouteIndex + 1;
        this.routeStates[this.curRouteIndex + 1] = this.newState;
        this.newState = $.extend(true, {}, this.newState);
        this.newState.addMarker(id);
        this.changeState(this.curRouteIndex + 1);
        
    },
    removeMarker: function(id){
        this.latestIndex = this.curRouteIndex + 1;
        this.routeStates[this.curRouteIndex + 1] = this.newState;
        this.newState = $.extend(true, {}, this.newState);
        this.newState.removeMarker(id);
        this.changeState(this.curRouteIndex + 1);
    },
    exchangeMarker: function(id1, id2, commit){
        if(commit){
            this.latestIndex = this.curRouteIndex + 1;
            this.routeStates[this.curRouteIndex + 1] = this.newState;
            this.newState = $.extend(true, {}, this.newState);
            this.newState.exchangeMarker(id1, id2);
            this.changeState(this.curRouteIndex + 1);
        }
        else{
            this.newState.exchangeMarker(id1, id2);
            this.newState.updateRouteline();
        }
    },
    save: function(){
        this.routeStates[this.curRouteIndex].save(this.isNew);
        this.isNew = false;
    }
    loadRoute: function(id){
        var self = this;
        $.getJSON("load_route", function(markers){
            self.newState = new RouteState(self.settings)
            markers.forEach(function(id){
                // no draw is true
                self.newState.addMarker(id, true);
            })
            self.geomarkers.resetViewport();
            self.geomarkers.redraw();
            self.isNew = false;
        })
    }
}



function ExtMap(options){

    this.settings = $.extend({
        mapDisplaySettings: null,
        lineSymbolSettings: null,
        markerSymbolSettings: null,
        clusterSymbolSettings: null,
        mapId: null;
    }, options);

 //   var styledMapType = new google.maps.StyledMapType(map_style_json, { name: "夜间模式" });
    this.map = new google.maps.Map(document.getElementById(mapId), 
        this.settings.mapDisplaySettings
    );
    this.Routes = []
    this.curRouteIndex = -1;

}

ExtMap.prototype = {
    constructor: ExtMap,
    createRoute: function(name){
        Route
    }
}

// {
//         center: center_coordinate,
//         zoom: 5,
//         zoomControl: false,
//         streetViewControl: false,
//         fullscreenControl: false,
//         mapTypeControl: false,
//         gestureHandling: 'cooperative',
//         mapTypeControlOptions: {
//             mapTypeIds: ['roadmap', 'map_night']
//         }