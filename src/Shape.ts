import EventEmitter from './EventEmitter';
import Canvas from './Canvas';

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

export interface ShapeProps extends CanvasStyles {
  x: number;
  y: number;
  id?: string;
}

export default abstract class Shape<
  P extends CanvasStyles = CanvasStyles
> extends EventEmitter {
  type = 'shape';
  props: ShapeProps & P;
  constructor(props: ShapeProps & P) {
    super();
    this.props = props;
  }
  render(ctx: CanvasRenderingContext2D): void {
    throw new Error('render method not implemented');
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    throw new Error('isPointInShape method not implemented');
  }
  getInstance(): Shape[] | Shape {
    return this;
  }
  set(stage: Canvas, key: CanvasStylesKeys, value: any) {
    this.props[key] = value;
    stage.render();
  }
}

export function applyCanvasStyleToContext(
  ctx: CanvasRenderingContext2D,
  props: ShapeProps,
) {
  const { rotate, translate, x, y } = props;
  for (const key in props) {
    if (props.hasOwnProperty(key) && canvasStylesMap[key]) {
      // @ts-ignore
      ctx[key] = props[key as CanvasStylesKeys];
    }
  }
  if (rotate) {
    // ctx.translate(x, y)
    ctx.rotate(rotate);
  }
  if (translate) ctx.translate(...translate);
}
