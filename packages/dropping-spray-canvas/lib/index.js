(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
function CanvasDrawer(canvas) {
  var ctx = canvas.getContext("2d");

  return {
    drawShapes: drawShapes,
    clear: clearCanvas
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
      colorString = getRgbString(
        shapesToRender.color.r,
        shapesToRender.color.g,
        shapesToRender.color.b
      );
      ctx.fillStyle = colorString;
      if (shapesToRender.shape === "line") {
        for (i = shapes.length - 1; i >= 0; i--) {
          shape = shapes[i];
          ctx.strokeStyle = colorString;
          ctx.lineCap = "round";
          ctx.lineWidth = shape.size;
          linePath(shape.x0, shape.y0, shape.x1, shape.y1);
        }
        ctx.stroke();
      } else if (shapesToRender.shape === "circle") {
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
  var rgb = "rgb(";
  rgb += red;
  rgb += ",";
  rgb += green;
  rgb += ",";
  rgb += blue;
  rgb += ")";
  return rgb;
}

module.exports = CanvasDrawer;

},{}],2:[function(require,module,exports){
var Spray = require("dropping-spray").Spray;
var Drawer = require("./canvas-drawer");

function createCanvasSpray(canvasId, options) {
  var canvas = document.getElementById(canvasId);
  var drawer = new Drawer(canvas);

  var spray;
  var spraying = false;
  var autoSprays = [];

  var sprayCoords = {
    x: 0,
    y: 0
  };
  var requestingAnimationFrame = false;

  var startEventCanvas = downEvent(canvas, function() {
    spraying = true;
    if (!requestingAnimationFrame) {
      render();
    }
  });
  var moveEventCanvas = downEvent(canvas);

  initListeners();
  resize();
  resetSpray();

  return {
      destroy: destroy,
      reset: resetSpray,

  }

  // Functions
  function resetSpray() {
    spray = createSpray();
  }

  function createSpray() {
    var opts = options.getOptions();

    return new Spray(opts);
  }

  function stopSpraying() {
    spraying = false;
    spray.resetDrops();
  }

  function triggerRender() {
    if (!requestingAnimationFrame) {
      render();
    }
  }

  function render() {
    var isDrawing;
    if (spraying) {
      isDrawing = spray.draw(drawer, sprayCoords);
    } else {
      isDrawing = spray.draw(drawer);
    }

    for (var i = autoSprays.length - 1; i >= 0; i--) {
      isDrawing = autoSprays[i].draw(drawer) || isDrawing;
    }

    if (isDrawing) {
      requestingAnimationFrame = true;
      requestAnimationFrame(render);
    } else {
      requestingAnimationFrame = false;
    }
  }

  function downEvent(canvas, cb) {
    return function(event) {
      event.preventDefault();
      event.stopPropagation();
      var touchList = event.touches;
      if (touchList) {
        var touch = touchList[0];
        sprayCoords.x = parseInt(touch.pageX) - canvas.offsetLeft;
        sprayCoords.y = parseInt(touch.pageY) - canvas.offsetTop;
      } else {
        sprayCoords.x = event.pageX - canvas.offsetLeft;
        sprayCoords.y = event.pageY - canvas.offsetTop;
      }
      if (cb) {
        cb();
      }
    };
  }

  function resize() {
    canvas.height = document.getElementById(canvasId).offsetHeight;
    canvas.width = window.innerWidth;
  }

  function initListeners() {
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointerdown", startEventCanvas);
    canvas.addEventListener("pointermove", moveEventCanvas);
    document.addEventListener("pointerup", stopSpraying);
  }

  function destroy() {
    window.removeEventListener("resize", resize);
    canvas.removeEventListener("pointerdown", startEventCanvas);
    canvas.removeEventListener("pointermove", moveEventCanvas);
    document.removeEventListener("pointerup", stopSpraying);
  }
}

module.exports = createCanvasSpray;

},{"./canvas-drawer":1,"dropping-spray":"dropping-spray"}],3:[function(require,module,exports){
var Drawer = require('./canvas-drawer');
var createCanvasSpray = require('./create-canvas-spray');

module.exports = {
    Drawer : Drawer,
    createCanvasSpray : createCanvasSpray
};

},{"./canvas-drawer":1,"./create-canvas-spray":2}]},{},[3]);
