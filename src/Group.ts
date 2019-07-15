import { CANVAS_RERENDER_EVENT_TYPE } from './Canvas'
import Shape, {
  ShapeAttrs,
  applyShapeAttrsToContext,
  MousePosition,
} from './Shape'
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
  children: Shape[] = []
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
      this.children[index].group = null
      this.children.splice(index, 1)
    }
    shape.canvas = null
    shape.group = null
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this)
  }
}
