export function calc_minmax_latlon(city_lats, city_lons, state_borders) {
  let min_lat = 90.0;
  let max_lat = -90.0;
  let min_lon = 360.0;
  let max_lon = 0.0;

  for (let i = 0; i < city_lats.length; i++) {
    if (city_lats[i] < min_lat) {
      min_lat = city_lats[i];
    }
    if (city_lats[i] > max_lat) {
      max_lat = city_lats[i];
    }
  }

  for (let i = 0; i < city_lons.length; i++) {
    if (city_lons[i] < min_lon) {
      min_lon = city_lons[i];
    }
    if (city_lons[i] > max_lon) {
      max_lon = city_lons[i];
    }
  }

  for (let i = 0; i < state_borders.length; i++) {
    for (let j = 0; j < state_borders[i][1].length; j++) {
      if (state_borders[i][1][j] < min_lat) {
        min_lat = state_borders[i][1][j];
      }
      if (state_borders[i][1][j] > max_lat) {
        max_lat = state_borders[i][1][j];
      }
    }
    for (let j = 0; j < state_borders[i][0].length; j++) {
      if (state_borders[i][0][j] < min_lon) {
        min_lon = state_borders[i][0][j];
      }
      if (state_borders[i][0][j] > max_lon) {
        max_lon = state_borders[i][0][j];
      }
    }
  }

  let returnValue = {};
  returnValue["minLat"] = min_lat;
  returnValue["maxLat"] = max_lat;
  returnValue["minLon"] = min_lon;
  returnValue["maxLon"] = max_lon;
  return returnValue;
}


export class Mapper {
  constructor(minmax_latlon, canvasWidth, canvasHeight, revealDistance, latLonRatio) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.minLat = minmax_latlon.minLat;
    this.maxLat = minmax_latlon.maxLat;
    this.minLon = minmax_latlon.minLon;
    this.maxLon = minmax_latlon.maxLon;
    this.revealDistance = revealDistance;

    // Settings
    this.minXscale = 0.05;
    this.minYscale = 0.05;
    this.maxXscale = 0.95;
    this.maxYscale = 0.95;
    this.latLonRatio = latLonRatio;

    // Common Calculations
    this.minX = this.canvasWidth * this.minXscale;
    this.maxX = this.canvasWidth * this.maxXscale;
    this.minY = this.canvasHeight * this.minYscale;
    this.maxY = this.canvasHeight * this.maxYscale;
    this.latWidth = this.maxLat - this.minLat;
    this.lonWidth = this.maxLon - this.minLon;
    this.xWidth = this.maxX - this.minX;
    this.yWidth = this.maxY - this.minY;

    // Latitude-Longitude Ratio Calibration
    if (this.latLonRatio < (this.latWidth/this.yWidth) / (this.lonWidth/this.xWidth)) {
      this.xWidth = this.lonWidth * this.latLonRatio * (this.yWidth/this.latWidth);
      this.minX = (this.canvasWidth - this.xWidth) / 2;
      this.maxX = this.xWidth + this.minX;
    }
    else {
      this.yWidth = this.latWidth / this.latLonRatio * (this.xWidth/this.lonWidth);
      this.minY = (this.canvasHeight - this.yWidth) / 2;
      this.maxY = this.yWidth + this.minY;
    }
  }

  latlon2pixpos(lat, lon) {
    let returnValue = {};
    returnValue["x"] = this.minX + this.xWidth * (lon - this.minLon) / this.lonWidth;
    returnValue["y"] = this.canvasHeight - (this.minY + this.yWidth * (lat - this.minLat) / this.latWidth);
    return returnValue;
  }

  getRevealPixRadius() {
    return this.revealDistance * this.xWidth / this.lonWidth;
  }

  getCityPixRadius() {
    return 0.0005 * this.xWidth;
  }
}


export function plot_states(map, myContext, state_borders) {
  let thisPos;
  myContext.strokeStyle = "rgb(200,0,0)";
  myContext.beginPath();
  for (let i = 0; i < state_borders.length; i++) {
    thisPos = map.latlon2pixpos(state_borders[i][1][0], state_borders[i][0][0]);
    myContext.moveTo(thisPos.x, thisPos.y);
    for (let j = 1; j < state_borders[i][0].length; j++) {
      thisPos = map.latlon2pixpos(state_borders[i][1][j], state_borders[i][0][j]);
      myContext.lineTo(thisPos.x, thisPos.y);
    }
    myContext.stroke();
  }
}