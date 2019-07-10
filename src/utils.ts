const prefix = '[canvas-lib]: ';
export const pixelRatio = Math.round(window.devicePixelRatio || 1);

export function pxByRatio(px: number) {
  return Math.round(pixelRatio * px);
}

export type Mutable<ObjectType> = {
  -readonly // For each `Key` in the keys of `ObjectType`, make a mapped type by removing the `readonly` modifier from the property.
  [KeyType in keyof ObjectType]: ObjectType[KeyType]
};

export function raiseError(message: string) {
  throw new Error(prefix + message);
}

export type Class<T = unknown> = new(...arguments_: any[]) => T;