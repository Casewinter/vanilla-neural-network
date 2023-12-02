import Controls from './Controls.ts';
import Sensor from './Sensor.ts';

class Car {
  x: number;
  y: number;
  width: number;
  height: number;

  speed: number;
  acceleration: number;

  maxSpeed: number;
  friction: number;

  angle: number;

  controls = new Controls();
  sensor = new Sensor(this)
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 3;
    this.friction = 0.05;
    this.angle = 0;
  }
  update(roadBorders: any[]) {
    this.#move();
    this.sensor.update(roadBorders)
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
      const toggle = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * toggle;
      }

      if (this.controls.right) {
        this.angle -= 0.03 * toggle;
      }
    }
    this.x -= Math.sign(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.angle);
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height);
    ctx.fill();
    ctx.restore();

    this.sensor.draw(ctx)
  }
}

export default Car;
