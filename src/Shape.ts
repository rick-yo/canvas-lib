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
  // transform
  rotate?: Parameters<CanvasTransform['rotate']>[0];
  translate?: Parameters<CanvasTransform['translate']>;
  scale?: Parameters<CanvasTransform['scale']>;
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
type ShapeAttrsKeys = keyof ShapeAttrs;
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
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number): boolean {
    throw new Error('isPointInShape method not implemented');
  }
  set = (key: ShapeAttrsKeys, value: unknown) => {
    assign(this.attrs, { key: value });
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
  const { rotate, translate, scale, x, y, ...rest } = attrs;
  for (const key in rest) {
    if (rest.hasOwnProperty(key) && canvasStylesMap[key]) {
      // @ts-ignore
      ctx[key] = rest[key];
    }
  }
  if (translate) {
    ctx.translate(...translate);
  }
  if (rotate) {
    ctx.rotate(rotate);
  }
  if (scale) {
    ctx.scale(...scale);
  }
}
