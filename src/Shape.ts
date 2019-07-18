import EventEmitter from './EventEmitter'
import Canvas, { CANVAS_RERENDER_EVENT_TYPE } from './Canvas'
import cloneDeep from 'lodash/cloneDeep'
import assign from 'lodash/assign'
import { Dictionary } from 'lodash'
import Group from './Group'
import {
  Mutable,
  pxByPixelRatio,
  raiseError,
  CanvasTransformMatrix,
  Position,
} from './utils'
import inRange from 'lodash/inRange'

export interface CanvasStyles
  extends Partial<CanvasCompositing>,
    Partial<CanvasFilters>,
    Partial<CanvasShadowStyles>,
    Partial<CanvasTextDrawingStyles>,
    // CanvasFillStrokeStyles
    Partial<Pick<CanvasFillStrokeStyles, 'fillStyle' | 'strokeStyle'>>,
    // CanvasPathDrawingStyles
    Partial<
      Pick<
        CanvasPathDrawingStyles,
        'lineCap' | 'lineDashOffset' | 'lineJoin' | 'lineWidth' | 'miterLimit'
      >
    > {
  // transform
  // rotate?: number
  // translate?: XY
  // scale?: XY
  transform?: CanvasTransformMatrix
}

export type CanvasStylesKeys = keyof CanvasStyles

export type MousePosition = Mutable<
  Pick<MouseEvent, 'offsetX' | 'offsetY' | 'type'>
> & {
  target?: Shape<any>
}

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

export interface ShapeAttrs extends CanvasStyles {
  x: number
  y: number
  width?: number
  height?: number
}

type ShapeAttrsKeys = keyof ShapeAttrs

const INT_ATTR_KEYS: ShapeAttrsKeys[] = [
  'x',
  'y',
  'width',
  'height',
  'lineWidth',
]

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
  /**
   * Creates an instance of Shape with attrs.
   * @param {P} attrs
   * @memberof Shape
   */
  constructor(attrs: P) {
    super()
    this._attrs = attrs
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
  public _emitMouseEvent(e: MouseEvent) {
    const position = this._getMousePosition(e)
    this.emit(position.type, position)
    const parents = this._getShapeParents()
    parents.forEach(parent => {
      parent.emit(position.type, position)
    })
  }
  protected _getMousePosition(e: MouseEvent): MousePosition {
    const { offsetX, offsetY, type } = e
    const position: MousePosition = {
      offsetX,
      offsetY,
      type,
      target: this,
    }
    return position
  }
  protected _emitCanvasRerender() {
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this)
  }
}

export function applyShapeAttrsToContext(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  attrs: ShapeAttrs,
  isGroup?: boolean,
) {
  // group内shape的实际样式 = assign(group.attr, shape.attr)
  const {
    x = 0,
    y = 0,
    transform = [1, 0, 0, 1, 0, 0],
    width,
    height,
    ...rest
  } = attrs
  for (const key in rest) {
    if (rest.hasOwnProperty(key) && canvasStylesMap[key]) {
      // @ts-ignore
      ctx[key] = rest[key]
    }
  }

  // only transform in group to affect group's shapes position
  if (isGroup) {
    const a = transform[0]
    const b = transform[1]
    const c = transform[2]
    const d = transform[3]
    const e = x + transform[4]
    const f = y + transform[5]
    // use `transform` to multiply current matrix to avoid reset canvas pixelRatio
    ctx.transform(a, b, c, d, e, f)
  }
}
