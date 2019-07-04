import Shape, { ShapeProps } from './Shape';
import inRange from 'lodash/inRange';

export interface LineProps extends ShapeProps {
  x1: number;
  y1: number;
}

export default class Line extends Shape<LineProps> {
  type = 'line';
  path = new Path2D();
  constructor(props: LineProps) {
    super(props);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, x1, y1, lineWidth } = this.props;
    this.path.moveTo(x, y);
    this.path.lineTo(x1, y1);
    ctx.stroke(this.path);
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    return ctx.isPointInPath(this.path, px, py);
  }
}
