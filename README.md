# Dripping spray

![Example picture of the spray in action](./example.png)

Monorepo for simulating a real spray can that creates drips when used on the same spot for a bit.

## Usage examples

There are multiple ways to use the spray. You can ...

1.  use the `dripping-spray` module and receive shape data for you to draw it how you like or
2.  use a `dripping-spray-*` drawer module.

If you want to draw on a canvas-DOM element, use the [dripping-spray-canvas](./packages/dripping-spray-canvas) module.
It will help you set up the spray and canvas. Same for [dripping-spray-pixijs](./packages/dripping-spray-pixijs) which
uses PixiJS to draw on a canvas instead of a pure implementation.

If you want to draw on something different (for example write out SVGs or similar), you can create your own `Drawer`
with the underlying [dripping-spray](./packages/dripping-spray) module and let it generate abstract shapes for you that
you can draw.

### Using a provided `createSpray()` method

The `dripping-spray-*` modules usually provide a `createSpray()` method to simplify drawing, using the animation frame,
etc. Please have a look in their documentation if such a short-cut exists. You can also see the guide below how to use
a `shapeDrawer` and have more control about when and how to animate the spray.

### Using the generic `Spray`

First of all, you need to decide what the spray should look like. There are a few customization options that you can
provide. Below you can see the default options, which will be set if you don't provide an object or leave out fields
inside of it:

```javascript
const Spray = require('./spray.js');
const options = {}; // You can customize the spray by providing [options](#customizing-spray-options)
const spray = new Spray(options);
```

For the spray to know where to draw to, you need to select a drawer. With a drawer, the spray is able to draw on
whatever surface the drawer provides.

In our example case, we use the `CanvasDrawer` from [dripping-spray-canvas](./packages/dripping-spray-canvas) to draw
shapes on a canvas DOM element.

```javascript
const CanvasDrawer = require('./canvas_drawer.js');
const shapeDrawer = new CanvasDrawer(document.getElementById('myCanvas'));
```

To be able to optimize our `requestAnimationFrame` calls, you need to call the `draw` method of the spray inside of it
and tell it whether it needs to draw at a specific coordinate or should draw just because there might still be drips
left. The `draw` method will tell us, whether the spray has some drips left to render.

A typical `requestAnimationFrame` could look like this:

```
let spraying = true; // sprays at a specific coordinate (see render() method)
let currentCoords = { x : 0, y : 0 }; // the coordinates where to draw, if spraying

function render() {
  let stillDrawing = false;
  if (spraying) {
    stillDrawing = spray.draw(shapeDrawer, currentCoords);
  } else {
    stillDrawing = spray.draw(shapeDrawer); // it still might have to draw for another frame if there are running drips
  }

  if (stillDrawing) {
    requestAnimationFrame(render);
  }
}
```

### Customizing spray options

You can customize most of how the spray works by changing the `options` parameter and provide them to the spray as 
mentioned in the usage examples. Here are the default values which will be set if you do not provide a field in your
`options` object.

```javascript
{
  color : {            // the color of the spray
    r : 0,             // red
    g : 0,             // green
    b : 255            // blue
  },

  size : 5,            // the size of the center circle that will always be filled

  splatterAmount : 10, // the amount of circles it draws in each step (usually during `requestAnimationFrame`)

  splatterRadius : 20, // the radius of the spray

  dripper : true,      // whether the spray drips (`true`) or not (`false`)

  dripThreshold : 50,  // when the spray should start to drip - it accumulates the amount of spray inside of the size
                       // and starts to drip when it reaches the threshold. Think of `dripThreshould / size` is the
                       // amount of `requestAnimationFrame`-calls the spray would need to start dripping.

  dripSpeed : 3        // how fast the drips should flow as soon as they started
}
```

### Full example

```javascript
const CanvasDrawer = require('dripping-spray-canvas');
const Spray = require('dripping-spray');
const spray = new Spray();
const shapeDrawer = new CanvasDrawer(document.getElementById('myCanvas'));

let myX, myY, spraying; // Saves state for coordinates and if spraying

document.addEventListener('mousedown', startSpraying);
document.addEventListener('mousemove', updateCoords);
document.addEventListener('mouseup', stopSpraying);

function startSpraying() {
  spraying = true;
  render();
}

function updateCoords(e) {
  myX = e.pageX;
  myY = e.pageY;
}

function stopSpraying() {
  spraying = false;
}

function render() {
  let stillDrawing = false;
  if (spraying) {
    stillDrawing = spray.draw(shapeDrawer, { x : myX, y: myY });
  } else {
    stillDrawing = spray.draw(shapeDrawer); // for drips only
  }

  if (stillDrawing) {
    requestAnimationFrame(render);
  }
}

requestAnimationFrame(render);
```

## Contributing / building

The main commands to use:

1. `npx lerna clean` - removes all `node_modules` and unlinks whatever is linked
2. `npx lerna bootstrap` - installs all `node_modules` and links the packages
3. `npx lerna run build` - builds all packages
4. `npx lerna run test` - tests all packages
5. `npx lerna exec "npm outdated"` - runs `npm outdated` in all packages to find outdated packages for possible updates
6. `npx lerna exec "npx updtr"` - updates all packages
