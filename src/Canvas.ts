import Shape, { applyCanvasStyleToContext } from './Shape';
import EventEmitter from './EventEmitter';

interface StageAttrs {}

export const CANVAS_RERENDER_EVENT_TYPE = 'canvas:rerender';

type MouseEventType =
  | 'click'
  | 'auxclick'
  | 'contextmenu'
  | 'dblclick'
  | 'mousedown'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseout'
  | 'mouseover'
  | 'mouseup';

  const MOUSE_EVENTS: MouseEventType[] = [
  'click',
  'auxclick',
  'contextmenu',
  'dblclick',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
];

/**
 * canvas is shape's container, it can `add` or `remove` shape,
 * when you add a shape, canvas apply shape's attrs to current context, and render the shape
 * canvas delegate event like click, mousemove, and dispatch event to the right shape
 *
 * @export
 * @class Canvas
 */
export default class Canvas extends EventEmitter {
  ctx: CanvasRenderingContext2D;
  shapes: Shape[] = [];
  canvasElement: HTMLCanvasElement;
  constructor(ctx: CanvasRenderingContext2D) {
    super();
    this.ctx = ctx;
    this.canvasElement = this.ctx.canvas;
    this._initMouseEvents();
    this._initCanvasRerenderEvent();
  }
  private _initCanvasRerenderEvent = () => {
    this.on(CANVAS_RERENDER_EVENT_TYPE, this.render);
  };
  add(shape: Shape) {
    this.shapes.push(shape);
    shape.canvas = this;
    this.ctx.save();
    applyCanvasStyleToContext(this.ctx, shape.attrs);
    shape.render(this.ctx);
    this.ctx.restore();
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes.splice(index, 1);
    }
    this.render();
  }
  clear() {
    this.shapes = [];
    this.clearCanvas();
  }
  clearCanvas() {
    const canvas = this.ctx.canvas;
    if (!canvas) return;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  render = () => {
    this.clearCanvas();
    this.shapes.forEach(shape => {
      this.ctx.save();
      applyCanvasStyleToContext(this.ctx, shape.attrs);
      shape.render(this.ctx);
      this.ctx.restore();
    });
  };
  private _initMouseEvents() {
    if (!this.ctx.canvas) return;
    MOUSE_EVENTS.forEach(key => {
      this.ctx.canvas.addEventListener(key, this._emitShapeEvents);
    });
  }
  private _emitShapeEvents = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    const shape = this.shapes.reverse().find(item => {
      return item.isPointInShape(this.ctx, offsetX, offsetY);
    });
    if (shape) {
      shape.emit(e.type, e, shape);
    }
  };
}
