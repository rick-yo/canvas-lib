import inRange from 'lodash/inRange';
import Shape, { ShapeAttrs } from './Shape';

export interface ArcAttrs extends ShapeAttrs {
  radius: number;
  startAngle?: number;
  endAngle?: number;
  anticlockwise?: boolean | undefined;
}

const PI2 = Math.PI * 2;
export default class Arc extends Shape<ArcAttrs> {
  type = 'arc';
  path = new Path2D();
  constructor(attrs: ArcAttrs) {
    super(attrs);
  }
  makeArcPath(ctx: CanvasRenderingContext2D) {
    const {
      x,
      y,
      startAngle = 0,
      endAngle = PI2,
      anticlockwise = false,
      radius,
    } = this.attrs;
    this.path = new Path2D();
    this.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    this.path.closePath();
  }
  render(ctx: CanvasRenderingContext2D) {
    const { strokeStyle, fillStyle } = this.attrs;
    this.makeArcPath(ctx);
    if (strokeStyle) {
      ctx.stroke(this.path);
    }
    if (fillStyle) {
      ctx.fill(this.path);
    }
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    return ctx.isPointInPath(this.path, px, py);
  }
}
