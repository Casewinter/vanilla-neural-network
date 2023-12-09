import "./style.css";
import Car from "./Car.ts";
import Road from "./Road.ts";
import Visualizer from "./Visualizer.ts";
import NeuralNetwork from "./Network.ts";

const carCanvas = <HTMLCanvasElement>document.getElementById("carCanvas");

const networkCanvas = <HTMLCanvasElement>(
  document.getElementById("networkCanvas")
);

carCanvas.width = 200;
networkCanvas.width = 300;

const carCtx = <CanvasRenderingContext2D>carCanvas.getContext("2d");
const networkCtx = <CanvasRenderingContext2D>networkCanvas.getContext("2d");

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9);

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
  new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2),
];

const N = 100;
const cars = generateCars(N);
let bestCar = cars[0];
if (localStorage.getItem("bestBrain")) {
  for (let i = 0; i < cars.length; i++) {
    //@ts-ignore
    cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.2);
    }
  }
}

Animate();

function save() {
  localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem("bestBrain");
}

function generateCars(n: number) {
  const cars = [];

  for (let i = 1; i <= n; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
  }
  return cars;
}

function Animate(time?: any) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  //@ts-ignore
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, "red");
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, "blue");
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, "blue", true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  Visualizer.drawNetwork(networkCtx, bestCar.brain);
  requestAnimationFrame(Animate);
}
