import { prefix } from "./constant";

export const pixelRatio = Math.round(window.devicePixelRatio || 1);
export enum SHAPE_TYPE {
  group = 'group'
}

export function pxByPixelRatio(px: number) {
  return Math.round(pixelRatio * px);
}


export function raiseError(message: string) {
  throw new Error(prefix + message);
}
      
export function random(min: number, max: number) {
  return min + Math.random() * (max - min + 1);
}

