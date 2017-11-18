// declare global variables
R_EARTH = 6378137;
RAD = Math.PI / 180

positionCurrent = {
  lat: null,
  lng: null,
  hng: null
}

positionTarget = {
  lat: 35.58589,
  lng: 139.705559
}

options = {
  enableHighAccuracy: true,
  timeout: 27000,
  maximumAge: 30000
};

targetAzimuth = null


// watchPosition: executor
function success(pos) {
  var crd = pos.coords;
  setPosition(positionCurrent, crd.latitude, crd.longitude)

  var azi = azimuth(
    positionCurrent,
    positionTarget
  )

  targetAzimuth = azi;
  setDistance(positionCurrent, positionTarget);
};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};

navigator.geolocation.watchPosition(success, error, options);


// methods
function setPosition(position, lat, lng, hng) {
  position.lat = lat;
  position.lng = lng;
}


function setDistance(pos1, pos2) {
  var distance = getDistance(pos1.lat, pos1.lng, pos2.lat, pos2.lng);
  var element = document.getElementById("distance-result");
  element.innerText = distance.distance_unit;
}


function getDistance(lat1, lng1, lat2, lng2) {
  lat_average = Math.PI / 180 * ( lat1 + ((lat2 - lat1) / 2) ),
  lat_difference = Math.PI / 180 * ( lat1 - lat2 ),
  lon_difference = Math.PI / 180 * ( lng1 - lng2 ),
  curvature_radius_tmp = 1 - 0.00669438 * Math.pow(Math.sin(lat_average), 2),
  meridian_curvature_radius = 6335439.327 / Math.sqrt(Math.pow(curvature_radius_tmp, 3)),
  prime_vertical_circle_curvature_radius = 6378137 / Math.sqrt(curvature_radius_tmp),
  distance = 0,
  distance_unit = "";
  
  //２点間の距離をメートルで取得する（単位なし）
  distance = Math.pow(meridian_curvature_radius * lat_difference, 2) + Math.pow(prime_vertical_circle_curvature_radius * Math.cos(lat_average) * lon_difference, 2);
  distance = Math.sqrt(distance);
  distance = Math.round(distance);
  
  // ２点間の距離を単位ありで取得する（1000m以上は、kmで表示）
  distance_unit = Math.round(distance);
  if (distance_unit < 1000) {
    distance_unit = distance_unit + "m";
  } else {
    distance_unit = Math.round(distance_unit / 100);
    distance_unit = (distance_unit / 10) + "km";
  }
  
  return {
    "distance": distance,
    "distance_unit": distance_unit
  };
}

function feetToMeter(feetDistance) {
  return feetDistance * 0.3048
}



function azimuth(pos1, pos2) {

  var lat1 = pos1.lat,
      lng1 = pos1.lng
      lat2 = pos2.lat,
      lng2 = pos2.lng

  lat1 *= RAD;
  lng1 *= RAD;
  lat2 *= RAD;
  lng2 *= RAD;

  var lat_c = (lat1 + lat2) / 2;
  var dx = R_EARTH * (lng2 - lng1) * Math.cos(lat_c);
  var dy = R_EARTH * (lat2 - lat1);

  if (dx === 0 && dt == 0) {
    return 0;
  } else {
    return Math.atan2(dy, dx) / RAD;
  }
}






function onHeadingChange(event) {
  var compass = document.getElementById("compass")
  console.log(event);
  var heading = event.alpha;

  if (typeof event.webkitCompassHeading !== "undefined") {
    heading = event.webkitCompassHeading;
  }

  positionCurrent.hng = targetAzimuth - heading;

  if (typeof heading !== "undefined" && heading !== null) {
    if (typeof compass.style.transform !== "undefined") {
      compass.style.transform = "rotateZ(" + positionCurrent.hng + "deg)";
      console.log("rotate");
      console.log(positionCurrent.hng);
    } else if (typeof compass.style.webkitTransform !== "undefined") {
      compass.style.webkitTransform = "rotateZ(" + positionCurrent.hng + "deg)";
    }
  } else {
    console.log("Error")
  }
}

function getBrowserOrientation() {
  var orientation;
  if (screen.orientation && screen.orientation.type) {
    orientation = screen.orientation.type;
  } else {
    orientation = screen.orientation ||
                  screen.mozOrientation ||
                  screen.msOrientation;
  }

  return orientation;
}


window.addEventListener("deviceorientation", onHeadingChange);
