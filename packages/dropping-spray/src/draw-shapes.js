function Circles(red, green, blue) {
  var that = this;
  this.shape = 'circle';
  this.color = {
    r : red,
    g : green,
    b : blue
  };
  this.shapes = [];
  this.isEmpty = function () {
    return that.shapes.length === 0;
  };
}

function Lines(red, green, blue) {
  var that = this;
  this.shape = 'line';
  this.color = {
    r : red,
    g : green,
    b : blue
  };
  this.shapes = [];
  this.isEmpty = function () {
    return that.shapes.length === 0;
  };
}

function circle(x, y, radius) {
  return {
    x : x,
    y : y,
    radius : radius
  };
}

function line(x0, y0, x1, y1, size) {
  return {
    size : size,
    x0 : x0,
    y0 : y0,
    x1 : x1,
    y1 : y1
  };
}

module.exports = {
  circle : circle,
  line : line,
  Circles : Circles,
  Lines : Lines
};
