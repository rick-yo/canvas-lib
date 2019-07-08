import Canvas from '../src/Canvas';
import Rect from '../src/Rect';
import Image from '../src/Image';
import { Arc, Polygon, Group } from '../src';

function wait(millSecond: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, millSecond);
  });
}

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
  const img = document.querySelector<HTMLCanvasElement>('img');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const can = new Canvas(ctx);
  const rect = new Rect({
    x: 30,
    y: 30,
    width: 100,
    height: 100,
    fillStyle: '#000',
    radius: [5, 5, 10, 20],
    shadowColor: '#000',
  });
  const rect1 = new Rect({
    x: 130,
    y: 30,
    width: 100,
    height: 100,
    fillStyle: 'red',
    radius: [5, 5, 10, 20],
  });
  const arc = new Arc({
    x: 100,
    y: 200,
    radius: 20,
    endAngle: Math.PI,
    fillStyle: 'red',
  });
  const polygon = new Polygon({
    x: 100,
    y: 100,
    radius: 50,
    fillStyle: 'green',
    sides: 5,
  });
  if (img) {
    const image = new Image({
      x: 330,
      y: 30,
      width: 200,
      height: 200,
      image: img,
    });
    image.on('click', (e, shape) => {
      console.log('e :', shape.attr);
    });
    can.add(image);
  }
  const group = new Group({
    x: 0,
    y: 0,
  });

  polygon.on('click', (e, s) => {
    console.log('e :', s);
  });

  rect.setData({});
  rect.on('click', (e, s) => {
    console.log('rect');
  });
  rect1.on('click', (e, s) => {
    console.log('rect1');
  });
  arc.on('click', (e, s) => {
    console.log('e :', s);
  });
  group.add(rect);
  group.add(rect1);
  group.add(arc);
  group.add(polygon);
  can.add(group);
  // arc.set('anticlockwise', false)
  // can.add(rect);
  // can.add(arc);
  // can.add(polygon);
  // await wait(1000);
  // rect.set('fillStyle', 'blue');
  // await wait(1500);
  // can.remove(rect);
}

main();
