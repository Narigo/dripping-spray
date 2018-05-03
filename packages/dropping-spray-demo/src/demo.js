const Spray = require("dropping-spray").Spray;
const Drawer = require("dropping-spray-canvas").Drawer;
// const Drawer = require("dropping-spray-pixijs").Drawer;

const canvas = document.getElementById("spray1");
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

let options = require("./options.js")("options", canvas, drawer, createSpray, resetSpray, autoSprays, triggerRender);

window.addEventListener("resize", resize);
resize();

canvas.addEventListener("pointerdown", startEventCanvas);
canvas.addEventListener("pointermove", moveEventCanvas);

document.addEventListener("pointerup", stopSpraying);

options.setupOptions();
options.setupForm();

resetSpray();

// Functions
function resetSpray() {
  spray = createSpray();
}

function createSpray() {
  const opts = options.getOptions();

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
  canvas.height = document.getElementById("spray1").offsetHeight;
  canvas.width = window.innerWidth;
}
