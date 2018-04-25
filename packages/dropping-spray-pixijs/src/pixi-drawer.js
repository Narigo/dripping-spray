var PIXI = require('pixi.js');

function PixiDrawer(canvas) {
  var resolution = (function() {
    var w = window,
      g = canvas,
      x = w.innerWidth || g.clientWidth,
      y = w.innerHeight || g.clientHeight;

    return [x, y];
  })();

  var maxWidth = resolution[0];
  var maxHeight = resolution[1];
  canvas.width = maxWidth;
  canvas.height = maxHeight;

  var renderer = PIXI.autoDetectRenderer(maxWidth, maxHeight, { view: canvas, antialias: true });

  var stage = new PIXI.Container();

  var circles = new PIXI.Graphics();
  var lines = new PIXI.Graphics();
  stage.addChild(circles);
  stage.addChild(lines);
  renderer.render(stage);

  return {
    drawShapes: drawShapes,
    clear: clearCanvas
  };

  function clearCanvas() {
    circles.clear();
    lines.clear();
    renderer.render(stage);
  }

  function drawShapes(shapesToRender) {
    var color, i, shape, shapes, size, x, y;

    if (!shapesToRender.isEmpty()) {
      shapes = shapesToRender.shapes;
      color = shapesToRender.color.r * 255 * 255 + shapesToRender.color.g * 255 + shapesToRender.color.b;
      if (shapesToRender.shape === "line") {
        for (i = shapes.length - 1; i >= 0; i--) {
          shape = shapes[i];
          size = Math.max(1, Math.round(shape.size));
          lines.lineStyle(size, color, 1);
          lines.beginFill(color, 1);
          lines.drawCircle(shape.x0, shape.y0, size / 4);
          lines.moveTo(shape.x0, shape.y0);
          lines.lineTo(shape.x1, shape.y1);
          lines.drawCircle(shape.x1, shape.y1, size / 4);
          lines.endFill();
        }
      } else if (shapesToRender.shape === "circle") {
        for (i = shapes.length - 1; i >= 0; i--) {
          shape = shapes[i];
          x = Math.round(shape.x);
          y = Math.round(shape.y);
          size = Math.max(1, Math.round(shape.radius));
          circles.lineStyle(size, color, 1);
          circles.beginFill(color);
          circles.drawCircle(x, y, size / 2);
          circles.endFill();
        }
      }

      renderer.render(stage);
    }
  }
}

module.exports = PixiDrawer;
