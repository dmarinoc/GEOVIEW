

	var markers = L.markerClusterGroup();
	var schools = L.geoJson(schools, {
		onEachFeature: function (feature, layer) //functionality on click on feature
			{
			layer.bindPopup("I am a school"); //just to show something in the popup. could be part of the geojson as well!
			}
		});
	markers.addLayer(schools); // add it to the cluster group
	map.addLayer(markers);		// add it to the map
	map.fitBounds(markers.getBounds()); //set view on the cluster extend
	


	var schoolsIcon = L.icon({
        iconSize: [27, 27],
        iconAnchor: [13, 27],
        popupAnchor:  [1, -24],
        iconUrl: 'lib/leaflet/images/marker-icon.png'
	});

		    pointToLayer: function (feature, latlng) {
	        return L.marker(latlng, {icon:schoolsIcon});
	    },




		var schoolsMarker = {
	    radius: 8,
	    fillColor: "#ff7800",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.5
	};

	var schools = L.geoJSON(schools, {
	    pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, schoolsMarker);
	    },
	    onEachFeature: function(feature, layer){
	    	layer.bindPopup(feature.properties.CODIGOAMIE);
	    }
	});


	var groupedOverlays = {
  		"Analysis": {
    		"Provinces": provA,
    		"Schools": markers

  		},
  		"Random": {
  			"Canton": canton
  		}
	};

	var options = {
		exclusiveGroups:["Analysis"],
		groupCheckboxes: true
	};

	var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, options);
	map.addControl(layerControl);