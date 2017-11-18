positionCurrent = {
  lat: null,
  lng: null,
  hng: null
}

positionTarget = {
  lat: 35.586859,
  lng: 139.705942,
}

options = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0
};

targetAzimuth = null

var id, target, options;


function success(pos) {
  var crd = pos.coords;

  var azi = azimuth(
      crd.latitude,
      crd.longitude,
      positionTarget.lat,
      positionTarget.lng
  )

  targetAzimuth = azi

  console.log(azi)

  setPosition(positionCurrent, crd.latitude, crd.longitude)

};

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
};


navigator.geolocation.watchPosition(success, error, options);


function setPosition(position, lat, lng, hng) {
  position.lat = lat;
  position.lng = lng;
}





var R_EARTH = 6378137;
var RAD = Math.PI / 180

function azimuth(lat1, lon1, lat2, lon2) {
  lat1 *= RAD;
  lon1 *= RAD;
  lat2 *= RAD;
  lon2 *= RAD;

  var lat_c = (lat1 + lat2) / 2;
  var dx = R_EARTH * (lon2 - lon1) * Math.cos(lat_c);
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
