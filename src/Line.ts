import Shape, { ShapeAttrs, MousePosition } from './Shape'

export interface LineAttrs extends ShapeAttrs {
  x1: number
  y1: number
}

export default class Line extends Shape<LineAttrs> {
  type = 'line'
  /**
   * Creates an instance of Line shape.
   * @param {LineAttrs} attrs
   * @memberof Line
   */
  constructor(attrs: LineAttrs) {
    super(attrs)
  }
  render(ctx: CanvasRenderingContext2D) {
    // renew path so that rerender won't get old path object
    const { x, y, x1, y1 } = this.attrs()
    this.path = new Path2D()
    this.path.moveTo(x, y)
    this.path.lineTo(x1, y1)
    this.path.closePath()
    this.fillOrStroke(ctx, this.path)
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.fillStyle = this.color
    if (!this.path) return
    ctx.fill(this.path)
  }
}
