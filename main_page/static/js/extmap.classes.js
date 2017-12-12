// zyh
function updateAttrs(attrs) {
    var self = this;
    Object.keys(attrs).forEach(function (key) {
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
function RouteState(options) {
    Markers.call(this);
    var settings = $.extend({
        route: null,
        lineSymbol: null    //json expected
    }, options);

    this.routeLine = null;
    updateAttrs.call(this, settings);
    this.order = [];
}

RouteState.prototype = new Markers();
RouteState.prototype.constructor = RouteState;
RouteState.prototype.save = function (isNew, callback) {
    var self = this;
    routeInfo = {
        "name": this.route.name,
        "isNew" : isNew,
        "sites" : this.order.toString(),
        "id": this.route.id
    };
    $.getJSON('save_route', routeInfo, function(json, textStatus){
        callback && callback(json,textStatus);
    });
}
RouteState.prototype.hide = function () {
    this.savedClusterMarkers = this.route.extMap.geoCluster.markers_.slice()
    this.route.extMap.geoCluster.update(this.route.extMap.geoMarkers.asArray());
    this.routeLine && this.routeLine.setMap(null);
}

RouteState.prototype.show = function () {

    this.route.extMap.geoCluster.removeMarkers(this.asMarkerArray());
    this.savedClusterMarkers && this.route.extMap.geoCluster.update(this.savedClusterMarkers)
    this.routeLine && this.routeLine.setMap(this.route.extMap.geoMap);
}

RouteState.prototype.updateRouteline = function () {
    var self = this;
    if (this.routeLine) {
        this.routeLine.setMap(null);
    }
    this.routeLine = new google.maps.Polyline(this.route.extMap.settings.lineSymbolSettings);
    this.routeLine.setMap(this.route.extMap.geoMap);    

    var path = this.routeLine.getPath();
    this.order.forEach(function (markerId) {
        var marker = self.getMarkerById(markerId);
        marker.setMap(self.extMap.geoMap);
        path.push(marker.position);
    })
},

RouteState.prototype.exchangeMarker = function (id1, id2) {
    index1 = this.order.indexOf(id1);
    index2 = this.order.indexOf(id2);
    this.order[index1] = id2;
    this.order[index2] = id1;
};
RouteState.prototype.changeMarkerToPosition = function(markerId, targetPosition){
    var targetId = this.order[targetPosition]
    this.exchangeMarker(markerId, targetId);
}

RouteState.prototype.addMarker = function (markerId, nodraw) {
    nodraw = nodraw || false
    var marker = this.route.extMap.geoMarkers.getMarkerById(markerId);
    this.markers.set(markerId, marker);
    this.order.push(markerId);
    this.route.extMap.geoCluster.removeMarker(marker, nodraw)
};

RouteState.prototype.removeMarker = function (id) {
    if(!this.markers.delete(id)){
        return false;
    }else{
        this.order.splice(this.order.indexOf(id), 1);
        this.route.extMap.geoCluster.addMarker(this.route.extMap.geoMarkers.getMarkerById(id))
        return true;
    }
};
RouteState.prototype.asMarkerArray = function () {
    var self = this;
    return this.order.map(function (markerId) {
        return self.getMarkerById(markerId);
    })
}


function Route(options) {

    var settings = $.extend({
        id: -1,
        extMap: null,
        name: undefined,
        isNew: true,
        bufferSize: 50,
        date: null
    }, options);

    updateAttrs.call(this, settings);

    this.routeStates = [];
    this.latestIndex = 0;
    this.curRouteStateIndex = 0;
    this.earliestIndex = 0;

    this.hasCommit = true;
    this.routeStates[0] = new RouteState($.extend({route : this}, settings));
    this.routeStates[0].savedClusterMarkers = this.extMap.geoMarkers.asArray();
}

Route.prototype = {
    constructor: Route,
    getBufferIndex: function (rawIndex) {
        return (rawIndex + this.bufferSize) % this.bufferSize;
    },
    hasMarker: function(markerId) {
        return this.routeStates[this.curRouteStateIndex].getMarkerById(markerId) != undefined;
    },
    canUndo: function(){
        return this.curRouteStateIndex !== this.earliestIndex; 
    },
    canRedo: function(){
        return this.curRouteStateIndex !== this.latestIndex; 
    },
    undo: function () {
        if (this.curRouteStateIndex !== this.earliestIndex) {
            this.changeState(this.getBufferIndex(this.curRouteStateIndex - 1));
        }
    },
    redo: function () {
        if (this.latestIndex !== this.curRouteStateIndex) {
            this.changeState(this.getBufferIndex(this.curRouteStateIndex + 1));
        }
    },
    show: function () {
        // this.savedClusterMarkers && this.geoCluster.update(this.savedClusterMarkers);
        this.routeStates[this.curRouteStateIndex].show();
    },
    hide: function () {
        // this.savedClusterMarkers = this.extMap.geoCluster.markers_.slice()
        this.routeStates[this.curRouteStateIndex].hide();
    },
    changeState: function (targetIndex, newState) {
        targetIndex = this.getBufferIndex(targetIndex);
        this.routeStates[this.curRouteStateIndex].hide();
        this.curRouteStateIndex = targetIndex;
        if (newState) {
            this.latestIndex = targetIndex;
            this.routeStates[targetIndex] = newState;
            if (this.latestIndex === this.earliestIndex) {
                this.earliestIndex = this.getBufferIndex(this.earliestIndex + 1);
            }
            this.routeStates[targetIndex].savedClusterMarkers = undefined;
            this.routeStates[targetIndex].updateRouteline();
        }
        this.routeStates[targetIndex].show();
    },

    addMarker: function (id) {
        var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
        newState.markers = new Map(this.routeStates[this.curRouteStateIndex].markers);
        newState.addMarker(id);
        this.changeState(this.curRouteStateIndex + 1, newState);
    },
    removeMarker: function (id) {
        var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
        newState.markers = new Map(this.routeStates[this.curRouteStateIndex].markers);
        if(newState.removeMarker(id)){
            this.changeState(this.curRouteStateIndex + 1, newState);
        }
    },
    exchangeMarker: function (id1, id2) {
        var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
        newState.markers = new Map(this.routeStates[this.curRouteStateIndex].markers);
        newState.exchangeMarker(id1, id2);
        this.changeState(this.curRouteStateIndex + 1, newState);
    },
    changeMarkerToPosition: function(markerId, targetPosition, commit){
        if (this.hasCommit) {
            var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
            newState.markers = new Map(this.routeStates[this.curRouteStateIndex].markers);
            newState.changeMarkerToPosition(markerId, targetPosition);
            newState.updateRouteline();
            this.changeState(this.curRouteStateIndex + 1, newState);
            this.hasCommit = false;
        }else {
            this.routeStates[this.curRouteStateIndex].changeMarkerToPosition(markerId, targetPosition);
            this.routeStates[this.curRouteStateIndex].updateRouteline();
        }
    },
    clearUndoQueue: function(){
        this.earliestIndex = this.curRouteStateIndex;
    },
    clearStateQueue: function(){
        this.latestIndex = this.curRouteStateIndex;
    },
    forceCommit: function(){
        var newState = $.extend(true, {}, this.routeStates[this.curRouteStateIndex]);
        newState.markers = new Map(this.routeStates[this.curRouteStateIndex].markers);
        this.changeState(this.curRouteStateIndex + 1, newState);
    },
    save: function (callback) {
        this.routeStates[this.curRouteStateIndex].save(this.isNew, callback);
        this.isNew = false;

    },
    delete: function (callback) {
        $.post('delete_route', {"id": this.id}, callback);
    },
    loadRoute: function (id) {
        var self = this;
        // FIX_ME What data should I pass?
        $.getJSON("load_route", DATA, function (markers) {
            self.newState = new RouteState(self.settings)
            markers.forEach(function (id) {
                // no draw is true
                self.newState.addMarker(id, true);
            });
            self.extMap.geoMarkers.resetViewport();
            self.extMap.geoMarkers.redraw();
            self.isNew = false;
        });
    },
    getMarkerArray: function(){
        return this.routeStates[this.curRouteStateIndex].asMarkerArray();
    },
    getMarkerNamesArray: function () {
        return this.getMarkerArray().map(function (marker) {
            return marker.name;
        });
    }
};


function Routes(options) {

    var settings = $.extend({
        extMap: null,
    }, options);


    this.routes = new Map();
    updateAttrs.call(this, settings);
    this.curRouteId = -1;
    this.browseOrder = [];
}


Routes.prototype = {
    constructor: Routes,
    generateName: function () {
        var i = 1;
        name = "新建路线";
        while (this.existName_(name + i)) {
            i += 1;
        }
        name = name + i;
        return name;
    },
    existName_: function (name) {
        return Array.from(this.routes.values()).some(function(route){
            return route.name === name;
        })
    },
    showRoute: function (id) {
        if (typeof id == "undefined") {
            return;
        }
        if (this.curRouteId !== -1) {
            this.getCurRoute().hide();
        }
        this.curRouteId = id;
        var thisOrder = this.browseOrder.indexOf(this.curRouteId);
        if (thisOrder >= 0) {
            this.browseOrder.splice(thisOrder, 1);
        }
        this.browseOrder.push(this.curRouteId);
        this.getCurRoute().show();
    },
    createRoute: function (options) {
        if (!options.name) {
            var name = this.generateName();
        } else if (this.existName_(name)) {
            return false;
        }
        var route = new Route({
            extMap: this.extMap,
            isNew: true,
            name: name,
        });
        var self = this;
        route.save(function (json) {
            this.routes.set(json["id"], route);
            route.id = json["id"];
            route.date = json["date"];
            options.callback(route);
        }.bind(self));
    },
    loadRoutes: function(callback){
        var self = this;
        $.getJSON("load_routes",function(routesJsons){
            routes = []
            routesJsons.forEach(function(routeJson){
                var route = new Route({
                    extMap: self.extMap,
                    isNew: false,
                    name: routeJson['name'],
                    id: routeJson['id']
                });
                routeJson['sites'].forEach(function(siteId){
                    route.addMarker(siteId);
                })
                route.clearUndoQueue();
                routes.push(route);
                route.hide()
                self.routes.set(route.id, route);
            })
            callback && callback(routes);
        })
    },
    removeRoute: function (id, norm) {
        id = id || this.curRouteId;
        norm || this.routes.get(id).delete();

        if (this.browseOrder[this.browseOrder.length - 1] === id) {
            this.browseOrder.length -= 1;
            if (this.browseOrder.length !== 0) {
                this.showRoute(this.browseOrder[this.browseOrder.length - 1]);
            }else{
                this.getCurRoute().hide();
                this.curRouteId = -1;
                this.extMap.geoCluster.update(this.extMap.geoMarkers.asArray());
            }
        } else {
            this.browseOrder.splice(this.browseOrder.indexOf(id), 1);
        }
        this.routes.delete(id);
    },
    getRouteById: function (routeId){
        return this.routes.get(routeId)
    },
    getCurRoute: function () {
        return this.getRouteById(this.curRouteId);
    },
    loadRoute: function(id, callback){
        var self = this;
        $.getJSON("load_route", {"id":id}, function(routeJson){
            var route = new Route({
                extMap: self.extMap,
                isNew: false,
                name: routeJson['name'],
                id: routeJson['id']
            });
            routeJson['sites'].forEach(function(siteId){
                route.addMarker(siteId);
            })
            route.clearUndoQueue();
            self.routes.set(route.id, route);
            callback && callback(route);
        })
    },
}


function ExtMap(options) {

    this.settings = $.extend({
        mapDisplaySettings: null,
        lineSymbolSettings: null,
        markerSymbolSettings: null,
        clusterSettings: null,
        mapId: null,
    }, options);

    this.geoMap = new google.maps.Map(document.getElementById(this.settings.mapId),
        this.settings.mapDisplaySettings
    );
    this.geoMarkers = new Markers();
    this.geoCluster = new MarkerClusterer(this.geoMap, null, this.settings.clusterSettings);
    this.geoInfoWindow = new google.maps.InfoWindow();
    this.placeService = new google.maps.places.PlacesService(this.geoMap);


    this.routes = new Routes({
        extMap: this,
        lineSymbolSettings: this.settings.lineSymbolSettings
    });
}

ExtMap.prototype = {
    constructor: ExtMap,
    setMapStyle: function (json_url) {
        var self = this;
        $.getJSON(json_url, null, function (json) {
            var mapStyle = new google.maps.StyledMapType(json, {name: json_url});
            self.geoMap.mapTypes.set(json_url, mapStyle);
            self.geoMap.setMapTypeId(json_url);
        });
    },
    initMarkersFrom: function (markersUrl, callback) {
        var self = this;
        $.getJSON(markersUrl, null, function (markers) {
            markers.forEach(function (marker) {
                var mMarker = new google.maps.Marker({
                    position: marker['latlng'],
                    map: self.geoMap,
                    id: marker['id'],
                    name: marker['name'],
                });
                self.geoMarkers.addMarker(mMarker);
            });
            self.geoCluster.addMarkers(self.geoMarkers.asArray());
            callback(markers);
        });
    },
    addControl: function (control, position, options) {
        if (typeof position == 'string') {
            position = position.toLowerCase().replace(/[_-]/g, '');
        }
        control.attr('data-html2canvas-ignore', 'true');
        if (typeof options != 'undefined') {
            control.attr(options);
        }
        switch (position) {
            case 'lefttop':
                this.geoMap.controls[google.maps.ControlPosition.LEFT_TOP].push(control[0]);
                break;
            case 'righttop':
                this.geoMap.controls[google.maps.ControlPosition.RIGHT_TOP].push(control[0]);
                break;
            case 'rightbottom':
                this.geoMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(control[0]);
                break;
            case 'leftbottom':
                this.geoMap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(control[0]);
                break;
        }
    },
    addMarkerEvent: function(event, handler){
        Array.from(this.geoMarkers.markers.values()).forEach(function(marker){
            marker.addListener(event, handler);
        });
    },
    toCanvas: function (callback) {
        html2canvas(document.getElementById(this.settings.mapId), {
            timeout: 5000,
            useCORS: true,
            onrendered: function (canvas) {
                callback($(canvas));
            }
        });
    },
    toImageSrc: function (picFormat, callback) {

        //get transform value
        var transform=$(".gm-style>div:first>div").css("transform")
        var comp=transform.split(",") //split up the transform matrix
        var mapleft=parseFloat(comp[4]) //get left value
        var maptop=parseFloat(comp[5])  //get top value
        $(".gm-style>div:first>div").css({ //get the map container. not sure if stable
          "transform":"none",
          "left":mapleft,
          "top":maptop,
        })

        html2canvas(document.getElementById(this.settings.mapId), {
            timeout: 5000,
            useCORS: true,
            onrendered: function (canvas) {
                callback(canvas.toDataURL('image/' + picFormat));
                $(".gm-style>div:first>div").css({
                  left:0,
                  top:0,
                  "transform":transform
                })
            }
        });
    },
    fitBounds: function (routeId) {
        routeId = routeId || this.routes.getCurRoute().id;
        if(!routeId){
            return;
        }
        var route = this.routes.getRouteById(routeId);
        var bounds = this.geoMap.getBounds();

        route.getMarkerArray().forEach(function (marker) {
            bounds.extend(marker.getPosition());
        })
        this.geoMap.fitBounds(bounds);
    }
};


