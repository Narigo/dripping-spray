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
