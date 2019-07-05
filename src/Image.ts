import Shape, { ShapeAttrs } from './Shape';
import inRange from 'lodash/inRange';

export interface ImageAttrs extends ShapeAttrs {
  image: CanvasImageSource;
  width: number;
  height: number;
}

export default class Image extends Shape<ImageAttrs> {
  type = 'image';
  constructor(attrs: ImageAttrs) {
    super(attrs);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height, image } = this.attrs;
    ctx.drawImage(image, x, y, width, height);
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    const { x, y, width, height, image } = this.attrs;
    return inRange(px, x, x + width) && inRange(py, y, y + height);
  }
}
