import Shape, { ShapeAttrs, MousePosition } from './Shape';
import inRange from 'lodash/inRange';

export interface TextAttrs extends ShapeAttrs {
  text: string;
  font?: string;
  maxWidth?: number;
}

export default class Text extends Shape<TextAttrs> {
  type = 'text';
  /**
   * Creates an instance of Text shape.
   * When `attrs.maxWidth` specified, Text will be automatically ellipsised
   * @param {TextAttrs} attrs
   * @memberof Text
   */
  constructor(attrs: TextAttrs) {
    super(attrs);
  }
  render(ctx: CanvasRenderingContext2D) {
    const { text, font } = this.attrs;
    const [x, y] = this._getShapePosition();
    let { width, maxWidth, height } = this.attrs;
    if (font) {
      ctx.font = font;
    }
    // 手动计算高度
    const _font = font || ctx.font;
    height = height || parseInt(_font, 10);
    width = ctx.measureText(text).width;
    this._setAttr('width', width)
    this._setAttr('height', height)
    // 直接fill
    if (!maxWidth) {
      ctx.fillText(text, x, y);
      return;
    }
    if (width <= maxWidth) {
      ctx.fillText(text, x, y);
      return;
    }
    const ellipsis = '...';
    const ellipsisWidth = ctx.measureText(ellipsis).width + 10;
    const _maxWidth = maxWidth - ellipsisWidth;
    let currentWidth = width;
    let currentText = text;
    while (currentText && currentWidth > _maxWidth) {
      currentText = currentText.slice(0, currentText.length - 2);
      currentWidth = ctx.measureText(currentText).width;
    }
    this._setAttr('width', width)
    ctx.fillText(`${currentText}${ellipsis}`, x, y);
  }
  private fillOrStrokeText(ctx: CanvasRenderingContext2D, acturalText: string) {
    const { x, y, text, fillStyle, strokeStyle } = this.attrs;
    if (fillStyle) {
      ctx.fillText(acturalText, x, y);
    }
    if (strokeStyle) {
      ctx.strokeText(acturalText, x, y);
    }
  }
  isPointInShape(ctx: CanvasRenderingContext2D, e: MouseEvent): boolean {
    return this._isPointInShapeContent(e);
  }
}
