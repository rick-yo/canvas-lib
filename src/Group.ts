import Shape, { ShapeAttrs, applyCanvasStyleToContext } from './Shape';

export interface GroupAttrs extends ShapeAttrs {}
/**
 * Group is another container for shape, like canvas, Group `add` or `remove` a shape
 * `Group.render` will apply Group and shape's attrs to canvas context and render Group's stored shape
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
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes.splice(index, 1);
    }
  }
  getShapeInstance() {
    return this.shapes;
  }
  render(ctx: CanvasRenderingContext2D) {
    this.shapes.forEach(shape => {
      ctx.save();
      // group 需要特殊处理
      applyCanvasStyleToContext(ctx, this.attrs, shape.attrs);
      shape.render(ctx);
      ctx.restore();
    });
  }
}
