import { Class } from './utils';
import Shape from './Shape';

const containerMixin = <T>(Base: Class<any>) => class extends Base {
  shapes: Shape[] = [];
  add(shape: Shape) {
    if (!(shape instanceof Shape)) return;
    this.shapes.push(shape);
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes[index].parent = null;
      this.shapes.splice(index, 1);
    }
  }
  removeAll() {
    this.shapes = [];
  }
}

export default containerMixin