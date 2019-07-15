import inRange from 'lodash/inRange';
import Shape, { ShapeAttrs, MousePosition } from './Shape';

export interface ArcAttrs extends ShapeAttrs {
  radius: number;
  startAngle?: number;
  endAngle?: number;
  anticlockwise?: boolean | undefined;
}

const PI2 = Math.PI * 2;
export default class Arc extends Shape<ArcAttrs> {
  type = 'arc';
  /**
   * Creates an instance of Arc shape.
   * @param {ArcAttrs} attrs
   * @memberof Arc
   */
  constructor(attrs: ArcAttrs) {
    super(attrs);
  }
  private makeArcPath(ctx: CanvasRenderingContext2D) {
    const {
      startAngle = 0,
      endAngle = PI2,
      anticlockwise = false,
      radius,
      x,
      y
    } = this.attrs();
    this.path = new Path2D();
    this.path.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    this.path.closePath();
  }
  render(ctx: CanvasRenderingContext2D) {
    this.makeArcPath(ctx);
    if (!this.path) return;
    this.fillOrStroke(ctx, this.path);
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    if (!this.path) return;
    ctx.fill(this.path)
  }
}
