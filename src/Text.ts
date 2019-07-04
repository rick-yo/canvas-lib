import Shape, { ShapeProps } from './Shape';
import inRange from 'lodash/inRange';

export interface TextProps extends ShapeProps {
  text: string;
  font?: string;
  maxWidth?: number;
  width?: number;
  height?: number;
}

export default class Text extends Shape<TextProps> {
  type = 'text';
  constructor(props: TextProps) {
    super(props);
    // 手动计算高度
  }
  render(ctx: CanvasRenderingContext2D) {
    const { x, y, text, font } = this.props;
    let { width, maxWidth, height } = this.props;
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
  isPointInShape(ctx: CanvasRenderingContext2D, px: number, py: number) {
    const { x, y, width, height } = this.props;
    if (!width || !height) return false;
    return inRange(px, x, x + width) && inRange(py, y, y + height);
  }
}
