import Canvas from '../src/Canvas'
import { Arc, Polygon, Group, Line, Text, Rect, Image } from '../src'
import { toNumber } from 'lodash'

function wait(millSecond: number) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, millSecond)
  })
}

async function main() {
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')
  const img = document.querySelector<HTMLCanvasElement>('img')
  if (!canvas) return
  const width = window.innerWidth
  const height = window.innerHeight
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const can = new Canvas(canvas, {
    width,
    height,
  })
  const rect = new Rect({
    x: 30,
    y: 30,
    width: 100,
    height: 100,
    fillStyle: '#000',
    radius: [5, 5, 10, 20],
    shadowColor: '#000',
  })
  const rect1 = new Rect({
    x: 130,
    y: 30,
    width: 100,
    height: 100,
    fillStyle: 'red',
    radius: [5, 5, 10, 20],
  })
  const arc = new Arc({
    x: 100,
    y: 200,
    radius: 20,
    endAngle: Math.PI,
    fillStyle: 'red',
  })
  const polygon = new Polygon({
    x: 100,
    y: 100,
    radius: 50,
    fillStyle: 'green',
    sides: 5,
  })
  if (img) {
    const image = new Image({
      x: 230,
      y: 130,
      width: 200,
      height: 200,
      image: img,
    })
    image.on('click', e => {
      console.log(e)
    })
    can.add(image)
  }
  const line = new Line({
    x: 500,
    y: 300,
    x1: 300,
    y1: 200,
    lineWidth: 30,
    strokeStyle: '#000',
  })
  const group = new Group({
    x: 500,
    y: 110,
  })
  const text = new Text({
    text: '测试测试测试测试',
    maxWidth: 100,
    x: 0,
    y: 20,
    font: '18px serif',
  })
  text.on('click', e => {
    console.log(e)
  })
  polygon.on('click', e => {
    console.log(e)
  })
  
  rect.on('click', e => {
    console.log(e)
  })
  rect1.on('click', e => {
    rect1.attr('fillStyle', 'blue')
    console.log(e)
  })
  arc.on('click', e => {
    console.log(e)
  })
  group.add(text)
  group.add(rect1)
  group.add(rect)
  group.add(arc)
  group.add(polygon)
  can.add(line)
  can.add(group)
  await wait(500)
  // rect1.attr('x', 500)
  // can.translate(100, 200)
  // await wait(500)
  // can.scale(2, 2)
  // await wait(500)
  // can.rotate(Math.PI / 10)
}

main()
