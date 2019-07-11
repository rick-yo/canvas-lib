import { Class } from './utils'
import Shape from './Shape'

class ShapeContainer {
  private shapes: Shape[] = []
  getShapes() {
    return this.shapes
  }
  add(shape: Shape) {
    if (!(shape instanceof Shape)) return
    this.shapes.push(shape)
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape)
    if (index > -1) {
      this.shapes[index].group = null
      this.shapes.splice(index, 1)
    }
  }
  removeAll() {
    this.shapes = []
  }
}

export default ShapeContainer
