import Shape from './Shape'

export type MousePosition = Mutable<
  Pick<MouseEvent, 'offsetX' | 'offsetY' | 'type'>
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
