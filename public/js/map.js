mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'show-map', // container ID
    style: 'mapbox://styles/mapbox/satellite-streets-v12', // style URL
    center: hundeskov.geometry.coordinates, // starting position [lng, lat]
    zoom: 8, // starting zoom
      });

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker()
.setLngLat(hundeskov.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<p>${hundeskov.titel}</p><br><p>${hundeskov.lokation}</p>`
    )
)
.addTo(map);