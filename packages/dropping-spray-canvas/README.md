# Dropping Spray Canvas Drawer

This module draws shapes from the `dropping-spray` module on a provided canvas. It also provides a function to create
the complete spray and do all the plumbing if you just want to let users draw on a canvas element.

For more information about how to use the `dropping-spray`, please refer to the full readme in the 
[main code repository](https://github.com/Narigo/dropping-spray).

## `createSpray(canvasId: CanvasDOMElement, options: SprayOptions): { destroy: Function, reset: Function }`

When you are done letting the user spray, use the `destroy()` method on the returned object. This way it will remove 
all listeners and fixes those memory leaks.

If you call the `reset()` function on the returned object, it will create a new spray, essentially resetting all 
information about drops. Most probably you won't need this function.
