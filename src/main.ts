import './style.css';
import Car from './Car.ts';
import Road from './Road.ts';

const canvas = <HTMLCanvasElement>document.getElementById('myCanvas');

canvas.width = 200;

const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(100, 100, 30, 50);

Animete();

function Animete() {
  car.update();
  canvas.height = window.innerHeight;
  road.draw(ctx);
  car.draw(ctx);
  requestAnimationFrame(Animete);
}
