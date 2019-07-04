import Canvas from '../src/Canvas';
import Rect from '../src/Rect';

function main() {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const c = new Canvas(ctx);
  const rect = new Rect({
    x: 10,
    y: 10,
    width: 200,
    height: 200,
    fillStyle: '#000',
    radius: [5, 5, 10, 20],
  });
  c.add(rect);
}

main();
