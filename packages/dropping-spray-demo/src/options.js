module.exports = function (optionDomId, canvas, drawer, createSpray, resetSpray, autoSprays, triggerRender) {

  var form = document.getElementById(optionDomId);

  function getOptions() {
    var r = fieldBetween(form.red, 0, 255);
    var g = fieldBetween(form.green, 0, 255);
    var b = fieldBetween(form.blue, 0, 255);

    return {
      color : {
        r : r,
        g : g,
        b : b
      },
      canvas : canvas,
      size : fieldBetween(form.size, 1, Math.min(canvas.height, canvas.width)),
      splatterAmount : fieldBetween(form.splatterAmount, 0, Infinity),
      splatterRadius : fieldBetween(form.splatterRadius, 0, Infinity),
      dropper : !!form.drops.checked,
      dropThreshold : fieldBetween(form.dropThreshold, 0, Infinity),
      dropSpeed : fieldBetween(form.dropSpeed, 0, Infinity)
    };

    function fieldBetween(field, min, max) {
      var value = Math.max(min, Math.min(max, parseInt(field.value)));
      field.value = value;
      return value;
    }
  }

  function setupOptions() {

    var hider = document.getElementById('options-hider');
    var options = document.getElementById('options-content');

    hider.addEventListener('click', toggleOptions);

    var isHidden = true;

    function toggleOptions() {
      isHidden = !isHidden;
      if (isHidden) {
        options.style.display = 'none';
        hider.innerHTML = 'Open options';
        hider.classList.add('open');
      } else {
        options.style.display = 'block';
        hider.innerHTML = 'close';
        hider.classList.remove('open');
      }
    }

  }

  function setupForm() {
    var autoSpraySpeed = parseInt(form.autoSpraySpeed.value);

    form.red.addEventListener('change', resetSpray);
    form.green.addEventListener('change', resetSpray);
    form.blue.addEventListener('change', resetSpray);
    form.size.addEventListener('change', resetSpray);
    form.splatterAmount.addEventListener('change', resetSpray);
    form.splatterRadius.addEventListener('change', resetSpray);
    form.drops.addEventListener('change', resetSpray);
    form.dropThreshold.addEventListener('change', resetSpray);
    form.dropSpeed.addEventListener('change', resetSpray);
    form.autoSpraySpeed.addEventListener('change', function () {
      autoSpraySpeed = parseInt(form.autoSpraySpeed.value);
    });

    document.getElementById('clearCanvas').addEventListener('click', function () {
      resetSpray();
      [].forEach.call(autoSprays, function (autoSpray) {
        autoSpray.spray.stopDrops();
        autoSpray.spray.resetDrops();
      });
      drawer.clear();
    });

    document.getElementById('autoSprayStop').addEventListener('click', function () {
      [].forEach.call(autoSprays, function (autoSpray) {
        autoSpray.spray.stopDrops();
      });
      autoSprays = [];
    });

    document.getElementById('randomColor').addEventListener('click', function () {
      randomizeColor();
      resetSpray();
    });

    document.getElementById('autoSpray').addEventListener('click', function () {
      var speed = autoSpraySpeed;
      var autoSprayCoords = {
        x : 0,
        y : Math.floor(Math.random() * canvas.height)
      };
      var autoSpray = {
        draw : sprayFromLeftToRight,
        spray : createSpray()
      };
      autoSprays.push(autoSpray);
      triggerRender();

      function sprayFromLeftToRight(drawer) {
        autoSprayCoords.x = autoSprayCoords.x + Math.round(Math.random() * Math.max(0, speed));
        autoSprayCoords.y =
          Math.max(0, Math.min(canvas.height - 1, (autoSprayCoords.y + Math.floor(Math.random() * 3) - 1)));
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
    getOptions : getOptions,
    setupOptions : setupOptions,
    setupForm : setupForm
  };
};
