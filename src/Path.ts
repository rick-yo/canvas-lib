import Shape, { ShapeAttrs } from './Shape';

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
  type = 'path';
  /**
   * Creates an instance of Image shape.
   * @param {ImageAttrs} attrs
   * @memberof Image
   */
  constructor(attrs: ImageAttrs) {
    super(attrs);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { path } = this.attrs();
    const path2d = new Path2D(path)
    ctx.stroke(path2d)
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D) {
    if (!this.path) return
    ctx.stroke(this.path)
  }
}
