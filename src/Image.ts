import Shape, { ShapeProps } from './Shape';
import inRange from 'lodash/inRange';

export interface ImageProps extends ShapeProps {
  image: CanvasImageSource;
  width: number;
  height: number;
}

export default class Image extends Shape<ImageProps> {
  type = 'image';
  constructor(props: ImageProps) {
    super(props);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height, image } = this.props;
    ctx.drawImage(image, x, y, width, height);
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    const { x, y, width, height, image } = this.props;
    return inRange(px, x, x + width) && inRange(py, y, y + height);
  }
}
