import Shape, { ShapeAttrs } from './Shape';
import inRange from 'lodash/inRange';

export interface TextAttrs extends ShapeAttrs {
  text: string;
  font?: string;
  maxWidth?: number;
  width?: number;
  height?: number;
}

export default class Text extends Shape<TextAttrs> {
  type = 'text';
  constructor(attrs: TextAttrs) {
    super(attrs);
    // 手动计算高度
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, text, font } = this.attrs;
    let { width, maxWidth, height } = this.attrs;
    if (font) {
      ctx.font = font;
    }
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
      ctx.fillText(acturalText, x, y)
    }
    if (strokeStyle) {
      ctx.strokeText(acturalText, x, y)
    }
  }
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    const { x, y, width, height } = this.attrs;
    if (!width || !height) return false;
    return inRange(px, x, x + width) && inRange(py, y, y + height);
  }
}
