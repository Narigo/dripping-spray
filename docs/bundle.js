(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global['dripping-spray-demo'] = factory());
}(this, function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var lib = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  factory(exports);
	}(commonjsGlobal, (function (exports) {
	  function Circles(red, green, blue) {
	    var that = this;
	    this.shape = "circle";
	    this.color = {
	      r: red,
	      g: green,
	      b: blue
	    };
	    this.shapes = [];
	    this.isEmpty = function() {
	      return that.shapes.length === 0;
	    };
	  }

	  function Lines(red, green, blue) {
	    var that = this;
	    this.shape = "line";
	    this.color = {
	      r: red,
	      g: green,
	      b: blue
	    };
	    this.shapes = [];
	    this.isEmpty = function() {
	      return that.shapes.length === 0;
	    };
	  }

	  function circle(x, y, radius) {
	    return {
	      x: x,
	      y: y,
	      radius: radius
	    };
	  }

	  function line(x0, y0, x1, y1, size) {
	    return {
	      size: size,
	      x0: x0,
	      y0: y0,
	      x1: x1,
	      y1: y1
	    };
	  }

	  var drawShapes = {
	    circle: circle,
	    line: line,
	    Circles: Circles,
	    Lines: Lines
	  };

	  var defaultOptions = {
	    color: {
	      r: 0,
	      g: 0,
	      b: 255
	    },
	    size: 5,

	    splatterAmount: 10,
	    splatterRadius: 20,

	    dripper: true,
	    dripThreshold: 50,
	    dripSpeed: 3
	  };

	  function Spray(options) {
	    var opts = options || defaultOptions;
	    var color = getOpt("color");
	    var size = getOpt("size");
	    var splatterAmount = getOpt("splatterAmount");
	    var splatterRadius = getOpt("splatterRadius");
	    var dripper = getOpt("dripper");
	    var dripThreshold = getOpt("dripThreshold");
	    var dripSpeed = getOpt("dripSpeed");
	    var canvas = opts.canvas;
	    var dripFns = [];
	    var drips = [];

	    initializeDripCounter();

	    return {
	      draw: draw,
	      resetDrips: initializeDripCounter,
	      stopDrips: stopCurrentDrips
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
	      var al, amount, sprayedCircles, dripLines;
	      var spraying = !!sprayCoords;
	      var isDripping = false;

	      if (spraying) {
	        sprayedCircles = sprayAt(sprayCoords.x, sprayCoords.y);
	      }

	      al = getDrips();
	      amount = al.amount;
	      dripLines = al.lines;

	      if (sprayedCircles && !sprayedCircles.isEmpty()) {
	        isDripping = true;
	        drawer.drawShapes(sprayedCircles);
	      }

	      if ((dripLines && !dripLines.isEmpty()) || amount > 0) {
	        isDripping = true;
	        drawer.drawShapes(dripLines);
	      }

	      return isDripping || spraying;
	    }

	    function getDrips() {
	      var dripLines = new drawShapes.Lines(color.r, color.g, color.b);

	      if (dripper) {
	        var amount = dripFns.length;
	        for (var i = amount - 1; i >= 0; i--) {
	          dripFns[i](i, dripLines.shapes);
	        }
	      }

	      return {
	        amount: amount,
	        lines: dripLines
	      };
	    }

	    function stopCurrentDrips() {
	      dripFns = [];
	    }

	    function initializeDripCounter() {
	      for (var x = 0; x < canvas.width / size; x++) {
	        drips[x] = [];
	        for (var y = 0; y < canvas.height / size; y++) {
	          drips[x][y] = {
	            count: 0,
	            drips: false,
	            width: 0,
	            dripSpeed: dripSpeed
	          };
	        }
	      }
	    }

	    function filledCircle(circleShapes, x, y, radius) {
	      circleShapes.push(drawShapes.circle(x, y, radius));
	    }

	    function dripAt(x, y, initialDrip) {
	      var maxY = drips[x].length - 1;

	      dripFns.push(createDripFnFor(maxY, x, y, initialDrip));
	    }

	    function createDripFnFor(maxY, x, y, myDrip) {
	      return function(idx, shapesArray) {
	        var deltaWidth, deltaX, nextY, otherDrip;

	        if (myDrip.count <= 0) {
	          myDrip.count = 0;
	          dripFns.splice(idx, 1);
	        } else if (y < maxY) {
	          myDrip.dripSpeed = Math.max(1, myDrip.dripSpeed - myDrip.width);

	          if (myDrip.dripSpeed === 1) {
	            deltaWidth = Math.floor(Math.random() * 3) - 1;
	            deltaX = Math.floor(Math.random() * 3) - 1;

	            // drip next step
	            nextY = y + 1;
	            otherDrip = drips[x][nextY];
	            if (!otherDrip.drips) {
	              otherDrip.drips = true;
	              myDrip.count = myDrip.count - myDrip.width;
	            }
	            otherDrip.count += myDrip.count;
	            otherDrip.width = Math.max(
	              Math.max(1, myDrip.width + deltaWidth),
	              otherDrip.width
	            );
	            shapesArray.push(
	              drawShapes.line(
	                x * size,
	                y * size,
	                x * size + deltaX,
	                nextY * size,
	                myDrip.width
	              )
	            );

	            myDrip.count = 0;
	            myDrip = otherDrip;
	            y = nextY;
	          } else {
	            myDrip.count = myDrip.count + size;
	          }

	          dripFns.splice(idx, 1, createDripFnFor(maxY, x, y, myDrip));
	        }
	      };
	    }

	    function sprayAt(x, y) {
	      var xArea = Math.max(0, Math.floor(Math.min(canvas.width - 1, x) / size));
	      var yArea = Math.max(0, Math.floor(Math.min(canvas.height - 1, y) / size));
	      var drip = drips[xArea][yArea];
	      if (dripper) {
	        drip.count += size;
	        if (drip.count >= dripThreshold) {
	          drip.drips = true;
	          drip.width = size;
	          dripAt(xArea, yArea, drip);
	        }
	      }
	      var circles = new drawShapes.Circles(color.r, color.g, color.b);
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

	  var spray = Spray;

	  var src = {
	    shapes: drawShapes,
	    Spray: spray
	  };
	  var src_1 = src.shapes;
	  var src_2 = src.Spray;

	  exports.default = src;
	  exports.shapes = src_1;
	  exports.Spray = src_2;

	  Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	unwrapExports(lib);

	var lib$1 = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
	  factory(exports);
	}(commonjsGlobal, (function (exports) {
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

	  var canvasDrawer = {
	    Drawer: CanvasDrawer
	  };

	  var commonjsGlobal$1 = typeof window !== 'undefined' ? window : typeof commonjsGlobal !== 'undefined' ? commonjsGlobal : typeof self !== 'undefined' ? self : {};

	  function unwrapExports (x) {
	  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	  }

	  function createCommonjsModule(fn, module) {
	  	return module = { exports: {} }, fn(module, module.exports), module.exports;
	  }

	  var lib = createCommonjsModule(function (module, exports) {
	  (function (global, factory) {
	    factory(exports);
	  }(commonjsGlobal$1, (function (exports) {
	    function Circles(red, green, blue) {
	      var that = this;
	      this.shape = "circle";
	      this.color = {
	        r: red,
	        g: green,
	        b: blue
	      };
	      this.shapes = [];
	      this.isEmpty = function() {
	        return that.shapes.length === 0;
	      };
	    }

	    function Lines(red, green, blue) {
	      var that = this;
	      this.shape = "line";
	      this.color = {
	        r: red,
	        g: green,
	        b: blue
	      };
	      this.shapes = [];
	      this.isEmpty = function() {
	        return that.shapes.length === 0;
	      };
	    }

	    function circle(x, y, radius) {
	      return {
	        x: x,
	        y: y,
	        radius: radius
	      };
	    }

	    function line(x0, y0, x1, y1, size) {
	      return {
	        size: size,
	        x0: x0,
	        y0: y0,
	        x1: x1,
	        y1: y1
	      };
	    }

	    var drawShapes = {
	      circle: circle,
	      line: line,
	      Circles: Circles,
	      Lines: Lines
	    };

	    var defaultOptions = {
	      color: {
	        r: 0,
	        g: 0,
	        b: 255
	      },
	      size: 5,

	      splatterAmount: 10,
	      splatterRadius: 20,

	      dripper: true,
	      dripThreshold: 50,
	      dripSpeed: 3
	    };

	    function Spray(options) {
	      var opts = options || defaultOptions;
	      var color = getOpt("color");
	      var size = getOpt("size");
	      var splatterAmount = getOpt("splatterAmount");
	      var splatterRadius = getOpt("splatterRadius");
	      var dripper = getOpt("dripper");
	      var dripThreshold = getOpt("dripThreshold");
	      var dripSpeed = getOpt("dripSpeed");
	      var canvas = opts.canvas;
	      var dripFns = [];
	      var drips = [];

	      initializeDripCounter();

	      return {
	        draw: draw,
	        resetDrips: initializeDripCounter,
	        stopDrips: stopCurrentDrips
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
	        var al, amount, sprayedCircles, dripLines;
	        var spraying = !!sprayCoords;
	        var isDripping = false;

	        if (spraying) {
	          sprayedCircles = sprayAt(sprayCoords.x, sprayCoords.y);
	        }

	        al = getDrips();
	        amount = al.amount;
	        dripLines = al.lines;

	        if (sprayedCircles && !sprayedCircles.isEmpty()) {
	          isDripping = true;
	          drawer.drawShapes(sprayedCircles);
	        }

	        if ((dripLines && !dripLines.isEmpty()) || amount > 0) {
	          isDripping = true;
	          drawer.drawShapes(dripLines);
	        }

	        return isDripping || spraying;
	      }

	      function getDrips() {
	        var dripLines = new drawShapes.Lines(color.r, color.g, color.b);

	        if (dripper) {
	          var amount = dripFns.length;
	          for (var i = amount - 1; i >= 0; i--) {
	            dripFns[i](i, dripLines.shapes);
	          }
	        }

	        return {
	          amount: amount,
	          lines: dripLines
	        };
	      }

	      function stopCurrentDrips() {
	        dripFns = [];
	      }

	      function initializeDripCounter() {
	        for (var x = 0; x < canvas.width / size; x++) {
	          drips[x] = [];
	          for (var y = 0; y < canvas.height / size; y++) {
	            drips[x][y] = {
	              count: 0,
	              drips: false,
	              width: 0,
	              dripSpeed: dripSpeed
	            };
	          }
	        }
	      }

	      function filledCircle(circleShapes, x, y, radius) {
	        circleShapes.push(drawShapes.circle(x, y, radius));
	      }

	      function dripAt(x, y, initialDrip) {
	        var maxY = drips[x].length - 1;

	        dripFns.push(createDripFnFor(maxY, x, y, initialDrip));
	      }

	      function createDripFnFor(maxY, x, y, myDrip) {
	        return function(idx, shapesArray) {
	          var deltaWidth, deltaX, nextY, otherDrip;

	          if (myDrip.count <= 0) {
	            myDrip.count = 0;
	            dripFns.splice(idx, 1);
	          } else if (y < maxY) {
	            myDrip.dripSpeed = Math.max(1, myDrip.dripSpeed - myDrip.width);

	            if (myDrip.dripSpeed === 1) {
	              deltaWidth = Math.floor(Math.random() * 3) - 1;
	              deltaX = Math.floor(Math.random() * 3) - 1;

	              // drip next step
	              nextY = y + 1;
	              otherDrip = drips[x][nextY];
	              if (!otherDrip.drips) {
	                otherDrip.drips = true;
	                myDrip.count = myDrip.count - myDrip.width;
	              }
	              otherDrip.count += myDrip.count;
	              otherDrip.width = Math.max(
	                Math.max(1, myDrip.width + deltaWidth),
	                otherDrip.width
	              );
	              shapesArray.push(
	                drawShapes.line(
	                  x * size,
	                  y * size,
	                  x * size + deltaX,
	                  nextY * size,
	                  myDrip.width
	                )
	              );

	              myDrip.count = 0;
	              myDrip = otherDrip;
	              y = nextY;
	            } else {
	              myDrip.count = myDrip.count + size;
	            }

	            dripFns.splice(idx, 1, createDripFnFor(maxY, x, y, myDrip));
	          }
	        };
	      }

	      function sprayAt(x, y) {
	        var xArea = Math.max(0, Math.floor(Math.min(canvas.width - 1, x) / size));
	        var yArea = Math.max(0, Math.floor(Math.min(canvas.height - 1, y) / size));
	        var drip = drips[xArea][yArea];
	        if (dripper) {
	          drip.count += size;
	          if (drip.count >= dripThreshold) {
	            drip.drips = true;
	            drip.width = size;
	            dripAt(xArea, yArea, drip);
	          }
	        }
	        var circles = new drawShapes.Circles(color.r, color.g, color.b);
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

	    var spray = Spray;

	    var src = {
	      shapes: drawShapes,
	      Spray: spray
	    };
	    var src_1 = src.shapes;
	    var src_2 = src.Spray;

	    exports.default = src;
	    exports.shapes = src_1;
	    exports.Spray = src_2;

	    Object.defineProperty(exports, '__esModule', { value: true });

	  })));
	  });

	  unwrapExports(lib);

	  const Spray = lib.Spray;
	  const Drawer = canvasDrawer.Drawer;

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

	  var createCanvasSpray_1 = createCanvasSpray;

	  var Drawer$1 = canvasDrawer.Drawer;


	  var src = {
	    Drawer: Drawer$1,
	    createSpray: createCanvasSpray_1
	  };
	  var src_1 = src.Drawer;
	  var src_2 = src.createSpray;

	  exports.default = src;
	  exports.Drawer = src_1;
	  exports.createSpray = src_2;

	  Object.defineProperty(exports, '__esModule', { value: true });

	})));
	});

	unwrapExports(lib$1);

	var options = function(optionDomId, canvas, { drawer, createSpray, resetSpray, autoSprays, triggerRender }) {
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
	      dripper: !!form.drips.checked,
	      dripThreshold: fieldBetween(form.dripThreshold, 0, Infinity),
	      dripSpeed: fieldBetween(form.dripSpeed, 0, Infinity)
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
	    form.drips.addEventListener("change", resetSpray);
	    form.dripThreshold.addEventListener("change", resetSpray);
	    form.dripSpeed.addEventListener("change", resetSpray);
	    form.autoSpraySpeed.addEventListener("change", function() {
	      autoSpraySpeed = parseInt(form.autoSpraySpeed.value);
	    });

	    document.getElementById("clearCanvas").addEventListener("click", function() {
	      resetSpray();
	      [].forEach.call(autoSprays, function(autoSpray) {
	        autoSpray.spray.stopDrips();
	        autoSpray.spray.resetDrips();
	      });
	      drawer.clear();
	    });

	    document.getElementById("autoSprayStop").addEventListener("click", function() {
	      [].forEach.call(autoSprays, function(autoSpray) {
	        autoSpray.spray.stopDrips();
	      });
	      autoSprays.splice(0);
	    });

	    document.getElementById("randomColor").addEventListener("click", function() {
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
	        autoSprayCoords.x = autoSprayCoords.x + Math.round(Math.random() * Math.max(0, speed));
	        autoSprayCoords.y = Math.max(
	          0,
	          Math.min(canvas.height - 1, autoSprayCoords.y + Math.floor(Math.random() * 3) - 1)
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

	const Spray = lib.Spray;
	const Drawer = lib$1.Drawer;
	// const Drawer = require("dripping-spray-pixijs").Drawer;

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

	let options$1 = options("options", canvas, {
	  drawer,
	  createSpray,
	  resetSpray,
	  autoSprays,
	  triggerRender
	});

	window.addEventListener("resize", resize);
	resize();

	canvas.addEventListener("pointerdown", startEventCanvas);
	canvas.addEventListener("pointermove", moveEventCanvas);

	document.addEventListener("pointerup", stopSpraying);

	options$1.setupOptions();
	options$1.setupForm();

	resetSpray();

	// Functions
	function resetSpray() {
	  spray = createSpray();
	}

	function createSpray() {
	  const opts = options$1.getOptions();

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
	  canvas.height = document.getElementById("spray1").offsetHeight;
	  canvas.width = window.innerWidth;
	}

	var demo = {

	};

	return demo;

}));
