import "./style.css";
import Car from "./Car.ts";
import Road from "./Road.ts";

const canvas = <HTMLCanvasElement>document.getElementById("myCanvas");

canvas.width = 200;

const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "KEYS", 4);

const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2)];

Animate();

function Animate() {
  traffic.forEach((car) => car.update(road.borders, []));

  car.update(road.borders, traffic);
  canvas.height = window.innerHeight;

  ctx.save();
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);

  traffic.forEach((car) => car.draw(ctx, "red"));
  car.draw(ctx, "blue");

  ctx.restore();
  requestAnimationFrame(Animate);
}
