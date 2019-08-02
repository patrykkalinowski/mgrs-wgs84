var mgrs = require('mgrs');


// console.log(mgrs.forward([50, 20]));
// console.log(mgrs.toPoint('37TGI2000060000'));
// console.log(mgrs.toPoint('37TGG34'));

const GG26 = ["37TGG2000060000", "37TGG2999960000", "37TGG2000069999", "37TGG2999969999"]
const GG26_lat = [];

for (point of GG26) {
  GG26_lat.push(mgrs.toPoint(point));
}

// console.log(GG26_lat);


// Iterate through all MGRS zones inside 36T, 37T and 38T
// The identification consists of a column letter (A–Z, omitting I and O) followed by a row letter (A–V, omitting I and O).
UTM_numbers = 0; // TODO: Array of 1 to 60
all_zones = "CDEFGHJKLMNPQRSTUVWX".split('');
// zones = ['36T', '37T', '38T']
zones = [
  {
    "name": '37T',
    "min_longitude": 38,
    "max_longitude": 42,
    "min_latitude": 41,
    "max_latitude": 44,
  },
  {
    "name": '38T',
    "min_longitude": 42,
    "max_longitude": 48,
    "min_latitude": 41,
    "max_latitude": 44,
  }
]
columns = "ABCDEFGHJKLMNPQRSTUVWXYZ".split('');
rows = "ABCDEFGHJKLMNPQRSTUV".split('');
coords = "0123456789".split('');

points = [];
coordinates = [];

// console.log(columns, rows);
for (zone of zones) {
  for (column of columns) {
    for (row of rows) {
      for (coord_x of coords) { // x
        for (coord_y of coords) { // y
          grid = zone.name + column + row + coord_x + coord_y;

          // prepare 4 corners of grid square + last corner same as first to connect ends
          var corners = [
            zone.name + column + row + coord_x + "0000" + coord_y + "0000",
            zone.name + column + row + coord_x + "0000" + coord_y + "9999",
            zone.name + column + row + coord_x + "9999" + coord_y + "9999",
            zone.name + column + row + coord_x + "9999" + coord_y + "0000",
            zone.name + column + row + coord_x + "0000" + coord_y + "0000",
          ]

          var corners_lonlat = [];

          // check if corners are valid MGRS coordinates
          for (corner of corners) {
            try {
              var corner_lonlat = mgrs.toPoint(corner);
              // save to array if valid
              corners_lonlat.push(corner_lonlat)
              // save corner as point to display for testing
              points.push(corner_lonlat)
            }
            catch (err) {
              console.log(corner + " is invalid MGRS string: " + err);
              break;
            }
          }

          // check if all corners are valid
          function withinBoundaries(lonlat) {
            return lonlat[0] > zone.min_longitude && lonlat[0] < zone.max_longitude && lonlat[1] > zone.min_latitude && lonlat[1] < zone.max_latitude
          }

          // if square grid has at least one point valid withing coordinate boundaries, display it on map
          if (corners_lonlat.some(withinBoundaries)) {
            var corners_cut_to_boundaries = [];

            for (lonlat of corners_lonlat) {
              if (lonlat[0] < zone.min_longitude) {
                lonlat[0] = zone.min_longitude
              }
              if (lonlat[0] > zone.max_longitude) {
                lonlat[0] = zone.max_longitude
              }

              if (lonlat[1] < zone.min_latitude) {
                lonlat[1] = zone.min_latitude
              }
              if (lonlat[1] > zone.max_latitude) {
                lonlat[1] = zone.max_latitude
              }
              
              corners_cut_to_boundaries.push(lonlat)
            }
            // console.log(corner_lonlat + " is within boundaries");
            coordinates.push([corners_cut_to_boundaries]);
          }

          // if all 5 corners are valid, save them
          if (corners_lonlat.length === 5) {
          }
        }
      }
    }
  }
}

// console.log(points);



var features = []
// for (point of points) {
  // features.push(
    //   {
      //     'type': 'Feature',
      //     'geometry': {
        //       'type': 'Point',
        //       'coordinates': point
        //     }
        //   }
        // )
// }       
for (coord of coordinates) {
  features.push(
    {
      'type': 'Feature',
      'geometry': {
        'type': 'Polygon',
        'coordinates': coord
      }
    }
  )
}



var geoJSON = {
  'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:4326'
    }
  },
  'features': features.slice(0,8000)
};

const fs = require('fs');
fs.writeFile("./mgrs_grid.json", JSON.stringify(geoJSON), function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
}); 