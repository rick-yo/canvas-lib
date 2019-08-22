import { CANVAS_RERENDER_EVENT_TYPE, mouse } from './constant'
import { CanvasTransformMatrix } from './types'
import Shape from './Shape'
import EventEmitter from './EventEmitter'
import eachAfter from './eachAfter'
import { pxByPixelRatio, pixelRatio, raiseError, SHAPE_TYPE } from './utils'
import HitCanvas from './HitCanvas'
import Group from './Group'
import eachBefore from './eachBefore'

type MouseEventType =
  // | 'click'
  'contextmenu' | 'dblclick' | 'mousedown' | 'mouseup' | 'mousemove'

const MOUSE_EVENTS: MouseEventType[] = [
  // 'click',
  'contextmenu',
  'dblclick',
  'mousedown',
  'mouseup',
  'mousemove',
]
const LEFT_BTN_CODE = 0
const CLICK_OFFSET = 40

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
  root: Group = new Group({ x: 0, y: 0 })
  hitCanvas: HitCanvas
  hitContext: OffscreenCanvasRenderingContext2D
  debug: boolean = false
  preShape: Shape | null = null
  dragging: Shape | null = null
  mousedownShape: Shape | null = null
  mousedownOffset: { x: number, y: number} = { x: 0, y: 0 }
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
    const { width, height } = options
    this.ctx = ctx
    this.width = width
    this.height = height
    this.hitCanvas = new HitCanvas({
      width,
      height,
    })
    this.hitContext = this.hitCanvas.getContext()
    this._setCanvasPixelRatio()
    this._handleMouseEvents()
    this._handleCanvasRerenderEvent()
    this.root.canvas = this
  }
  /**
   * Add a shape to Canvas and render
   *
   * @param {Shape} shape
   * @memberof Canvas
   */
  add(shape: Shape) {
    shape.canvas = this
    this.root.add(shape)
  }
  /**
   * Remove a shape from Canvas
   *
   * @param {Shape} shape
   * @memberof Canvas
   */
  remove(shape: Shape) {
    shape.canvas = null
    this.hitCanvas.remove(shape)
    this.root.remove(shape)
  }
  /**
   * set Canvas transform, and Canvas will rerender automatically
   *
   * @param {CanvasTransformMatrix} args
   * @memberof Canvas
   */
  setTransform(...args: CanvasTransformMatrix) {
    this.root.attr('transform', args)
  }
  /**
   * Remove all shapes from Canvas
   *
   * @memberof Canvas
   */
  clear() {
    this.root.children = []
    this.clearCanvas()
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
  clearCanvas() {
    this.ctx.save()
    const canvas = this.canvasElement
    this.ctx.resetTransform()
    this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.ctx.restore()
    this.hitCanvas.clearCanvas()
  }
  render = () => {
    this.clearCanvas()
    this.hitCanvas.add(this.root)
    this.root.render(this.ctx)
    this.root.renderHit(this.hitContext)
    this.debugRender()
  }
  debugRender = () => {
    if (this.debug) this.ctx.drawImage(this.hitCanvas.offscreenCanvas, 0, 0)
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
    this.on(CANVAS_RERENDER_EVENT_TYPE, this.render)
  }
  private _unhandleCanvasRerenderEvent = () => {
    this.off(CANVAS_RERENDER_EVENT_TYPE, this.render)
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
    const shape = this.getHitShape(e)
    const { offsetX, offsetY, type } = e
    if (type === 'mousemove') {
      if (this.preShape && this.preShape !== shape) {
        this.preShape.emitMouseEvent(mouse.out, e)
        this.preShape.emitMouseEvent(mouse.leave, e)
        if (this.dragging) {
          this.dragging.emitMouseEvent('drag', e)
          // self._emitEvent('mousemove', e, point, shape);
        }
        if (shape) {
          if (!this.dragging) {
            if (this.mousedownShape === shape) {
              this.dragging = shape
              this.mousedownShape = null
              shape.emitMouseEvent('dragstart', e)
            } else {
              shape.emitMouseEvent('mousemove', e)
            }
          }
          if (this.preShape !== shape) {
            shape.emitMouseEvent(mouse.enter, e)
            shape.emitMouseEvent(mouse.over, e)
          }
        }
        this.preShape = shape
      }
    } else {
      shape && shape.emitMouseEvent(type, e)
      // e.button === 0 保证按下左键，防止点击右键触发click
      if (
        !this.dragging &&
        type === 'mousedown' &&
        e.button === LEFT_BTN_CODE
      ) {
        this.mousedownShape = shape
        this.mousedownOffset = { x: e.clientX, y: e.clientY }
      }
      if (type === 'mouseup' && e.button === LEFT_BTN_CODE) {
        const dx = this.mousedownOffset.x - e.clientX
        const dy = this.mousedownOffset.y - e.clientY
        const dist = dx * dx + dy * dy
        if (dist < CLICK_OFFSET) {
          this.mousedownShape && this.mousedownShape.emitMouseEvent('click', e)
        }
        if (this.dragging) {
          this.dragging.emitMouseEvent('dragend', e)
          this.dragging.emitMouseEvent('drop', e)
          this.dragging = null
        }
        this.mousedownShape = null
      }
    }
  }
  private getHitShape(e: MouseEvent): Group | null {
    const { offsetX, offsetY, type } = e
    const p = this.hitCanvas.getImageData(offsetX, offsetY)
    const color = `rgb(${p[0]},${p[1]},${p[2]})`
    let shape: Group | null = null
    eachBefore(this.root, node => {
      if (node.color === color) {
        shape = node
      }
    })
    return shape
  }
}
