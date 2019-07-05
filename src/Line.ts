import Shape, { ShapeAttrs } from './Shape';
import inRange from 'lodash/inRange';

export interface LineAttrs extends ShapeAttrs {
  x1: number;
  y1: number;
}

export default class Line extends Shape<LineAttrs> {
  type = 'line';
  path = new Path2D();
  constructor(attrs: LineAttrs) {
    super(attrs);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, x1, y1, lineWidth } = this.attrs;
    // renew path so that rerender won't get old path object
    this.path = new Path2D()
    this.path.moveTo(x, y);
    this.path.lineTo(x1, y1);
    ctx.stroke(this.path);
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    return ctx.isPointInPath(this.path, px, py);
  }
}
