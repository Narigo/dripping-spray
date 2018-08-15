const Spray = require("dripping-spray").Spray;
const Drawer = require("./canvas-drawer").Drawer;

function createCanvasSpray(canvasId, options) {
  const canvas = document.getElementById(canvasId);
  const drawer = new Drawer(canvas);

  let spray;
  let spraying = false;
  let autoSprays = [];

  let sprayCoords = {
    x: 0,
    y: 0
  };
  let requestingAnimationFrame = false;

  let startEventCanvas = downEvent(canvas, function() {
    spraying = true;
    if (!requestingAnimationFrame) {
      render();
    }
  });
  let moveEventCanvas = downEvent(canvas);

  initListeners();
  resize();
  resetSpray();

  return {
      destroy: destroy,
      reset: resetSpray
  };

  // Functions
  function resetSpray() {
    spray = createSpray();
  }

  function createSpray() {
    let opts = options.getOptions();

    return new Spray(opts);
  }

  function stopSpraying() {
    spraying = false;
    spray.resetDrips();
  }

  function triggerRender() {
    if (!requestingAnimationFrame) {
      render();
    }
  }

  function render() {
    let isDrawing;
    if (spraying) {
      isDrawing = spray.draw(drawer, sprayCoords);
    } else {
      isDrawing = spray.draw(drawer);
    }

    for (let i = autoSprays.length - 1; i >= 0; i--) {
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
      let touchList = event.touches;
      if (touchList) {
        let touch = touchList[0];
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
