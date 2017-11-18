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
  alert(azi);
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
  var distance = getDistance(pos1, pos2);
  var element = document.getElementById("distance-result");
  alert(distance);
  element.innerHTML = distance;
}

function getDistance(pos1, pos2) {
  // function radians(deg) {
  //   return deg * RAD;
  // }

  // var result = R_EARTH * Math.acos(
  //   Math.cos(radians(pos1.lat)) * Math.cos(radians(pos2.lat) - radians(pos1.lng)) + Math.sin(radians(pos1.lng)) * Math.sin(radians(pos2.lat))
  //   )
  // result = result / (10000);
  // result = Math.round(result);

  result = 1000
  alert(result);

  return result
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
