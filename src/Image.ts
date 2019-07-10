import Shape, { ShapeAttrs, MousePosition } from './Shape';
import inRange from 'lodash/inRange';

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
    const { width, height, image } = this.attrs;
    const [x, y] = this._getPositionFromShape();
    ctx.drawImage(image, x, y, width, height);
  }
  isPointInShape(ctx: CanvasRenderingContext2D, e: MousePosition) {
    return this._isPointInShapeContent(e)
  }
}
