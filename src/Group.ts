import { CANVAS_RERENDER_EVENT_TYPE } from './Canvas';
import Shape, {
  ShapeAttrs,
  applyShapeAttrsToContext,
  MousePosition,
} from './Shape';

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
export default class Group<D = any> extends Shape<GroupAttrs, D> {
  type = 'group';
  shapes: Shape[] = [];
  constructor(attrs: GroupAttrs) {
    super(attrs);
  }
  add(shape: Shape) {
    this.shapes.push(shape);
    shape.parent = this;
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this);
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes[index].parent = null;
      this.shapes.splice(index, 1);
    }
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, ...rest } = this.attrs;
    this.shapes.forEach(shape => {
      ctx.save();
      // 会影响 `isPointInShape` 方法
      // ctx.translate(x, y);
      // 特殊处理，group内shape实际坐标 = group.x + shape.x，所以要将坐标轴移动
      // 同样group内shape的实际样式 = assign(group.attr, shape.attr)
      applyShapeAttrsToContext(ctx, rest, shape.attrs);
      shape.render(ctx);
      ctx.restore();
    });
  }
  // 特殊处理 group 会再次分发事件
  isPointInShape(ctx: CanvasRenderingContext2D, e: MousePosition) {
    const len = this.shapes.length;
    for (let index = len - 1; index >= 0; index--) {
      const shape = this.shapes[index];
      if (shape.isPointInShape(ctx, e)) {
        shape.emit(e.type, e, shape);
        break;
      }
    }
    return false;
  }
}
