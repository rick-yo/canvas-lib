import Canvas from '../src/Canvas';
import Rect from '../src/Rect';
import Image from '../src/Image';

function main() {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
  const img = document.querySelector<HTMLCanvasElement>('img');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const can = new Canvas(ctx);
  const rect = new Rect({
    x: 30,
    y: 30,
    width: 200,
    height: 200,
    fillStyle: '#000',
    radius: [5, 5, 10, 20],
    shadowColor: '#000',
    globalAlpha: 0.4,
    shadowOffsetX: 0,
    shadowOffsetY: 2,
    shadowBlur: 4,
  });
  if (img) {
    const image = new Image({
      x: 330,
      y: 30,
      width: 200,
      height: 200,
      image: img,
    });
    can.add(image);
  }

  can.add(rect);
  setTimeout(() => {
    can.remove(rect);
  }, 2000);
}

main();
