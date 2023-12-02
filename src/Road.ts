class Road {
  x: number;
  width: number;
  laneCount: number;

  left: number;
  right: number;

  top: number;
  bottom: number;

  constructor(x: number, width: number, laneCount: number = 3) {
    this.x = x;
    this.width = width;
    this.laneCount = laneCount;

    this.left = x - width / 2;
    this.right = x + width / 2;

    const infinity = 100000;
    this.top = -infinity;
    this.bottom = infinity;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';

    for (let i = 0; 1 <= this.laneCount; i++) {
      const x = lerp(this.left, this.right, i / this.laneCount);
      ctx.beginPath();
      ctx.moveTo(x, this.top);
      ctx.lineTo(x, this.bottom);
      ctx.stroke();
    }
  }
}

export default Road;

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
