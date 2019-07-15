import EventEmitter from './EventEmitter'
import {
  pxByPixelRatio,
  pixelRatio,
  Mutable,
  raiseError,
  random,
} from './utils'
import isFunction from 'lodash/isFunction'
import Shape from './Shape'
function getOffscreenCanvas(width: number, height: number) {
  return new OffscreenCanvas(width, height)
}

/**
 * render the same shape as Canvas
 *
 * @export
 * @class HitCanvas
 * @extends {EventEmitter}
 */
export default class HitCanvas extends EventEmitter {
  hitContext: OffscreenCanvasRenderingContext2D
  offscreenCanvas: OffscreenCanvas
  width: number = 300
  height: number = 150
  pixelRatio: number = pixelRatio
  colorHash: {
    [key: string]: Shape
  } = {}
  constructor(options: { width: number; height: number }) {
    super()
    this.width = options.width
    this.height = options.height

    this.offscreenCanvas = getOffscreenCanvas(this.width, this.height)
    const hitContext = this.offscreenCanvas.getContext('2d')
    this.hitContext = hitContext as OffscreenCanvasRenderingContext2D
  }
  getImageData(x: number, y: number) {
    return this.hitContext.getImageData(x, y, 1, 1).data.map(Math.round)
  }
  getContext() {
    return this.hitContext
  }
  add(shape: Shape) {
    if (shape.color && this.colorHash[shape.color] === shape) return
    const color = this.randomColor()
    shape.color = color
    this.colorHash[color] = shape
  }
  remove(shape: Shape) {
    shape.color = ''
    delete this.colorHash[shape.color]
  }
  randomColor = (): string => {
    const r = Math.round(random(0, 255))
    const g = Math.round(random(0, 255))
    const b = Math.round(random(0, 255))
    const color = `rgb(${r},${g},${b})`
    if (this.colorHash[color]) return this.randomColor()
    return color
  }
}
