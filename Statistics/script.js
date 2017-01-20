
	var map = L.map('map').setView([-1.36,-85.06], 14);

	var streets = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		maxZoom: 18

	}).addTo(map);

	var gray = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { 
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		subdomains: 'abcd',
		maxZoom: 19
		});

	var topo = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS',
		maxZoom: 13
	});

	var echelle = {
  	maxWidth: 70,
  	imperial: false,
	};

	L.control.scale(echelle).addTo(map);

	function centrer() {
		map.setView(new L.LatLng(-1.5,-78.6061), 7);
	}

	function centrer_sur(x,y) {
    	map.setView(new L.LatLng(x, y),14);
	}


	var markers = L.markerClusterGroup();

	var schoolsMarker = {
	    radius: 8,
	    fillColor: "#ff7800",
	    color: "#000",
	    weight: 1,
	    opacity: 1,
	    fillOpacity: 0.5
	};

	var schools = L.geoJson(schools, {
		pointToLayer: function (feature, latlng) {
	        return L.circleMarker(latlng, schoolsMarker);
	    },
		onEachFeature: function (feature, layer){
			layer.bindPopup("Code: " + feature.properties.CODIGOAMIE + '<br/>' + "Name: " + feature.properties.NOMBREINST); //just to show something in the popup. could be part of the geojson as well!
			}
		});
	markers.addLayer(schools); // add it to the cluster group
	map.addLayer(markers);		// add it to the map
	map.fitBounds(markers.getBounds()); //set view on the cluster extend

// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>Average density of students</h4>' +  (props ?
			'<b>' + props.DPA_DESPRO + '</b><br />' + props.Est_insti + ' students / institution'
			: 'Hover over a province');
	};

	info.addTo(map);


	function getprovAColor(est){
	    return est > 200 ? '#225ea8' :
	           est > 100 ? '#41b6c4' :
	           est > 30  ? '#a1dab4' :
	                        '#ffffcc';
	}

	function provAStyle(feature){
		return{
			weight: 1,
			opacity: 1,
			color:'white',
			dashArray:'1',
			fillOpacity:0.7,
			fillColor: getprovAColor(feature.properties.Est_insti)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 2,
			fillColor: 'gray',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var provA;

	function resetHighlight(e) {
		provA.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}


	var provA = L.geoJson(provA,{
		style: provAStyle,
		onEachFeature: function(feature, layer){
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			})
		}
	}).addTo(map);

	map.attributionControl.addAttribution('Education data &copy; <a href="http://sni.gob.ec/coberturas/">Ministry of Education</a>');


	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 30, 100, 200],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getprovAColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);


	var baseLayers = {
		"Gray": gray,
		"Streets": streets,
		"Topography": topo
	}

	var overlays = {
    	"Provinces": provA,
    	"Schools": markers
	};

L.control.layers(baseLayers, overlays).addTo(map);


