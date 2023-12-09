import Controls from "./Controls.ts";
import Sensor from "./Sensor.js";
import { polygonIntersect } from "./utils.ts";
import NeuralNetwork from "./Network.ts";

type Polygon = {
  x: number;
  y: number;
};

class Car {
  x: number;
  y: number;
  width: number;
  height: number;
  controlType: string;
  sensor: any;

  speed: number;
  acceleration: number;

  maxSpeed: number;
  friction: number;
  angle: number;

  polygon: Polygon[];
  damaged: boolean;

  controls: any;

  //@ts-expect-error
  brain: NeuralNetwork;
  useBrain: boolean;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    controlType: string,
    maxSpeed: number = 3,
    color = "blue"
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.controlType = controlType;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.05;
    this.angle = 0;

    this.polygon = [];

    this.damaged = false;

    this.useBrain = controlType == "AI";

    if (controlType != "DUMMY") {
      this.sensor = new Sensor(this);
      this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
    }
    this.controls = new Controls(controlType);
  }

  update(
    roadBorders: {
      x: number;
      y: number;
    }[][],
    traffic: any[]
  ) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamaged(roadBorders, traffic);
    }

    if (this.sensor) {
      this.sensor.update(roadBorders, traffic);
      const offsets = this.sensor.readings.map(
        (
          s: {
            x: number;
            y: number;
            offset: number;
          } | null
        ) => (s == null ? 0 : 1 - s.offset)
      );
      const outputs = NeuralNetwork.feedForward(offsets, this.brain);
      if (this.useBrain) {
        this.controls.forward = outputs[0];
        this.controls.left = outputs[1];
        this.controls.right = outputs[2];
        this.controls.reverse = outputs[3];
      }
    }
  }

  #assessDamaged(
    roadBorders: {
      x: number;
      y: number;
    }[][],
    traffic: any[]
  ) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polygonIntersect(this.polygon, roadBorders[i])) return true;
    }
    for (let i = 0; i < traffic.length; i++) {
      if (polygonIntersect(this.polygon, traffic[i].polygon)) return true;
    }
    return false;
  }

  #createPolygon(): Polygon[] {
    const points: Polygon[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad,
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad,
    });
    return points;
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }
    if (this.speed < 0) {
      this.speed += this.friction;
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }
    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1;
      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    //max speed for foward and reverse

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    } else if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    //friction
    if (this.speed > 0) {
      this.speed -= this.friction;
    } else if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    this.x -= Math.sign(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    color: string,
    drawSensor: boolean = false
  ) {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = color;
    }
    ctx.beginPath();
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y);

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
    }
    ctx.fill();

    if (this.sensor && drawSensor) {
      this.sensor.draw(ctx);
    }
  }
}

export default Car;
