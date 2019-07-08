import Shape, { ShapeAttrs, MousePosition } from './Shape';
import inRange from 'lodash/inRange';

export interface TextAttrs extends ShapeAttrs {
  text: string;
  font?: string;
  maxWidth?: number;
}

export default class Text<D = any> extends Shape<TextAttrs, D> {
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
    const [x, y] = this._getPositionFromShape();
    let { width, maxWidth, height } = this.attrs;
    if (font) {
      ctx.font = font;
    }
    // 手动计算高度
    height = height || parseInt(ctx.font, 10);
    width = ctx.measureText(text).width;
    if (!maxWidth) {
      ctx.fillText(text, x, y);
      return;
    }
    width = maxWidth;
    const ellipsis = '...';
    const ellipsisWidth = ctx.measureText(ellipsis).width + 10;
    const _maxWidth = maxWidth - ellipsisWidth;
    let currentWidth = width;
    let currentText = text;
    while (currentText && currentWidth > _maxWidth) {
      currentText = currentText.slice(0, currentText.length - 2);
      currentWidth = ctx.measureText(currentText).width;
    }
    ctx.fillText(`${currentText}${ellipsis}`, x, y);
  }
  fillOrStrokeText(ctx: CanvasRenderingContext2D, acturalText: string) {
    const { x, y, text, fillStyle, strokeStyle } = this.attrs;
    if (fillStyle) {
      ctx.fillText(acturalText, x, y);
    }
    if (strokeStyle) {
      ctx.strokeText(acturalText, x, y);
    }
  }
  isPointInShape(ctx: CanvasRenderingContext2D, e: MousePosition): boolean {
    return this._isPointInShapeContent(ctx, e);
  }
}
