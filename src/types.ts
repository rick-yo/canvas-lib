import Shape from './Shape'

export type MousePosition = Mutable<
  Pick<MouseEvent, 'offsetX' | 'offsetY' | 'type' | 'movementX' | 'movementY'>
> & {
  target?: Shape<any>
}

export type CanvasTransformMatrix = Parameters<CanvasTransform['transform']>

export type Mutable<ObjectType> = {
  -readonly // For each `Key` in the keys of `ObjectType`, make a mapped type by removing the `readonly` modifier from the property.
  [KeyType in keyof ObjectType]: ObjectType[KeyType]
}

export type Class<T = unknown> = new (...arguments_: any[]) => T

export type Position = [number, number]

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
    > {}

export type CanvasStylesKeys = keyof CanvasStyles

export interface ShapePositionMatrix {
  x: number
  y: number
  transform?: CanvasTransformMatrix
  // other transform
  // rotate?: number
  // translate?: XY
  // scale?: XY
}
