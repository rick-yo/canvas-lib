import { CANVAS_RERENDER_EVENT_TYPE } from './Canvas'
import Shape, { ShapeAttrs, applyShapeAttrsToContext } from './Shape'
import { pxByPixelRatio, SHAPE_TYPE } from './utils'

export interface GroupAttrs extends ShapeAttrs {}
/**
 * Group is another container for shape. like Canvas, Group `add` or `remove` a shape
 * But Group need to be added to Canvas to get it and it's shapes renddered,
 * Group mix it's attr and shape's attr to render a shape.
 *
 * @export
 * @class Group
 * @extends {Shape<GroupAttrs>}
 */
export default class Group extends Shape {
  type = SHAPE_TYPE.group
  children: (Shape | Group)[] = []
  constructor(attrs: GroupAttrs) {
    super(attrs)
  }
  /**
   * Add a shape to group
   *
   * @param {Shape} shape
   * @memberof Group
   */
  add(shape: Shape) {
    this.children.push(shape)
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this)
  }
  /**
   * Remove a shape from group
   *
   * @param {Shape} shape
   * @memberof Group
   */
  remove(shape: Shape) {
    const index = this.children.indexOf(shape)
    if (index > -1) {
      this.children.splice(index, 1)
    }
    shape.parent = null
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this)
  }
  /**
   * overwrite shape.render, will render all Group.shapes, it apply group and shape's attr to context
   * `render` will set shape.group to this group and shape.canvas to this.group.canvas
   *
   * @param {CanvasRenderingContext2D} ctx
   * @memberof Group
   */
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, ...rest } = this.attrs()
    const hitCanvas = this.canvas && this.canvas.hitCanvas
    this.children.forEach(shape => {
      ctx.save()
      // rerender canvas
      hitCanvas && hitCanvas.add(shape)
      shape.parent = this
      shape.canvas = this.canvas
      ctx.transform(1, 0, 0, 1, x, y)
      // group内shape的实际样式 = assign(group.attr, shape.attr)
      applyShapeAttrsToContext(ctx, shape.attrs())
      shape.render(ctx)
      ctx.restore()
    })
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D) {
    const { x, y, ...rest } = this.attrs()
    this.children.forEach(shape => {
      ctx.save()
      // group内shape的实际样式 = assign(group.attr, shape.attr)
      ctx.transform(1, 0, 0, 1, x, y)
      applyShapeAttrsToContext(ctx, shape.attrs())
      shape.renderHit(ctx)
      ctx.restore()
    })
  }
}
