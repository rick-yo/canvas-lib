import Shape, { applyShapeAttrsToContext, MousePosition } from './Shape';
import EventEmitter from './EventEmitter';
import { pxByRatio, pixelRatio, Mutable, raiseError } from './utils';
import containerMixin from './containerMixin';

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
 * Canvas delegate events like click, mousemove, and dispatch event to the right shape
 *
 * @export
 * @class Canvas
 */
export default class Canvas extends containerMixin(EventEmitter) {
  ctx: CanvasRenderingContext2D;
  shapes: Shape[] = [];
  canvasElement: HTMLCanvasElement;
  width: number = 0;
  height: number = 0;
  constructor(
    canvas: HTMLCanvasElement,
    options: {
      width: number;
      height: number;
    },
  ) {
    super();
    if (!canvas) {
      raiseError('canvas not found');
    }
    this.canvasElement = canvas;
    const ctx = this.canvasElement.getContext('2d');
    if (!ctx) {
      throw new Error('canvas context not found');
    }
    this.ctx = ctx;
    this.width = options.width;
    this.height = options.height;
    this._setupCanvas();
    this._initMouseEvents();
    this._initCanvasRerenderEvent();
  }
  /**
   * Add a shape to Canvas and render
   *
   * @param {Shape} shape
   * @memberof Canvas
   */
  add(shape: Shape) {
    super.add(shape)
    this._renderShape(shape)
  }
  /**
   * Remove a shape from Canvas
   *
   * @param {Shape} shape
   * @memberof Canvas
   */
  remove(shape: Shape) {
    super.remove(shape)
    shape.canvas = null
    this._render();
  }
  /**
   * Remove all shapes from Canvas
   *
   * @memberof Canvas
   */
  clear() {
    this.shapes.forEach(shape => shape.canvas = null)
    super.removeAll()
    this.clearCanvas();
  }
  /**
   * Clear Canvas
   *
   * @returns
   * @memberof Canvas
   */
  clearCanvas() {
    const canvas = this.canvasElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  private _render = () => {
    this.clearCanvas();
    this.shapes.forEach(shape => {
      this._renderShape(shape)
    });
  };
  _renderShape = (shape: Shape) => {
    this.ctx.save();
    shape.canvas = this;
    applyShapeAttrsToContext(this.ctx, shape.attrs);
    shape.render(this.ctx);
    this.ctx.restore();
  }
  private _setupCanvas = () => {
    this.canvasElement.style.width = `${this.width}px`;
    this.canvasElement.style.height = `${this.height}px`;
    this.canvasElement.width = pxByRatio(this.width);
    this.canvasElement.height = pxByRatio(this.height);
    this.ctx.scale(pixelRatio, pixelRatio);
  };
  private _initCanvasRerenderEvent = () => {
    this.on(CANVAS_RERENDER_EVENT_TYPE, this._render);
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
      if (!shape) continue;
      if (shape.isPointInShape(this.ctx, position)) {
        shape.emit(type, e, shape);
        break;
      }
    }
  };
}
