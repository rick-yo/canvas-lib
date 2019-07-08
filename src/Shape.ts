import EventEmitter from './EventEmitter';
import Canvas, { CANVAS_RERENDER_EVENT_TYPE } from './Canvas';
import cloneDeep from 'lodash/cloneDeep';
import assign from 'lodash/assign';
import { Dictionary } from 'lodash';
import Group from './Group';
import { Mutable } from './utils';
import inRange from 'lodash/inRange';

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
  rotate?: Parameters<CanvasTransform['rotate']>[0];
  translate?: Parameters<CanvasTransform['translate']>;
  scale?: Parameters<CanvasTransform['scale']>;
}

export type CanvasStylesKeys = keyof CanvasStyles;

export type MousePosition = Mutable<
  Pick<MouseEvent, 'offsetX' | 'offsetY' | 'type'>
>;

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
};

export interface ShapeAttrs extends CanvasStyles {
  x: number;
  y: number;
  width?: number;
  height?: number;
}
type ShapeAttrsKeys = keyof ShapeAttrs;
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
export default abstract class Shape<
  P extends ShapeAttrs = ShapeAttrs,
  D = any
> extends EventEmitter {
  type = 'shape';
  attrs: P;
  canvas: Canvas | null = null;
  data?: D;
  parent: Group | null = null;
  path: Path2D | null = null;
  /**
   * Creates an instance of Shape with attrs.
   * @param {P} attrs
   * @memberof Shape
   */
  constructor(attrs: P) {
    super();
    this.attrs = attrs;
  }
  /**
   * Set shape's attrs and shape will rerender automatically.
   *
   * @template K
   * @param {K} key
   * @param {P[K]} value
   */
  set = <K extends keyof P>(key: K, value: P[K]) => {
    assign(this.attrs, { key: value });
    this.canvas && this.canvas.emit(CANVAS_RERENDER_EVENT_TYPE, this);
  };
  /**
   * Get a attr
   *
   * @template K
   * @param {K} key
   * @returns
   */
  get = <K extends keyof P>(key: K) => {
    return this.attrs[key];
  };
  /**
   * Store data in shape, you can get it in `on` callback later.
   *
   * @param {D} data
   * @memberof Shape
   */
  setData(data: D) {
    this.data = data;
  }
  /**
   * Get stored data
   *
   * @returns {(D | undefined)}
   * @memberof Shape
   */
  getData(): D | undefined {
    return this.data || undefined;
  }
  protected fillOrStroke(ctx: CanvasRenderingContext2D, path?: Path2D) {
    const { strokeStyle, fillStyle } = this.attrs;
    if (strokeStyle) {
      path ? ctx.stroke(path) : ctx.stroke();
    }
    if (fillStyle) {
      path ? ctx.fill(path) : ctx.fill();
    }
  }
  render(ctx: CanvasRenderingContext2D): void {
    throw new Error('render method not implemented');
  }
  isPointInShape(ctx: CanvasRenderingContext2D, e: MousePosition): boolean {
    throw new Error('isPointInShape method not implemented');
  }
  protected _getPositionFromShape(pos?: [number, number]): [number, number] {
    pos = pos || [this.get('x'), this.get('y')];
    if (this.parent) {
      pos[0] += this.parent.get('x');
      pos[1] += this.parent.get('y');
    }
    return pos;
  }
  protected _isPointInShapePath(
    ctx: CanvasRenderingContext2D,
    e: MousePosition,
  ) {
    if (!this.path) return false;
    const { offsetX, offsetY } = e;
    return ctx.isPointInPath(this.path, offsetX, offsetY);
  }
  protected _isPointInShapeContent(
    ctx: CanvasRenderingContext2D,
    e: MousePosition,
  ) {
    const { width, height } = this.attrs;
    if (!width || !height) return false;
    const [x, y] = this._getPositionFromShape();
    const { offsetX, offsetY } = e;
    return inRange(offsetX, x, x + width) && inRange(offsetY, y, y + height);
  }
}

export function applyShapeAttrsToContext(
  ctx: CanvasRenderingContext2D,
  ..._attrs: Partial<ShapeAttrs>[]
) {
  const attrs = <ShapeAttrs>assign({}, ..._attrs.map(cloneDeep));
  const { rotate, translate, scale, x, y, ...rest } = attrs;
  for (const key in rest) {
    if (rest.hasOwnProperty(key) && canvasStylesMap[key]) {
      // @ts-ignore
      ctx[key] = rest[key];
    }
  }
  if (translate) {
    ctx.translate(...translate);
  }
  if (rotate) {
    ctx.rotate(rotate);
  }
  if (scale) {
    ctx.scale(...scale);
  }
}
