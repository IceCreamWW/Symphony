$(function() {
    all_markers = new Markers();
    all_routes = new Routes();
});

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
        return markers[id];
    },
    addMarker: function (marker) {
        this.markers[marker.id][marker]
    },
    removeMarker: function (id) {
        delete markers[id];
    },
    addMarkers: function (markers) {
        self = this;
        markers.forEach(function (marker) {
            self.markers[marker.id] = marker;
        })
    },
    asArray: function () {
        return Object.keys(this.markers).map(function(key) {
    	    return test[key]
        })
    }
}

/*Route and Routes*/
route_proto = new Markers();
function Route(id){
    Markers.call(this);
	this.id = id
}
Route.prototype = route_proto;
Route.prototype.constructor = Route;
Route.prototype.save = function (oper) {
    if(!oper) {
        alert("operation not specified")
        return;
    }
    oper = oper || "undefined";
    route_info = {};
    route_info["oper"] = oper;
    $.getJSON('save_route',route_info, function (json) {
        alert(json['success'])
    })
}

function Routes() {
	this.routes = new Map();
	this.curRoute = null;
}


Routes.prototype = {
	constructor: Routes,
	createRoute: function (route_name) {
		this.routes.set(route_name, new Route());
	},
	deleteRoute: function (route_name){
        this.routes.delete(route_name)
        save("delete")
	},
	getRouteById: function (id) {
	    return Array.from(this.routes.values()).filter(function (route) {
            return route.id == id;
        })[0];
	},
	getRouteByName: function(route_name){
        return this.routes.get(route_name);
	},
    getCurRoute: function () {
        return this.curRoute;
    },
    setCurRoute: function (route_name) {
        this.curRoute = this.routes.get(route_name)
    }
}
