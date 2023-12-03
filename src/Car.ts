import Controls from './Controls.ts';
import Sensor from './Sensor.js';

type Polygon = {
  x: number;
  y: number
}


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


  polygon: Polygon[];

  controls = new Controls();
  sensor = new Sensor(this)
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = 4;
    this.friction = 0.05;
    this.angle = 0;
    this.polygon = []

  }
  update(roadBorders: any[]) {
    this.#move();
    this.polygon = this.#createPolygon()
    this.sensor.update(roadBorders)
  }

  #createPolygon(): Polygon[] {
    const points: Polygon[] = [];
    const rad = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);
    points.push({
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad
    });
    points.push({
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
    });
    points.push({
      x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
    });
    return points;
  }

  #move() {
    //move to front or reverse
    switch (this.controls.direction) {
      case 'foward':
        this.speed += this.acceleration;
        break;
      case 'reverse':
        this.speed -= this.acceleration;
        break;
    }

    //turn 
    if (this.speed != 0) {
      const toggle = this.speed > 0 ? 1 : -1;

      switch (this.controls.turn) {
        case 'left':
          this.angle += 0.03 * toggle;
          break;
        case 'right':
          this.angle -= 0.03 * toggle;
          break;
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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.moveTo(this.polygon[0].x, this.polygon[0].y)

    for (let i = 1; i < this.polygon.length; i++) {
      ctx.lineTo(this.polygon[i].x, this.polygon[i].y)
    }
    ctx.fill();

    this.sensor.draw(ctx)
  }
}

export default Car;
