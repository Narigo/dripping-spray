describe("The canvas painter", function() {
  var CanvasDrawer = require("./canvas-drawer").Drawer;
  var Shapes = require("dropping-spray").shapes;
  var canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  document.body.appendChild(canvas);
  var painter = new CanvasDrawer(canvas);

  it("should be able to draw a single line", function() {
    var line = Shapes.line(0, 0, 50, 50, 10);
    var lines = new Shapes.Lines(255, 0, 0);
    lines.shapes.push(line);
    painter.drawShapes(lines);
  });

  it("should be able to draw multiple lines", function() {
    var line1 = Shapes.line(10, 20, 10, 80, 5);
    var line2 = Shapes.line(20, 10, 20, 90, 5);
    var line3 = Shapes.line(30, 20, 30, 80, 5);
    var lines = new Shapes.Lines(255, 0, 0);
    lines.shapes.push(line1);
    lines.shapes.push(line2);
    lines.shapes.push(line3);
    painter.drawShapes(lines);
  });

  it("should be able to draw a single circle", function() {
    var circle1 = Shapes.circle(50, 50, 10);
    var circles = new Shapes.Circles(255, 0, 0);
    circles.shapes.push(circle1);
    painter.drawShapes(circles);
  });

  it("should be able to draw multiple circles", function() {
    var circle1 = Shapes.circle(30, 30, 10);
    var circle3 = Shapes.circle(50, 50, 10);
    var circle2 = Shapes.circle(70, 70, 10);
    var circles = new Shapes.Circles(255, 0, 0);
    circles.shapes.push(circle1);
    circles.shapes.push(circle2);
    circles.shapes.push(circle3);
    painter.drawShapes(circles);
  });

  it("should be able to draw multiple lines and circles", function() {
    var line1 = Shapes.line(10, 20, 10, 80, 5);
    var line2 = Shapes.line(20, 10, 20, 90, 5);
    var line3 = Shapes.line(30, 20, 30, 80, 5);
    var lines = new Shapes.Lines(255, 0, 0);
    lines.shapes.push(line1);
    lines.shapes.push(line2);
    lines.shapes.push(line3);
    var circle1 = Shapes.circle(30, 30, 10);
    var circle3 = Shapes.circle(50, 50, 10);
    var circle2 = Shapes.circle(70, 70, 10);
    var circles = new Shapes.Circles(255, 0, 0);
    circles.shapes.push(circle1);
    circles.shapes.push(circle2);
    circles.shapes.push(circle3);
    painter.drawShapes(lines);
    painter.drawShapes(circles);
  });
});
