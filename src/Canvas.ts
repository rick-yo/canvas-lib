import Shape, { applyCanvasStyleToContext } from './Shape';

interface StageProps {}

export default class Canvas {
  ctx: CanvasRenderingContext2D;
  shapes: Shape[] = [];
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this._initEvents();
  }
  add(shape: Shape) {
    this.shapes = this.shapes.concat(shape.getInstance());
    this.ctx.save();
    applyCanvasStyleToContext(this.ctx, shape.props);
    shape.render(this.ctx);
    this.ctx.restore();
  }
  remove(shape: Shape) {
    const index = this.shapes.indexOf(shape);
    if (index > -1) {
      this.shapes.splice(index, 1);
    }
  }
  clear() {
    this.shapes = [];
    this.clearCanvas();
  }
  clearCanvas() {
    const canvas = this.ctx.canvas;
    if (!canvas) return;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  render() {
    this.clearCanvas();
    this.shapes.forEach(shape => {
      this.ctx.save();
      applyCanvasStyleToContext(this.ctx, shape.props);
      shape.render(this.ctx);
      this.ctx.restore();
    });
  }
  _initEvents() {
    if (!this.ctx.canvas) return;
    this.ctx.canvas.addEventListener('click', this._emitShapeEvents);
    this.ctx.canvas.addEventListener('contextmenu', this._emitShapeEvents);
  }
  _emitShapeEvents = (e: MouseEvent) => {
    const { offsetX, offsetY } = e;
    const shape = this.shapes.reverse().find(item => {
      return item.isPointInShape(this.ctx, offsetX, offsetY);
    });
    if (shape) {
      shape.emit(e.type, shape.props);
    }
  };
}
