import inRange from 'lodash/inRange';
import Shape, { ShapeAttrs } from './Shape';

export interface PolygonAttrs extends ShapeAttrs {
  radius: number;
  sides: number;
  anticlockwise?: boolean;
}

export default class Polygon extends Shape<PolygonAttrs> {
  type = 'polygon';
  path = new Path2D();
  constructor(attrs: PolygonAttrs) {
    super(attrs);
  }
  makePolygonPath = () => {
    const {
      sides,
    } = this.attrs;
    this.path = new Path2D();
    for (let index = 0; index < sides; index++) {
      const angle = ((Math.PI * 2) / sides) * index;
      const point = this._getPolygonPoint(angle);
      this.path.lineTo(...point);
    }
    this.path.closePath();
  };
  _getPolygonPoint = (angle: number): [number, number] => {
    const { x, y, radius, sides } = this.attrs;
    const px = Math.sin(angle) * radius + x;
    const py = y - Math.cos(angle) * radius;
    return [px, py];
  };
  render(ctx: CanvasRenderingContext2D) {
    const { strokeStyle, fillStyle } = this.attrs;
    this.makePolygonPath();
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
