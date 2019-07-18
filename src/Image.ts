import Shape, { ShapeAttrs } from './Shape';

export interface ImageAttrs extends ShapeAttrs {
  image: CanvasImageSource;
  width: number;
  height: number;
}
/**
 *
 * @export
 * @class Image
 * @extends {Shape<ImageAttrs>}
 */
export default class Image extends Shape<ImageAttrs> {
  type = 'image';
  /**
   * Creates an instance of Image shape.
   * @param {ImageAttrs} attrs
   * @memberof Image
   */
  constructor(attrs: ImageAttrs) {
    super(attrs);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { width, height, image, x, y } = this.attrs();
    ctx.drawImage(image, x, y, width, height);
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D) {
    const { width, height, image, x, y } = this.attrs();
    ctx.fillStyle = this.color
    ctx.fillRect(x, y, width, height);
  }
}
