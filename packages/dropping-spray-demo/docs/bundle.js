(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var Spray = require("dropping-spray").Spray;
// var Drawer = require('dropping-spray-canvas/src/canvas-drawer.js');
var Drawer = require("dropping-spray-pixijs").Drawer;

var canvas = document.getElementById("spray1");
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

var options = require("./options.js")(
  "options",
  canvas,
  drawer,
  createSpray,
  resetSpray,
  autoSprays,
  triggerRender
);

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
  canvas.height = document.getElementById("spray1").offsetHeight;
  canvas.width = window.innerWidth;
}

},{"./options.js":2,"dropping-spray":"dropping-spray","dropping-spray-pixijs":"dropping-spray-pixijs"}],2:[function(require,module,exports){
module.exports = function(
  optionDomId,
  canvas,
  drawer,
  createSpray,
  resetSpray,
  autoSprays,
  triggerRender
) {
  var form = document.getElementById(optionDomId);

  function getOptions() {
    var r = fieldBetween(form.red, 0, 255);
    var g = fieldBetween(form.green, 0, 255);
    var b = fieldBetween(form.blue, 0, 255);

    return {
      color: {
        r: r,
        g: g,
        b: b
      },
      canvas: canvas,
      size: fieldBetween(form.size, 1, Math.min(canvas.height, canvas.width)),
      splatterAmount: fieldBetween(form.splatterAmount, 0, Infinity),
      splatterRadius: fieldBetween(form.splatterRadius, 0, Infinity),
      dropper: !!form.drops.checked,
      dropThreshold: fieldBetween(form.dropThreshold, 0, Infinity),
      dropSpeed: fieldBetween(form.dropSpeed, 0, Infinity)
    };

    function fieldBetween(field, min, max) {
      var value = Math.max(min, Math.min(max, parseInt(field.value)));
      field.value = value;
      return value;
    }
  }

  function setupOptions() {
    var hider = document.getElementById("options-hider");
    var options = document.getElementById("options-content");

    hider.addEventListener("click", toggleOptions);

    var isHidden = true;

    function toggleOptions() {
      isHidden = !isHidden;
      if (isHidden) {
        options.style.display = "none";
        hider.innerHTML = "Open options";
        hider.classList.add("open");
      } else {
        options.style.display = "block";
        hider.innerHTML = "close";
        hider.classList.remove("open");
      }
    }
  }

  function setupForm() {
    var autoSpraySpeed = parseInt(form.autoSpraySpeed.value);

    form.red.addEventListener("change", resetSpray);
    form.green.addEventListener("change", resetSpray);
    form.blue.addEventListener("change", resetSpray);
    form.size.addEventListener("change", resetSpray);
    form.splatterAmount.addEventListener("change", resetSpray);
    form.splatterRadius.addEventListener("change", resetSpray);
    form.drops.addEventListener("change", resetSpray);
    form.dropThreshold.addEventListener("change", resetSpray);
    form.dropSpeed.addEventListener("change", resetSpray);
    form.autoSpraySpeed.addEventListener("change", function() {
      autoSpraySpeed = parseInt(form.autoSpraySpeed.value);
    });

    document
      .getElementById("clearCanvas")
      .addEventListener("click", function() {
        resetSpray();
        [].forEach.call(autoSprays, function(autoSpray) {
          autoSpray.spray.stopDrops();
          autoSpray.spray.resetDrops();
        });
        drawer.clear();
      });

    document
      .getElementById("autoSprayStop")
      .addEventListener("click", function() {
        [].forEach.call(autoSprays, function(autoSpray) {
          autoSpray.spray.stopDrops();
        });
        autoSprays = [];
      });

    document
      .getElementById("randomColor")
      .addEventListener("click", function() {
        randomizeColor();
        resetSpray();
      });

    document.getElementById("autoSpray").addEventListener("click", function() {
      var speed = autoSpraySpeed;
      var autoSprayCoords = {
        x: 0,
        y: Math.floor(Math.random() * canvas.height)
      };
      var autoSpray = {
        draw: sprayFromLeftToRight,
        spray: createSpray()
      };
      autoSprays.push(autoSpray);
      triggerRender();

      function sprayFromLeftToRight(drawer) {
        autoSprayCoords.x =
          autoSprayCoords.x + Math.round(Math.random() * Math.max(0, speed));
        autoSprayCoords.y = Math.max(
          0,
          Math.min(
            canvas.height - 1,
            autoSprayCoords.y + Math.floor(Math.random() * 3) - 1
          )
        );
        if (autoSprayCoords.x < canvas.width) {
          autoSpray.spray.draw(drawer, autoSprayCoords);
          return true;
        } else {
          autoSprays.splice(autoSprays.indexOf(autoSpray), 1);
          return false;
        }
      }
    });

    function randomizeColor() {
      form.red.value = Math.round(Math.random() * 255);
      form.green.value = Math.round(Math.random() * 255);
      form.blue.value = Math.round(Math.random() * 255);
    }

    randomizeColor();
  }

  return {
    getOptions: getOptions,
    setupOptions: setupOptions,
    setupForm: setupForm
  };
};

},{}]},{},[1]);
