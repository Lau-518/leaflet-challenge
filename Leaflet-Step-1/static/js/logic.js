//Creating map object

var myMap = L.map("map", {
  center: [39.09, -111.09],
  zoom: 5,
});

// Store our API endpoint inside queryUrl
var queryUrl =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Adding a tile layer (the background map image) to our map
// We use the addTo method to add objects to our map
L.tileLayer(
  "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
  {
    attribution:
      "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    // id: "mapbox/satellite-v9",
    accessToken: API_KEY,
  }
).addTo(myMap);

//Creating function to classify earthquake magnitude in different colors

function EarthquakeColor(magnitude) {
  if (magnitude >= 5) {
    return "Red";
  } else if (magnitude >= 4 && magnitude < 4.99) {
    return "DarkOrange";
  } else if (magnitude >= 3 && magnitude < 3.99) {
    return "Orange";
  } else if (magnitude >= 2 && magnitude < 2.99) {
    return "Yellow";
  } else if (magnitude >= 1 && magnitude < 1.99) {
    return "GreenYellow";
  } else if (magnitude < 1) {
    return "Lime";
  }
}

// Perform a GET request to the query URL
d3.json(queryUrl).then((earthquake) => {
  earthquake.features.forEach((feature) => {
    L.circle(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      {
        fillOpacity: 0.75,
        color: "black",
        fillColor: EarthquakeColor(feature.properties.mag),
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its magnitude
        radius: feature.properties.mag * 50000,
      }
    )
      .bindPopup(
        "<h3>" +
          feature.properties.place +
          "</h3> <hr> Coordinates : " +
          [feature.geometry.coordinates[1], feature.geometry.coordinates[0]] +
          "<br> Magnitude : " +
          feature.properties.mag
      )
      .addTo(myMap);
  });

  // Create a legend that will provide context for your map data.

  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "Lime",
      "GreenYellow",
      "Yellow",
      "Orange",
      "DarkOrange",
      "Red",
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " +
        colors[i] +
        "'></i> " +
        grades[i] +
        (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  legend.addTo(myMap);
});
