function CanvasDrawer(canvas) {
  var ctx = canvas.getContext('2d');

  return {
    drawShapes : drawShapes,
    clear : clearCanvas
  };

  function clearCanvas() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  function drawShapes(shapesToRender) {
    var colorString, i, shape, shapes;
    if (!shapesToRender.isEmpty()) {
      shapes = shapesToRender.shapes;
      colorString = getRgbString(shapesToRender.color.r, shapesToRender.color.g, shapesToRender.color.b);
      ctx.fillStyle = colorString;
      if (shapesToRender.shape === 'line') {
        for (i = shapes.length - 1; i >= 0; i--) {
          shape = shapes[i];
          ctx.strokeStyle = colorString;
          ctx.lineCap = 'round';
          ctx.lineWidth = shape.size;
          linePath(shape.x0, shape.y0, shape.x1, shape.y1);
        }
        ctx.stroke();
      } else if (shapesToRender.shape === 'circle') {
        for (i = shapes.length - 1; i >= 0; i--) {
          shape = shapes[i];
          ctx.beginPath();
          circlePath(shape.x, shape.y, shape.radius);
          ctx.fill();
        }
      }
    }
  }

  function linePath(x0, y0, x1, y1) {
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
  }

  function circlePath(x, y, radius) {
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  }
}

function getRgbString(red, green, blue) {
  var rgb = 'rgb(';
  rgb += red;
  rgb += ',';
  rgb += green;
  rgb += ',';
  rgb += blue;
  rgb += ')';
  return rgb;
}

module.exports = CanvasDrawer;
