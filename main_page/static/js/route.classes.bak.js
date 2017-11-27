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




function RouteFactory(){
    this.createRoute = function (name) {
        var route = new Route();
        route.name = name;
        return route;
    }
    this.openRoute = function (id){
        var route = new Route()
    }

}

function Route(name, id){
}




/*Route 组合继承 Marker*/
function Route(id){
    Markers.call(this);
	this.id = id
}
Route.prototype = new Markers();
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
