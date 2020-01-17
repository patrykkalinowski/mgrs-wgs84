import Feature from 'ol/Feature.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import Circle from 'ol/geom/Circle.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import {OSM, Vector as VectorSource} from 'ol/source.js';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style.js';

var mgrs_grid  = require("./mgrs_grid.json")

var image = new CircleStyle({
radius: 5,
fill: null,
stroke: new Stroke({color: 'red', width: 1})
});

var styles = {
'Point': new Style({
    image: image
}),
'LineString': new Style({
    stroke: new Stroke({
    color: 'green',
    width: 1
    })
}),
'MultiLineString': new Style({
    stroke: new Stroke({
    color: 'green',
    width: 1
    })
}),
'MultiPoint': new Style({
    image: image
}),
'MultiPolygon': new Style({
    stroke: new Stroke({
    color: 'yellow',
    width: 1
    }),
    fill: new Fill({
    color: 'rgba(255, 255, 0, 0.1)'
    })
}),
'Polygon': new Style({
    stroke: new Stroke({
    color: 'blue',
    lineDash: [4],
    width: 3
    }),
    fill: new Fill({
    color: 'rgba(0, 0, 255, 0.1)'
    })
}),
'GeometryCollection': new Style({
    stroke: new Stroke({
    color: 'magenta',
    width: 2
    }),
    fill: new Fill({
    color: 'magenta'
    }),
    image: new CircleStyle({
    radius: 10,
    fill: null,
    stroke: new Stroke({
        color: 'magenta'
    })
    })
}),
'Circle': new Style({
    stroke: new Stroke({
    color: 'red',
    width: 2
    }),
    fill: new Fill({
    color: 'rgba(255,0,0,0.2)'
    })
})
};

var styleFunction = function(feature) {
return styles[feature.getGeometry().getType()];
};

// Webmercator =  EPSG:3857
// WGS84 =        EPSG:4326
var vectorSource = new VectorSource({
features: (new GeoJSON()).readFeatures(mgrs_grid, { featureProjection: "EPSG:3857" })
});

vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)));

var vectorLayer = new VectorLayer({
    source: vectorSource,
    style: styleFunction
});

var map = new Map({
    layers: [
        new TileLayer({
        source: new OSM()
        }),
        vectorLayer
    ],
    target: 'map',
    view: new View({
        center: [5e6, 5e6],
        zoom: 6
    })
});