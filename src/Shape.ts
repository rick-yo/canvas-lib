import { CanvasStyles } from './types'
import { CANVAS_RERENDER_EVENT_TYPE, mouse } from './constant'
import {
  CanvasTransformMatrix,
  MousePosition,
  ShapePositionMatrix,
} from './types'
import EventEmitter from './EventEmitter'
import Canvas from './Canvas'
import Group from './Group'
import { raiseError } from './utils'

export const canvasStylesMap: Dictionary<boolean> = {
  fillStyle: true,
  strokeStyle: true,
  lineCap: true,
  lineDashOffset: true,
  lineJoin: true,
  lineWidth: true,
  miterLimit: true,
  filter: true,
  globalAlpha: true,
  globalCompositeOperation: true,
  shadowBlur: true,
  shadowColor: true,
  shadowOffsetX: true,
  shadowOffsetY: true,
  direction: true,
  font: true,
  textAlign: true,
  textBaseline: true,
}

export interface ShapeAttrs extends CanvasStyles, ShapePositionMatrix {
  draggable?: boolean
}

/**
 * Basic shape class for rect circle path etc.
 * Shape extends eventEmitter to store and fire events
 * Shape store attrs and provide `render` method to draw the shape.
 *
 * @export
 * @abstract
 * @class Shape
 * @extends {EventEmitter}
 */
export default class Shape<
  P extends ShapeAttrs = ShapeAttrs
> extends EventEmitter {
  type = 'shape'
  private _attrs: P
  canvas: Canvas | null = null
  parent: Group | null = null
  data: any
  color = ''
  protected path: Path2D | null = null
  isDraging = false
  /**
   * Creates an instance of Shape with attrs.
   * @param {P} attrs
   * @memberof Shape
   */
  constructor(attrs: P) {
    super();
    this._attrs = attrs;
    this._unHandleDrag()
    this.on(mouse.down, this.handleDragStart)
    this.on(mouse.up, this.handleDragEnd)
  }
  attr<K extends keyof P>(key: K): P[K]
  attr<K extends keyof P>(key: K, value: P[K]): void
  /**
   * Set shape's attrs and shape will rerender automatically.
   *
   * @template K
   * @param {K} key
   * @param {P[K]} value
   */
  attr<K extends keyof P>(key: K, value?: P[K]) {
    if (!value) return this._attrs[key]
    this._setAttr(key, value)
    this._emitCanvasRerender()
  }
  attrs() {
    return this._attrs
  }
  /**
   * only used in local shape, will not trigger a rerender
   *
   * @template K
   * @param {K} key
   * @param {P[K]} value
   */
  protected _setAttr = <K extends keyof P>(key: K, value: P[K]) => {
    this._attrs[key] = value
  }
  /**
   * Store data in shape, you can get it in `on` callback later.
   *
   * @param {any} data
   * @memberof Shape
   */
  setData(data: any) {
    this.data = data
  }
  /**
   * Get stored data
   *
   * @returns {any}
   * @memberof Shape
   */
  getData(): any {
    return this.data
  }
  /**
   * fill or stroke a path
   *
   * @protected
   * @param {CanvasRenderingContext2D} ctx
   * @param {Path2D} [path]
   * @memberof Shape
   */
  protected fillOrStroke(ctx: CanvasRenderingContext2D, path?: Path2D) {
    const { strokeStyle, fillStyle } = this._attrs
    if (strokeStyle) {
      path ? ctx.stroke(path) : ctx.stroke()
    }
    if (fillStyle) {
      path ? ctx.fill(path) : ctx.fill()
    }
  }
  render(ctx: CanvasRenderingContext2D): void {
    raiseError('render method not implemented')
  }
  renderHit(ctx: OffscreenCanvasRenderingContext2D): void {
    raiseError('renderHit method not implemented')
  }
  protected _getShapeParents() {
    let groups = []
    let current = this.parent
    while (current) {
      groups.push(current)
      current = current.parent
    }
    return groups
  }
  public emitMouseEvent(type: string, e: MouseEvent) {
    const position = this._getMousePosition(type, e)
    this.emit(type, position)
    console.log('position :', position);
    const parents = this._getShapeParents()
    parents.forEach(parent => {
      parent.emit(type, position)
    })
  }
  protected _getMousePosition(type: string,e: MouseEvent): MousePosition {
    const { offsetX, offsetY, movementX, movementY } = e;
    const position: MousePosition = {
      offsetX,
      offsetY,
      type,
      target: this,
      movementX,
      movementY
    };
    return position;
  }
  protected _emitCanvasRerender() {
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this);
  }
  protected _unHandleDrag = () => {
    this.off(mouse.down, this.handleDragStart)
    this.off(mouse.move, this.handleDrag)
    this.off(mouse.up, this.handleDragEnd)
  }
  public handleDragStart = (e: MouseEvent) => {
    window.addEventListener(mouse.move, this.handleDrag)
    this.emit('dragstart', e)
  }
  // should not bubble up to parent group, so use `emit()` instead of `_emitMouseEvent`
  public handleDrag = (e: MouseEvent) => {
    this.isDraging = true
    const { draggable, x, y } = this._attrs;
    this.emit('drag', e)
    if (!draggable) return
    const { movementX, movementY, clientX, clientY } = e;
    if (clientX <= 0 || clientY <= 0) return
    this._setAttr('x', x + movementX)
    this._setAttr('y', y + movementY)
    this._emitCanvasRerender()
  }
  public handleDragEnd = (e: MouseEvent) => {
    this.isDraging = false
    window.removeEventListener(mouse.move, this.handleDrag)
    this.emit('dragend', e)
  }
}
