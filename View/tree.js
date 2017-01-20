
Ext.require([
    'Ext.container.Viewport',
    'Ext.layout.container.Border',
    'GeoExt.tree.Panel',
    'Ext.tree.plugin.TreeViewDragDrop',
    'GeoExt.panel.Map',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.tree.View',
    'GeoExt.tree.Column',
    'Ext.state.Manager',
    'Ext.state.CookieProvider',
    'Ext.window.MessageBox',
    'Ext.container.Viewport',
    'Ext.form.ComboBox',
    'GeoExt.data.ScaleStore',
    'GeoExt.container.WmsLegend',
    'GeoExt.container.UrlLegend',
    'GeoExt.container.VectorLegend',
    'GeoExt.panel.Legend'
]);


Ext.application({
    name: 'Tree',
    launch: function() {

        // create a map panel with some layers that we will show in our layer tree
        // below.
        var mapPanel = Ext.create('GeoExt.panel.Map', {
            border: true,
            region: "center",
            // we do not want all overlays, to try the OverlayLayerContainer
            map: {allOverlays: false},
            center: [-78.663, -1.352],
            zoom: 8,
            layers: [
                new OpenLayers.Layer.WMS("Gray OSM-WMS",
                    "http://ows.terrestris.de/osm-gray/service?",
                    {layers: 'OSM-WMS'},
                    {
                        attribution: '&copy; terrestris GmbH & Co. KG <br>' +
                            'Data &copy; OpenStreetMap ' +
                            '<a href="http://www.openstreetmap.org/copyright/en"' +
                            'target="_blank">contributors<a>'
                    }
                ),
                new OpenLayers.Layer.WMS("Color OSM-WMS",
                    "https://ows.terrestris.de/osm/service?",
                    {layers: 'OSM-WMS'},
                    {
                        attribution: '&copy; terrestris GmbH & Co. KG <br>' +
                            'Data &copy; OpenStreetMap ' +
                            '<a href="http://www.openstreetmap.org/copyright/en"' +
                            'target="_blank">contributors<a>'
                    }
                ),



                new OpenLayers.Layer.WMS("Population density",
                    "http://181.211.99.244:8080/geoserver/Mosaicos/wms?",
                    {
                        layers: 'M_DensidadPoblacional',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        singleTile: true,
                    }
                ),

                new OpenLayers.Layer.WMS("Population by age",
                    "http://geoinec.inec.gob.ec/geoinec/inec/wms?",
                    {
                        layers: 'edades_provincia_2001',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        singleTile: true,
                    }
                ),

                new OpenLayers.Layer.WMS("Basic Services",
                    "http://181.211.99.244:8080/geoserver/Mosaicos/wms?",
                    {
                        layers: 'M_ServiciosBasicos',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        singleTile: true,
                    }
                ),

                new OpenLayers.Layer.WMS("Level of education",
                    "http://181.211.99.244:8080/geoserver/Mosaicos/wms?",
                    {
                        layers: 'M_NivelInstruccion',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        singleTile: true,
                    }
                ),

               new OpenLayers.Layer.WMS("Illiteracy",
                    "http://181.211.99.244:8080/geoserver/Mosaicos/wms?",
                    {
                        layers: 'M_Analfabetismo',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        singleTile: true,
                    }
                ),

                new OpenLayers.Layer.WMS("Health centers",
                    "https://geosalud.msp.gob.ec/geoserver/msp/wms?",
                    {
                        layers: 'vw_wms_informacion_unidad',
                        format: 'image/png',
                        transparent: true
                    },
                    {
                        singleTile: true
                    }
                ),

                new OpenLayers.Layer.WMS("Educative institutions",
                    "http://181.211.99.244:8080/geoserver/Infraestructura_Servicios/wms?",
                    {
                        layers: 'IS_InstitucionesEduactivas',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        singleTile: true,
                    }
                ),

                new OpenLayers.Layer.WMS("Provinces limits",
                    "http://www.geoportaligm.gob.ec/nacional/wms?",
                    {
                        layers: 'igm:provincias',
                        format: 'image/png',
                        transparent: true,
                    },
                    {
                        singleTile: true,
                    }
                ),

        ]
    });


        var store = Ext.create('Ext.data.TreeStore', {
            model: 'GeoExt.data.LayerTreeModel',
            root: {
                expanded: true,
                children: [
                    {
                        plugins: [{
                            ptype: 'gx_layercontainer',
                            store: mapPanel.layers
                        }],
                        expanded: true
                    }, {
                        plugins: ['gx_baselayercontainer'],
                        expanded: true,
                        text: "Base Maps"
                    }, 

                ]
            }
        });

        var layer;

        // create the tree with the configuration from above
        tree = Ext.create('GeoExt.tree.Panel', {
            border: true,
            region: "west",
            title: "Layers",
            width: 250,
            split: true,
            collapsible: true,
            collapseMode: "mini",
            autoScroll: true,
            store: store,
            rootVisible: false,
            lines: false,
            tbar: [{
                text: "remove",
                handler: function() {
                    layer = mapPanel.map.layers[2];
                    mapPanel.map.removeLayer(layer);
                }
            }, {
                text: "add",
                handler: function() {
                    mapPanel.map.addLayer(layer);
                }
            }]
        });

        Ext.create('Ext.Viewport', {
            layout: "fit",
            hideBorders: true,
            items: {
                layout: "border",
                deferredRender: false,
                items: [mapPanel, tree, {
                    contentEl: "desc",
                    region: "east",
                    bodyStyle: {"padding": "5px"},
                    collapsible: true,
                    collapseMode: "mini",
                    split: true,
                    width: 600,
                    title: "Educative statistics"
                }]
            }
        });
    }
});