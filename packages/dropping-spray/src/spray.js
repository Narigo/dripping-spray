var DrawShapes = require("./draw-shapes.js");
var defaultOptions = {
  color: {
    r: 0,
    g: 0,
    b: 255
  },
  size: 5,

  splatterAmount: 10,
  splatterRadius: 20,

  dropper: true,
  dropThreshold: 50,
  dropSpeed: 3
};

function Spray(options) {
  var opts = options || defaultOptions;
  var color = getOpt("color");
  var size = getOpt("size");
  var splatterAmount = getOpt("splatterAmount");
  var splatterRadius = getOpt("splatterRadius");
  var dropper = getOpt("dropper");
  var dropThreshold = getOpt("dropThreshold");
  var dropSpeed = getOpt("dropSpeed");
  var canvas = opts.canvas;
  var dropFns = [];
  var drops = [];

  initializeDropCounter();

  return {
    draw: draw,
    resetDrops: initializeDropCounter,
    stopDrops: stopCurrentDrops
  };

  function getOpt(name) {
    var opt = opts[name];
    if (typeof opt !== "undefined") {
      return opt;
    } else {
      return defaultOptions[name];
    }
  }

  function draw(drawer, sprayCoords) {
    var al, amount, sprayedCircles, dropLines;
    var spraying = !!sprayCoords;
    var isDropping = false;

    if (spraying) {
      sprayedCircles = sprayAt(sprayCoords.x, sprayCoords.y);
    }

    al = getDrops();
    amount = al.amount;
    dropLines = al.lines;

    if (sprayedCircles && !sprayedCircles.isEmpty()) {
      isDropping = true;
      drawer.drawShapes(sprayedCircles);
    }

    if ((dropLines && !dropLines.isEmpty()) || amount > 0) {
      isDropping = true;
      drawer.drawShapes(dropLines);
    }

    return isDropping || spraying;
  }

  function getDrops() {
    var dropLines = new DrawShapes.Lines(color.r, color.g, color.b);

    if (dropper) {
      var amount = dropFns.length;
      for (var i = amount - 1; i >= 0; i--) {
        dropFns[i](i, dropLines.shapes);
      }
    }

    return {
      amount: amount,
      lines: dropLines
    };
  }

  function stopCurrentDrops() {
    dropFns = [];
  }

  function initializeDropCounter() {
    for (var x = 0; x < canvas.width / size; x++) {
      drops[x] = [];
      for (var y = 0; y < canvas.height / size; y++) {
        drops[x][y] = {
          count: 0,
          drops: false,
          width: 0,
          dropSpeed: dropSpeed
        };
      }
    }
  }

  function filledCircle(circleShapes, x, y, radius) {
    circleShapes.push(DrawShapes.circle(x, y, radius));
  }

  function dropAt(x, y, initialDrop) {
    var maxY = drops[x].length - 1;

    dropFns.push(createDropFnFor(maxY, x, y, initialDrop));
  }

  function createDropFnFor(maxY, x, y, myDrop) {
    return function(idx, shapesArray) {
      var deltaWidth, deltaX, nextY, otherDrop;

      if (myDrop.count <= 0) {
        myDrop.count = 0;
        dropFns.splice(idx, 1);
      } else if (y < maxY) {
        myDrop.dropSpeed = Math.max(1, myDrop.dropSpeed - myDrop.width);

        if (myDrop.dropSpeed === 1) {
          deltaWidth = Math.floor(Math.random() * 3) - 1;
          deltaX = Math.floor(Math.random() * 3) - 1;

          // drop next step
          nextY = y + 1;
          otherDrop = drops[x][nextY];
          if (!otherDrop.drops) {
            otherDrop.drops = true;
            myDrop.count = myDrop.count - myDrop.width;
          }
          otherDrop.count += myDrop.count;
          otherDrop.width = Math.max(
            Math.max(1, myDrop.width + deltaWidth),
            otherDrop.width
          );
          shapesArray.push(
            DrawShapes.line(
              x * size,
              y * size,
              x * size + deltaX,
              nextY * size,
              myDrop.width
            )
          );

          myDrop.count = 0;
          myDrop = otherDrop;
          y = nextY;
        } else {
          myDrop.count = myDrop.count + size;
        }

        dropFns.splice(idx, 1, createDropFnFor(maxY, x, y, myDrop));
      }
    };
  }

  function sprayAt(x, y) {
    var xArea = Math.max(0, Math.floor(Math.min(canvas.width - 1, x) / size));
    var yArea = Math.max(0, Math.floor(Math.min(canvas.height - 1, y) / size));
    var drop = drops[xArea][yArea];
    if (dropper) {
      drop.count += size;
      if (drop.count >= dropThreshold) {
        drop.drops = true;
        drop.width = size;
        dropAt(xArea, yArea, drop);
      }
    }
    var circles = new DrawShapes.Circles(color.r, color.g, color.b);
    filledCircle(circles.shapes, x, y, size);
    drawCirclesAround(circles.shapes, x, y);
    return circles;
  }

  function drawCirclesAround(circleShapes, x, y) {
    var dx, dy, r, s, t;
    for (var i = splatterAmount; i > 0; i--) {
      t = Math.random() * 2 * Math.PI;
      r = Math.random();
      dx = r * Math.cos(t) * splatterRadius;
      dy = r * Math.sin(t) * splatterRadius;
      s = 1 - Math.sqrt(dx * dx + dy * dy) / splatterRadius;
      filledCircle(circleShapes, x + dx, y + dy, size * s);
    }
  }
}

module.exports = Spray;
