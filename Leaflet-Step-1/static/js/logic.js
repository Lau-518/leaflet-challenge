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

// Perform a GET request to the query URL
d3.json(queryUrl).then((earthquake) => {
  earthquake.features.forEach((feature) => {
    L.circle(
      [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
      {
        fillOpacity: 0.75,
        color: "white",
        fillColor: "purple",
        // Setting our circle's radius equal to the output of our markerSize function
        // This will make our marker's size proportionate to its magnitude
        radius: feature.properties.mag * 50000,
      }
    ).addTo(myMap);
  });
});
