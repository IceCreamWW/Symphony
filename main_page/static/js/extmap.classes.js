// zyh
function updateAttrs(attrs){
    var self = this;
    Object.keys(attrs).forEach(function(key){
        self[key] = attrs[key];
    })
}


// var lineSetting = {
//     strokeColor: '#FFFF33',
//     strokeOpacity: 0,
//     icons: [{
//     icon: lineSymbol,
//     offset: '0',
//     repeat: '20px'
//     }],
//     strokeWeight: 3,
// }


function Markers() {
    this.markers = new Map();
    this.curMarker = null
}
Markers.prototype = {
    constructor: Markers,
    getCurMarker: function () {
        return this.curMarker;
    },
    getMarkerById: function (markerId) {
        return this.markers.get(markerId);
    },
    addMarker: function (marker) {
        this.markers.set(marker.id, marker)
    },
    removeMarker: function (markerId) {
        this.markers.delete(markerId);
    },
    addMarkers: function (markers) {
        self = this;
        markers.forEach(function (marker) {
            self.markers.set(marker.id, marker)
nn        })
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
    var settings = $.extend({
        id: -1,
        geoMap: null,
        geoCluster: null,
        geoMarkers: null,
        name: undefined,
        routelineSetting: null    //json expected
    }, options);

    this.routeLine = null;
    updateAttrs.call(this, settings);
    this.order = [];
}
RouteState.prototype = new Markers();
RouteState.prototype.constructor = RouteState;
RouteState.prototype.save = function (isNew, callback) {
    var self = this;
    routeInfo = {};
    routeInfo["isNew"] = isNew;
    $.getJSON('save_route',routeInfo, callback);
}                         
RouteState.prototype.hide = function(){
    if (this.routeLine) {
        this.routeLine.setMap(null);
    }
}

RouteState.prototype.show = function(){
    self.routeLine.setMap(self.geoMap);
    // var self = this;
    // var path = self.routeLine.getPath();
    // if(self.routeLine == null){
    //     this.asIterable().forEach(function(marker){
    //         path.push(marker);
    //     });    
    // }else{
    //     self.routeLine.setMap(self.geoMap);
    // }
}

RouteState.prototype.updateRouteline = function(){
    // FIX_ME
    var self = this;
    if (this.routeLine) {
        this.routeLine.setMap(null);
    }
    this.routeLine = new google.maps.Polyline(routelineSetting);

    var path = this.routeLine.getPath();
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

RouteState.prototype.addMarker = function (marker, nodraw=false) {
    this.markers.set(marker.id, marker);
    this.order.push(marker.id);
    this.geoCluster.removeMarker(this.geoMarkers.getMarkerById(id), nodraw)
}

RouteState.prototype.removeMarker = function (id) {
    this.markers.delete(id);
    this.order.splice(this.order.indexOf(id), 1);
    this.geoCluster.addMarker(this.geoMarkers.getMarkerById(id))
}


function Route(options){
    
    var settings = $.extend({
        id: -1,
        geoMap: null,
        geoCluster: null,
        geoMarkers: null,
        name: undefined,
        isNew: true,
        bufferSize: 50,
        routelineSetting: null    //json expected
    }, options);

    updateAttrs.call(this, settings);
    this.geoCluster = $.extend(true, {}, this.geoCluster);

    this.routeStates = [];
    this.latestIndex = 0;
    this.curRouteStateIndex = 0;
    this.earliestIndex = 0;
    this.routeStates[0] = new RouteState(this.settings);
}

Route.prototype = {
    constructor: Route,
    getBufferIndex: function(rawIndex) {
    return (rawIndex + this.bufferSize) % this.bufferSize;
    },
    undo: function(){
        if (this.curRouteStateIndex == this.earliestIndex) {
            return;
        }else{
            this.changeState(this.getBufferIndex(this.curRouteStateIndex - 1));
        }
    },
    redo: function(){
        if(this.latestIndex == this.curRouteStateIndex){
            return;
        }else{
            this.changeState(this.getBufferIndex(this.curRouteStateIndex + 1));
            this.latestIndex = this.curRouteStateIndex;
        }
    },
    show: function(){
        this.geoCluster.setMap(this.geoMap)
        this.routeStates[this.curRouteStateIndex].show();
    },
    hide: function(){
        this.geoCluster.setMap(null);
        this.routeStates[this.curRouteStateIndex].hide();
    },
    changeState: function(targetIndex, isNewState=false, newState=null){
        targetIndex = this.getBufferIndex(targetIndex);
        this.routeStates[this.curRouteStateIndex].hide();
        this.curRouteStateIndex = this.targetIndex;
        this.routeStates[this.targetIndex] = newState;
        if(isNewState){
            this.latestState = this.targetIndex;
            if (this.latestIndex == this.earliestIndex) {
               this.earliestIndex = this.getBufferIndex(this.earliestIndex + 1);
            } 
            this.routeStates[latestIndex].updateRouteline();
        } 
        this.routeStates[targetIndex].show();
    },

    addMarker: function(id){
        var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
        newState.addMarker(id);
        this.changeState(this.curRouteStateIndex + 1, true, newState);
    },
    removeMarker: function(id){
        var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
        newState.removeMarker(id);
        this.changeState(this.curRouteStateIndex + 1, true, newState);
    },
    exchangeMarker: function(id1, id2, commit){
        if(commit){
            var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
            newState.exchangeMarker(id1, id2);
        }
        else{
            this.routeStates[curRouteStateIndex].exchangeMarker(id1, id2);
            this.routeStates[curRouteStateIndex].updateRouteline();
            this.changeState(this.curRouteStateIndex + 1, true, newState);
        }
    },
    save: function(callback){
        this.routeStates[this.curRouteStateIndex].save(this.isNew, callback);
        this.isNew = false;
    
    },
    delete: function(callback){
        $.getJSON('delete_route', {"id": this.id}, callback);
    },
    loadRoute: function(id){
        var self = this;
        // FIX_ME What data should I pass?
        $.getJSON("load_route", DATA, function(markers){
            self.newState = new RouteState(self.settings)
            markers.forEach(function(id){
                // no draw is true
                self.newState.addMarker(id, true);
            });
            self.geoMarkers.resetViewport();
            self.geoMarkers.redraw();
            self.isNew = false;
        });
    }
}



function Routes(options){

    var settings = $.extend({
        geoMap: null,
        geoCluster: null,
        geoMarkers: null,
        routelineSetting: null,
    }, options);
    

    this.routes = new Map();
    updateAttrs.call(this, settings);
    this.curRouteId = -1;
    this.browseOrder = [];
}


Routes.prototype = {
    constructor: Routes,
    generateName: function(){
        var i  = 1;
        name = "新建路线";
        while(!this.existName_(name + i)){
            i += 1;
        }
        name = name + i;
        return name;
    },
    existName_: function (name) {
        return Array.from(this.routes.values()).indexOf(name) >= 0;
    },
    showRoute: function(id){
        if (id==undefined) {
            return;
        }
        if(this.curRouteId != -1){
            this.getCurRoute().hide();
        }
        this.curRouteId = id;

        var thisOrder = this.browseOrder.indexOf()
        if (this.browseOrder.indexOf(thisOrder) >= 0) {
            this.browseOrder.push(this.curRouteId);
            this.splice(thisOrder,1);
        }

        this.getCurRoute().show();
    },
    createRoute: function(name){
        if (!name) {
            name = this.generateName();
        }else if (this.existName_(name)) {
            return false;
        }
        var route = new Route({
            geoMap: this.geoMap,
            geoCluster: this.geoCluster,
            geoMap: this.geoMap,
            isNew: true,
            name: name,
            routelineSetting: this.routelineSetting
        });
        var self = this;
        route.save(function(json){
            this.routes.set(json["id"], route);
            this.showRoute(json["id"]);
        }.bind(self));
    },

    deleteRoute: function(id){
        id = id || this.curRouteId;
        this.routes.get(id).delete();
        this.routes.delete(id);
        
        if (this.browseOrder[-1] == id) {
            this.browseOrder.length -= 1;
            this.getCurRoute().hide();
            if (this.browseOrder.length != 0) {
                this.showRoute(this.browseOrder[-1]);
            }
        } else{
            this.browseOrder.splice(this.indexOf(id), 1);
        }       

    },
    getCurRoute: function(){
        return this.routes.get(this.curRouteId);
    },
    loadRoute: function(id){
        var route = new Route({
            geoMap: this.geoMap,
            geoCluster: this.geoCluster,
            geoMap: this.geoMap,
        });
        route.loadRoute(id);
    }


}




function ExtMap(options){

    this.settings = $.extend({
        mapDisplayOptions: null,
        lineSetting: null,
        markerSymbolSettings: null,
        clusterOptions: null,
        mapId: null
    }, options);

    this.geoMap = new google.maps.Map(document.getElementById(this.settings.mapId), 
        this.settings.mapDisplayOptions
    );

    this.geoMarkers = new Markers();
    this.geoCluster = new MarkerClusterer(this.geoMap, null, this.settings.clusterOptions);

    this.routes = new Routes({
        geoMap: this.geoMap,
        geoCluster: this.geoCluster,
        geoMarkers: this.geoMarkers,
        routelineSetting: this.settings.lineSetting,
    });
}


ExtMap.prototype = {
    constructor: ExtMap,
    setMapStyle: function(json_url){
        var self = this;
        $.getJSON(json_url, null, function(json){
            var mapStyle = new google.maps.StyledMapType(json, {name: json_url});
            self.geoMap.mapTypes.set(json_url, mapStyle);
            self.geoMap.setMapTypeId(json_url);
        });
    },
    initMarkers: function(markersUrl){
        var self = this;
        $.getJSON(markersUrl, null, function(markers){
            markers.forEach(function(marker){
                var mMarker = new google.maps.Marker({
                    position: marker['latlng'],
                    map: self.geoMap,
                    id: marker['id']
                });
                self.geoMarkers.addMarker(mMarker);
            });
            self.geoCluster.addMarkers(self.geoMarkers.asArray());
        });
    }
}

