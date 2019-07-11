import Shape, { ShapeAttrs, MousePosition } from './Shape';

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
    const { text } = this.attrs();
    const [x, y] = this._getShapePosition();
    let { width, maxWidth, height } = this.attrs();
    // 手动计算高度
    const { font } = ctx 
    const fontHeight = parseInt(font, 10)
    height = height || Number.isNaN(fontHeight) ? 20 : fontHeight;
    this._setAttr('height', height)
    width =  width || ctx.measureText(text).width;
    this._setAttr('width', width)
    // fill
    if (!maxWidth) {
      this.fillOrStrokeText(ctx, text);
      return;
    }
    if (width <= maxWidth) {
      this.fillOrStrokeText(ctx, text);
      return;
    }
    // when maxWidth specified
    this._setAttr('width', maxWidth)
    const ellipsis = '...';
    const ellipsisWidth = ctx.measureText(ellipsis).width + 10;
    const _maxWidth = maxWidth - ellipsisWidth;
    let currentWidth = width;
    let currentText = text;
    while (currentText && currentWidth > _maxWidth) {
      currentText = currentText.slice(0, currentText.length - 1);
      currentWidth = ctx.measureText(currentText).width;
    }
    this.fillOrStrokeText(ctx, `${currentText}${ellipsis}`);
  }
  private fillOrStrokeText(ctx: CanvasRenderingContext2D, acturalText: string) {
    const { x, y, fillStyle, strokeStyle } = this.attrs();
    if (fillStyle) {
      ctx.fillText(acturalText, x, y);
    } else if (strokeStyle) {
      ctx.strokeText(acturalText, x, y);
    } else {
      ctx.fillText(acturalText, x, y);
    }
  }
  isPointInShape(ctx: CanvasRenderingContext2D, e: MouseEvent): boolean {
    return this._isPointInShapeContent(e);
  }
}
