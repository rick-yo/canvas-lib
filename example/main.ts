import Canvas from '../src/Canvas';
import Rect from '../src/Rect';
import Image from '../src/Image';
import { Arc, Polygon, Group, Line, Text } from '../src';
import { toNumber } from 'lodash';

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
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const can = new Canvas(canvas, {
    width,
    height,
  });
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
      x: 230,
      y: 130,
      width: 200,
      height: 200,
      image: img,
    });
    image.on('click', (e) => {
      console.log(e);
    });
    can.add(image);
  }
  const line = new Line({
    x: 500,
    y: 300,
    x1: 300,
    y1: 200,
    lineWidth: 30,
    strokeStyle: '#000',
  });
  const group = new Group({
    x: 0,
    y: 0,
  });
  const text = new Text({
    text: '测试测试测试测试',
    maxWidth: 100,
    x: 0,
    y: 20,
    font: '18px serif',
  });
  text.on('click', (e) => {
    console.log(e);
  });
  can.add(text);
  polygon.on('click', (e) => {
    console.log(e);
  });

  rect.on('click', (e) => {
    console.log(e);
  });
  rect1.on('click', (e) => {
    rect1.attr('fillStyle', 'blue');
    console.log(e);
  });
  arc.on('click', (e) => {
    console.log(e);
  });
  group.add(rect1);
  group.add(rect);
  group.add(arc);
  group.add(polygon);
  can.add(line);
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
