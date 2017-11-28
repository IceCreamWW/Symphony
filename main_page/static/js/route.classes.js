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




var bounds = new google.maps.LatLngBounds();

for (i = 0; i < LatLngs.length; i++) {
    position = new google.maps.LatLng(LatLngs[i][0], LatLngs[i][1]);

    marker = new google.maps.Marker({
        position: position,
        map: map
    });

    bounds.extend(position)
}

map.fitBounds(bounds);