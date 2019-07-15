import Shape, { ShapeAttrs, MousePosition } from './Shape';
import inRange from 'lodash/inRange';

export interface ImageAttrs extends ShapeAttrs {
  path: string;
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
    const { width, height, path } = this.attrs();
    const path2d = new Path2D(path)
    ctx.stroke(path2d)
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.strokeStyle = this.color
    if (!this.path) return
    ctx.stroke(this.path)
  }
}
