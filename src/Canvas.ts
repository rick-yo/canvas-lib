import Shape, { applyShapeAttrsToContext, MousePosition } from './Shape';
import EventEmitter from './EventEmitter';
import { pxByRatio, pixelRatio, Mutable } from './utils';

export const CANVAS_RERENDER_EVENT_TYPE = 'canvas:rerender';

type MouseEventType =
  // | 'auxclick'
  | 'click'
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
  // 'auxclick',
  'click',
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
 * Canvas is shape's container, it can `add` or `remove` shape,
 * when you add a shape, canvas apply shape's attrs to current context, and render the shape to canvas
 * Canvas delegate event like click, mousemove, and dispatch event to the right shape
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
    this._setupCanvas();
    this._initMouseEvents();
    this._initCanvasRerenderEvent();
  }
  add(shape: Shape) {
    this.shapes.push(shape);
    shape.canvas = this;
    this.ctx.save();
    applyShapeAttrsToContext(this.ctx, shape.attrs);
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
      applyShapeAttrsToContext(this.ctx, shape.attrs);
      shape.render(this.ctx);
      this.ctx.restore();
    });
  };
  private _setupCanvas = () => {
    this.canvasElement.style.width = `${this.canvasElement.width}px`;
    this.canvasElement.style.height = `${this.canvasElement.height}px`;
    this.canvasElement.width = pxByRatio(this.canvasElement.width);
    this.canvasElement.height = pxByRatio(this.canvasElement.height);
    this.ctx.scale(pixelRatio, pixelRatio);
  };
  private _initCanvasRerenderEvent = () => {
    this.on(CANVAS_RERENDER_EVENT_TYPE, this.render);
  };
  private _initMouseEvents() {
    if (!this.ctx.canvas) return;
    MOUSE_EVENTS.forEach(key => {
      this.ctx.canvas.addEventListener<MouseEventType>(
        key,
        this._emitShapeEvents,
      );
    });
  }
  private _emitShapeEvents = (e: MouseEvent) => {
    const { offsetX, offsetY, type } = e;
    const position: MousePosition = {
      offsetX: pxByRatio(offsetX),
      offsetY: pxByRatio(offsetY),
      type,
    };
    const len = this.shapes.length;
    // 从后往前遍历，找到 "z-index" 最大的
    for (let index = len - 1; index >= 0; index--) {
      const shape = this.shapes[index];
      if (shape.isPointInShape(this.ctx, position)) {
        shape.emit(e.type, e, shape);
        break;
      }
    }
  };
}
