import Shape, { applyShapeAttrsToContext, MousePosition } from './Shape'
import EventEmitter from './EventEmitter'
import { pxByPixelRatio, pixelRatio, Mutable, raiseError } from './utils'
import containerMixin from './ShapeContainer'
import ShapeContainer from './ShapeContainer'

export const CANVAS_RERENDER_EVENT_TYPE = 'canvas:rerender'

type MouseEventType =
  | 'click'
  | 'contextmenu'
  | 'dblclick'
  | 'mousedown'
  | 'mouseenter'
  | 'mouseleave'
  | 'mousemove'
  | 'mouseout'
  | 'mouseover'
  | 'mouseup'

const MOUSE_EVENTS: MouseEventType[] = [
  'click',
  'contextmenu',
  'dblclick',
  'mousedown',
  'mouseenter',
  'mouseleave',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
]

/**
 * Canvas is shape's container, it can `add` or `remove` shape,
 * Canvas delegate events like click, mousemove, and dispatch event to the right shape
 *
 * @export
 * @class Canvas
 */
export default class Canvas extends EventEmitter {
  ctx: CanvasRenderingContext2D
  canvasElement: HTMLCanvasElement
  width: number = 300
  height: number = 150
  pixelRatio: number = pixelRatio
  shapeContainer: ShapeContainer = new ShapeContainer()
  constructor(
    canvas: HTMLCanvasElement,
    options: {
      width: number
      height: number
    },
  ) {
    super()
    if (!canvas) {
      raiseError('canvas not found')
    }
    this.canvasElement = canvas
    const ctx = this.canvasElement.getContext('2d')
    if (!ctx) {
      throw new Error('canvas context not found')
    }
    this.ctx = ctx
    this.width = options.width
    this.height = options.height
    this._setCanvasPixelRatio()
    this._handleMouseEvents()
    this._handleCanvasRerenderEvent()
  }
  /**
   * Add a shape to Canvas and render
   *
   * @param {Shape} shape
   * @memberof Canvas
   */
  add(shape: Shape) {
    this.shapeContainer.add(shape)
    this._renderShape(shape)
  }
  /**
   * Remove a shape from Canvas
   *
   * @param {Shape} shape
   * @memberof Canvas
   */
  remove(shape: Shape) {
    this.shapeContainer.remove(shape)
    shape.canvas = null
    this._render()
  }
  /**
   * set Canvas rotate, and Canvas will rerender automatically
   *
   * @param {...Parameters<CanvasTransform['rotate']>} angle
   * @memberof Canvas
   */
  rotate(...angle: Parameters<CanvasTransform['rotate']>) {
    this.ctx.save()
    this.ctx.rotate(...angle)
    this._render()
    this.ctx.restore()
  }
  /**
   * set Canvas scale, and Canvas will rerender automatically
   *
   * @param {...Parameters<CanvasTransform['scale']>} args
   * @memberof Canvas
   */
  scale(...args: Parameters<CanvasTransform['scale']>) {
    const [a, d] = args
    this.setTransform(a, 0, 0, d, 0, 0)
  }
  /**
   * set Canvas translate, and Canvas will rerender automatically
   *
   * @param {...Parameters<CanvasTransform['translate']>} args
   * @memberof Canvas
   */
  translate(...args: Parameters<CanvasTransform['translate']>) {
    this.setTransform(1, 0, 0, 1, ...args)
  }
  /**
   * set Canvas transform, and Canvas will rerender automatically
   *
   * @param {...Parameters<CanvasTransform['transform']>} args
   * @memberof Canvas
   */
  setTransform(...args: Parameters<CanvasTransform['transform']>) {
    // use `transform` to multiply current matrix to avoid reset canvas pixelRatio
    this.ctx.save()
    this.ctx.transform(...args)
    this._render()
    this.ctx.restore()
  }
  /**
   * Remove all shapes from Canvas
   *
   * @memberof Canvas
   */
  clear() {
    this.shapeContainer.getShapes().forEach(shape => (shape.canvas = null))
    this.shapeContainer.removeAll()
    this._clearCanvas()
  }
  
  /**
   * Remove all shapes and clear all events on canvas
   *
   * @memberof Canvas
   */
  destroy() {
    this.clear()
    this._unhandleMouseEvents()
    this._unhandleCanvasRerenderEvent()
    this._unsetCanvasPixelRatio()
  }
  /**
   * Clear Canvas
   *
   * @returns
   * @memberof Canvas
   */
  private _clearCanvas() {
    this.ctx.save()
    const canvas = this.canvasElement
    this.ctx.resetTransform()
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.ctx.restore()
  }
  private _render = () => {
    this._clearCanvas()
    this.shapeContainer.getShapes().forEach(shape => {
      this._renderShape(shape)
    })
  }
  /**
   * apply shape's attr to context, after render, restore context
   *
   * @param {Shape} shape
   */
  private _renderShape = (shape: Shape) => {
    this.ctx.save()
    shape.canvas = this
    applyShapeAttrsToContext(this.ctx, shape.attrs())
    shape.render(this.ctx)
    this.ctx.restore()
  }
  private _setCanvasPixelRatio = () => {
    this.canvasElement.style.width = `${this.width}px`
    this.canvasElement.style.height = `${this.height}px`
    this.canvasElement.width = pxByPixelRatio(this.width)
    this.canvasElement.height = pxByPixelRatio(this.height)
    this.ctx.scale(pixelRatio, pixelRatio)
  }
  private _unsetCanvasPixelRatio = () => {
    this.canvasElement.width = this.width
    this.canvasElement.height = this.height
    this.ctx.scale(1, 1)
  }
  private _handleCanvasRerenderEvent = () => {
    this.on(CANVAS_RERENDER_EVENT_TYPE, this._render)
  }
  private _unhandleCanvasRerenderEvent = () => {
    this.off(CANVAS_RERENDER_EVENT_TYPE, this._render)
  }
  private _handleMouseEvents() {
    MOUSE_EVENTS.forEach(key => {
      this.canvasElement.addEventListener<MouseEventType>(
        key,
        this._emitShapeEvents,
      )
    })
  }
  private _unhandleMouseEvents() {
    MOUSE_EVENTS.forEach(key => {
      this.canvasElement.removeEventListener<MouseEventType>(
        key,
        this._emitShapeEvents,
      )
    })
  }
  /**
   * dispatch original mouse event to  Canvas.shapes
   *
   * @param {MouseEvent} e
   */
  private _emitShapeEvents = (e: MouseEvent) => {
    const shapes = this.shapeContainer.getShapes()
    const len = shapes.length
    // 从后往前遍历，找到 "z-index" 最大的
    for (let index = len - 1; index >= 0; index--) {
      const shape = shapes[index]
      if (!shape) continue
      if (shape.isPointInShape(this.ctx, e)) {
        shape._emitMouseEvent(e)
        break
      }
    }
  }
}
