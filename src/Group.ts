import { CanvasStyles, CanvasStylesKeys, ShapePositionMatrix } from './types'
import Shape, { ShapeAttrs, canvasStylesMap } from './Shape'
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
    shape.parent = this
    shape.canvas = this.canvas
    this.children.push(shape)
    this._emitCanvasRerender()
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
    shape.canvas = null
    this._emitCanvasRerender()
  }
  /**
   * overwrite shape.render, will render all Group.shapes, it apply group and shape's attr to context
   * `render` will set shape.group to this group and shape.canvas to this.group.canvas
   *
   * @param {CanvasRenderingContext2D} ctx
   * @memberof Group
   */
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, transform, ...rest } = this.attrs()
    const hitCanvas = this.canvas && this.canvas.hitCanvas
    hitCanvas && hitCanvas.add(this)
    ctx.save()
    applyShapeTransformToContext(ctx, {
      x,
      y,
      transform,
    })
    applyShapeStyleToContext(ctx, rest)
    this.children.forEach(shape => {
      shape.canvas = this.canvas
      ctx.save()
      hitCanvas && hitCanvas.add(shape)
      // group.attr = assign(group.attr, shape.attr)
      applyShapeStyleToContext(ctx, shape.attrs())
      shape.render(ctx)
      ctx.restore()
    })
    ctx.restore()
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D) {
    const { x, y, transform, ...rest } = this.attrs()
    ctx.save()
    applyShapeTransformToContext(ctx, {
      x,
      y,
      transform,
    })
    applyShapeStyleToContext(ctx, rest)
    this.children.forEach(shape => {
      ctx.save()
      // special case for hitCanvas
      applyHitStyleToContext(ctx, shape)
      shape.renderHit(ctx)
      ctx.restore()
    })
    ctx.restore()
  }
}

function applyShapeStyleToContext(
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  styles: CanvasStyles,
) {
  for (const key in styles) {
    if (styles.hasOwnProperty(key) && canvasStylesMap[key]) {
      // @ts-ignore
      ctx[key] = styles[key as CanvasStylesKeys]
    }
  }
}

// only transform in group to affect group's shapes position
function applyShapeTransformToContext(
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  matrix: ShapePositionMatrix,
) {
  const { x = 0, y = 0, transform = [1, 0, 0, 1, 0, 0] } = matrix

  const a = transform[0]
  const b = transform[1]
  const c = transform[2]
  const d = transform[3]
  const e = x + transform[4]
  const f = y + transform[5]
  // use `transform` to multiply current matrix to avoid reset canvas pixelRatio
  ctx.transform(a, b, c, d, e, f)
}

function applyHitStyleToContext(
  ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D,
  shape: Shape,
) {
  // apply special draw context to hitCanvas
  ctx.globalAlpha = 1
  ctx.fillStyle = shape.color
  ctx.strokeStyle = shape.color
}
