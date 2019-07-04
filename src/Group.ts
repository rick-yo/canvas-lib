import Shape, { ShapeProps, applyCanvasStyleToContext } from './Shape'

export interface GroupProps extends ShapeProps {
}

export default class Group extends Shape<GroupProps> {
  type = 'group'
  shapes: Shape[] = []
  constructor(props: GroupProps) {
    super(props)
  }
  add(shape: Shape) {
    shape.props.x += this.props.x
    shape.props.y += this.props.y
    this.shapes = this.shapes.concat(shape)
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape)
    if (index > -1) {
      this.shapes.splice(index, 1)
    }
  }
  getInstance() {
    return this.shapes
  }
  render(ctx: CanvasRenderingContext2D) {
    this.shapes.forEach(shape => {
      ctx.save()
      // group 需要特殊处理
      applyCanvasStyleToContext(ctx, shape.props)
      shape.render(ctx)
      ctx.restore()
    })
  }
}
