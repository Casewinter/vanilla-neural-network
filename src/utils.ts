export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type GetIntersection = {
  x: number;
  y: number;
};

type Object = {
  x: number;
  y: number;
  offset: number;
};

/**
 * @description Returns intersect of two lines
 * Takes as params four coordinate points. Start and end of each line
 * @param A  start of line 1 { x, y }
 * @param B end of line 1 { x, y }
 * @param C start of line 2 { x, y }
 * @param D end of line 2 { x, y }
 *
 * @returns coordinate points of intersection  and offset  { x, y, offset } or null if it does not exist
 */

export function getIntersection(
  A: GetIntersection,
  B: GetIntersection,
  C: GetIntersection,
  D: GetIntersection
): Object | null {
  const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
  const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
  const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);

  if (bottom != 0) {
    const t = tTop / bottom;
    const u = uTop / bottom;
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
      return {
        x: lerp(A.x, B.x, t),
        y: lerp(A.y, B.y, t),
        offset: t,
      };
    }
  }
  return null;
}

export function polygonIntersect(
  poly1: GetIntersection[],
  poly2: GetIntersection[]
) {
  for (let i = 0; i < poly1.length; i++) {
    for (let j = 0; j < poly2.length; j++) {
      const touch = getIntersection(
        poly1[i],
        poly1[(i + 1) % poly1.length],
        poly2[j],
        poly2[(j + 1) % poly2.length]
      );
      if (touch) {
        return true;
      }
    }
  }
  return false;
}

export function getRGBA(value: number) {
  const alpha = Math.abs(value);
  const R = value < 0 ? 0 : 255;
  const G = R;
  const B = value > 0 ? 0 : 255;
  return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}
