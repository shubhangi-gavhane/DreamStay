

mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
        container: 'map',
        zoom: 16.2,
        pitch: 75,
        bearing: -170,

        center: coordinates, // Longitude, Latitude
        style: 'mapbox://styles/mapbox/standard', // Use the Mapbox Standard style
        config: {
            // Initial configuration for the Mapbox Standard style set above. By default, its ID is `basemap`.
            basemap: {
                // Here, we're disabling all of the 3D layers such as landmarks, trees, and 3D extrusions.
                show3dObjects: false
            }
        }
});



const marker = new mapboxgl.Marker({color :'red'})
.setLngLat(coordinates)
.addTo(map);


