# canvas-lib
Canvas library with a delightful API.

# Feature
* support all kinds of shapes, draw with no side-effect
* group shapes support
* event system, drag & drop
* transform, scale and translate canvas coordinate
* support basic animation

# API

[See here](https://luv-sic.github.io/canvas-lib/)

# example
```JavaScript
const canvas = new Canvas(document.querySelector('canvas'));

const rect = new Rect({
  x: 10,
  y: 20,
  width: 100,
  height: 100,
  fillStyle: 'blue',
});

rect.on('click', (e, shape) => {
  console.log('rect being clicked');
});

canvas.add(rect);
```
# Design

* Canvas, shape container, add/remove/draw shape, event delegation and dispatch
* Shape, All concrete shape extends Shape, style、position property and shapes'events stored here
* Group, special Shape container, it stored shape added to it. and change it's property like style and position
