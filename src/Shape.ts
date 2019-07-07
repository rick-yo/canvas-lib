import EventEmitter from './EventEmitter';
import Canvas, { CANVAS_RERENDER_EVENT_TYPE } from './Canvas';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';

export interface CanvasStyles
  extends Partial<CanvasCompositing>,
    Partial<CanvasFilters>,
    Partial<CanvasShadowStyles>,
    Partial<CanvasTextDrawingStyles> {
  // CanvasFillStrokeStyles
  fillStyle?: CanvasFillStrokeStyles['fillStyle'];
  strokeStyle?: CanvasFillStrokeStyles['strokeStyle'];
  // CanvasPathDrawingStyles
  lineCap?: CanvasPathDrawingStyles['lineCap'];
  lineDashOffset?: CanvasPathDrawingStyles['lineDashOffset'];
  lineJoin?: CanvasPathDrawingStyles['lineJoin'];
  lineWidth?: CanvasPathDrawingStyles['lineWidth'];
  miterLimit?: CanvasPathDrawingStyles['miterLimit'];
  // 自定义样式
  rotate?: number;
  translate?: [number, number];
}

export type CanvasStylesKeys = keyof CanvasStyles;

export const canvasStylesMap: Dictionary<boolean> = {
  fillStyle: true,
  strokeStyle: true,
  lineCap: true,
  lineDashOffset: true,
  lineJoin: true,
  lineWidth: true,
  miterLimit: true,
  filter: true,
  globalAlpha: true,
  globalCompositeOperation: true,
  shadowBlur: true,
  shadowColor: true,
  shadowOffsetX: true,
  shadowOffsetY: true,
  direction: true,
  font: true,
  textAlign: true,
  textBaseline: true,
};

export interface ShapeAttrs extends CanvasStyles {
  x: number;
  y: number;
}
/**
 * basic shape class for rect circle path...
 * Shape extends eventEmitter to store and fire events
 * Shape store attrs and provide `render` method to draw the shape.
 * you can `set` shape's attrs and it will rerender it automatically
 *
 * @export
 * @abstract
 * @class Shape
 * @extends {EventEmitter}
 */
export default abstract class Shape<
  P extends CanvasStyles = CanvasStyles
> extends EventEmitter {
  type = 'shape';
  attrs: ShapeAttrs & P;
  canvas: Canvas | null = null;
  constructor(attrs: ShapeAttrs & P) {
    super();
    this.attrs = attrs;
  }
  render(ctx: CanvasRenderingContext2D): void {
    throw new Error('render method not implemented');
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    throw new Error('isPointInShape method not implemented');
  }
  set = (key: CanvasStylesKeys, value: any) => {
    this.attrs[key] = value;
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this);
  };
  fillOrStroke(ctx: CanvasRenderingContext2D, path?: Path2D) {
    const { strokeStyle, fillStyle } = this.attrs;
    if (strokeStyle) {
      path ? ctx.stroke(path) : ctx.stroke();
    }
    if (fillStyle) {
      path ? ctx.fill(path) : ctx.fill();
    }
  }
}

export function applyCanvasStyleToContext(
  ctx: CanvasRenderingContext2D,
  ..._attrs: Partial<ShapeAttrs>[]
) {
  const attrs = <ShapeAttrs>assign({}, ..._attrs.map(cloneDeep));
  const { rotate, translate, x, y } = attrs;
  for (const key in attrs) {
    if (attrs.hasOwnProperty(key) && canvasStylesMap[key]) {
      // @ts-ignore
      ctx[key] = attrs[key];
    }
  }
  if (rotate) {
    // ctx.translate(x, y)
    ctx.rotate(rotate);
  }
  if (translate) ctx.translate(...translate);
}
