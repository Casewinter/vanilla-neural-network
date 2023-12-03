export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

type GetIntersection = {
    x: number;
    y: number;
}

type Object = {
    x: number;
    y: number;
    offset: number;
}

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

export function getIntersection(A: GetIntersection, B: GetIntersection, C: GetIntersection, D: GetIntersection): Object | null {
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
                offset: t
            }
        }
    }
    return null
}
