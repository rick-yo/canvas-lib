import EventEmitter from './EventEmitter';
import Canvas from './Canvas';
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
  id?: string;
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
  getShapeInstance(): Shape[] | Shape {
    return this;
  }
  set(stage: Canvas, key: CanvasStylesKeys, value: any) {
    this.attrs[key] = value;
    stage.render();
  }
}

export function applyCanvasStyleToContext(
  ctx: CanvasRenderingContext2D,
  ...attrs: ShapeAttrs[]
) {
  const { rotate, translate, x, y } = <ShapeAttrs>(
    assign({}, ...attrs.map(cloneDeep))
  );
  for (const key in attrs) {
    if (attrs.hasOwnProperty(key) && canvasStylesMap[key]) {
      // @ts-ignore
      ctx[key] = attrs[key as CanvasStylesKeys];
    }
  }
  if (rotate) {
    // ctx.translate(x, y)
    ctx.rotate(rotate);
  }
  if (translate) ctx.translate(...translate);
}
