import inRange from 'lodash/inRange';
import Shape, { ShapeProps } from './Shape';

export interface RectProps extends ShapeProps {
  radius?: number[];
  width: number;
  height: number;
}

export default class Rect extends Shape<RectProps> {
  type = 'rect';
  constructor(props: RectProps) {
    super(props);
  }
  render(ctx: CanvasRenderingContext2D) {
    const {
      x,
      y,
      width,
      height,
      radius = [],
      strokeStyle,
      fillStyle,
    } = this.props;
    const [leftTop = 0, rightTop = 0, rightBottom = 0, leftBottom = 0] = radius;
    const path = new Path2D();
    // 左上角
    if (leftTop) {
      path.moveTo(x, y + leftTop);
      path.arc(x + leftTop, y + leftTop, leftTop, Math.PI, Math.PI * 1.5);
    } else {
      path.moveTo(x, y);
    }
    // border-top
    path.lineTo(x + width - rightTop, y);

    // 右上角
    if (rightTop) {
      path.arc(
        x + width - rightTop,
        y + rightTop,
        rightTop,
        Math.PI * 1.5,
        Math.PI * 2,
      );
    } else {
      path.lineTo(x + width, y);
    }

    // border-right
    path.lineTo(x + width, y + height - rightBottom);

    // 右下角
    if (rightBottom) {
      path.arc(
        x + width - rightBottom,
        y + height - rightBottom,
        rightBottom,
        0,
        Math.PI * 0.5,
      );
    } else {
      path.lineTo(x + width, y + height);
    }

    // border-bottom
    path.lineTo(x - leftBottom, y + height);
    // 左下角
    if (leftBottom) {
      path.arc(
        x + leftBottom,
        y + height - leftBottom,
        leftBottom,
        Math.PI * 0.5,
        Math.PI,
      );
    } else {
      path.lineTo(x, y + height);
    }

    if (strokeStyle) {
      ctx.stroke(path);
    }
    if (fillStyle) {
      ctx.fill(path);
    }
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    const { x, y, width, height } = this.props;
    return inRange(px, x, x + width) && inRange(py, y, y + height);
  }
}
