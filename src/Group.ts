import { CANVAS_RERENDER_EVENT_TYPE } from './Canvas';
import Shape, { ShapeAttrs, applyCanvasStyleToContext } from './Shape';

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
export default class Group extends Shape<GroupAttrs> {
  type = 'group';
  shapes: Shape[] = [];
  constructor(attrs: GroupAttrs) {
    super(attrs);
  }
  add(shape: Shape) {
    this.shapes.push(shape);
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this);
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes.splice(index, 1);
    }
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, ...rest } = this.attrs
    this.shapes.forEach(shape => {
      ctx.save();
      // 特殊处理，group内shape实际坐标 = group.x + shape.x，所以要将坐标轴移动
      // 同样group内shape的实际样式 = assign(group.attr, shape.attr)
      ctx.translate(x, y)
      applyCanvasStyleToContext(ctx, rest, shape.attrs);
      shape.render(ctx);
      ctx.restore();
    });
  }
}
