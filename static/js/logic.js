// Function to assign colors based on magnitude for both the legend and circles
function getColor(d) {
	return d > 5  ? '#F05151' :
	       d > 4  ? '#E0A55C' :
	       d > 3  ? '#F3BA4D' :
	       d > 2  ? '#F9D846' :
           d > 1  ? '#E1F34D' :
           d > 0  ? '#B7F34D' :
	                '#F05151' ;
}

// Increase size of cirlces on map based on magnitude
function markerSize(mag) {
    return mag * 30000;
}

// Circle Layer
var circleMarkers = new L.LayerGroup();

// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(response) {
    var data = response.features  

    // Loop through the data array
    for (var i = 0; i < data.length; i++) {       
        
    // Add circles to map based on lng and lat
        L.circle([data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]], {

            // Conditionals for data points
            fillOpacity: 0.75,
            color: "null",
            fillColor: getColor(data[i].properties.mag),
            weight: 1,
        
            // Adjust radius based on size of magnitude
            radius: markerSize(data[i].properties.mag)
        }).bindPopup("<h3>" + data[i].properties.place + "</h3><hr><p>" + new Date(data[i].properties.time) + "</p>").addTo(circleMarkers)
    }   
});

// Faultline Layer
var faultLines = new L.LayerGroup();

// NOTE: PB2002_boundaries.json is a geojson file downloaded from the github reposity 
// and stored with my index file that level 2 Homework directs you to

// Perform a GET request to the geojson file
d3.json("PB2002_boundaries.json", function(response) {
    var data = response.features
    var plate = [];

    // Loop through the data array
    for (var i = 0; i < data.length; i++) {

        // Push each group of coordinates into the plate array per tectonic plate
        var plate = data[i].geometry.coordinates
        var line = [];

        // Loop through the plate array
            for (var j = 0; j < plate.length; j++) { 
                
                // Push each group of coordinates into the line array but in reverse lng, lat
                line.push(
                    L.latLng(
                        parseFloat(plate[j][1]), 
                        parseFloat(plate[j][0])
                    )
                )
            }
         
        // Add lines to map based on lng and lat
        L.polyline(line, {
            color: "orange"
            }).addTo(faultLines);   
    }
});

// Define map layers
var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
})

var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});

var comic = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.comic",
    accessToken: API_KEY
});

var pirate = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.pirates",
    accessToken: API_KEY
});

// Define basemaps
var baseMaps = {
    "Satellite": satellite,
    "Grayscale": light,
    "Outdoors": outdoors,
    "Comic! (for fun)": comic,
    "Pirate! (for fun)": pirate
};

// Define map overlays
var overlayMaps = {
  "Earthquakes": circleMarkers,
  "Fault Lines": faultLines
};

// Create a new map with starting selections
var myMap = L.map("map", {
    center: [36.78, -117.42],
    zoom: 3.5,
    layers: [satellite, circleMarkers, faultLines]
});

// Create legend
var legend = L.control({position: 'bottomright'});
    
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend');

        categories = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < categories.length; i++) {
            

            // NOTE: Additional legend styling is in style.css
            div.innerHTML +=
                '<i style="background:' + getColor(categories[i + 1]) + '"></i> ' +
                categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] + '<br>' : '+');
        }

        return div;
    }

// Add legend to map    
legend.addTo(myMap);

// Add map layers
L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(myMap);
