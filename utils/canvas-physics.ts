export interface Point {
  x: number;
  y: number;
}

export interface Shape {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  type: string;
}

export interface QuadrantTarget {
  key: string;
  color: string;
  pos: {
    x: number;
    y: number;
    vx: number;
    vy: number;
  };
}

export function updateQuadrantTargetPhysics(
  targets: QuadrantTarget[],
  targetRadius = 55,
  canvasWidth = 640,
  canvasHeight = 480
) {
  if (targets.length < 4) return;
  const midX = canvasWidth / 2;
  const midY = canvasHeight / 2;

  const targetA = targets[0].pos;
  const targetB = targets[1].pos;
  const targetC = targets[2].pos;
  const targetD = targets[3].pos;

  targetA.x += targetA.vx;
  targetA.y += targetA.vy;
  if (targetA.x < targetRadius || targetA.x > midX - targetRadius) targetA.vx *= -1;
  if (targetA.y < targetRadius || targetA.y > midY - targetRadius) targetA.vy *= -1;

  targetB.x += targetB.vx;
  targetB.y += targetB.vy;
  if (targetB.x < midX + targetRadius || targetB.x > canvasWidth - targetRadius) targetB.vx *= -1;
  if (targetB.y < targetRadius || targetB.y > midY - targetRadius) targetB.vy *= -1;

  targetC.x += targetC.vx;
  targetC.y += targetC.vy;
  if (targetC.x < targetRadius || targetC.x > midX - targetRadius) targetC.vx *= -1;
  if (targetC.y < midY + targetRadius || targetC.y > canvasHeight - targetRadius) targetC.vy *= -1;

  targetD.x += targetD.vx;
  targetD.y += targetD.vy;
  if (targetD.x < midX + targetRadius || targetD.x > canvasWidth - targetRadius) targetD.vx *= -1;
  if (targetD.y < midY + targetRadius || targetD.y > canvasHeight - targetRadius) targetD.vy *= -1;
}

export function updateShapePhysics(
  shapes: Shape[],
  canvasWidth = 640,
  canvasHeight = 480
) {
  shapes.forEach((shape) => {
    shape.x += shape.vx;
    shape.y += shape.vy;

    const r = shape.radius;
    if (shape.x - r < 0) {
      shape.x = r;
      shape.vx = -shape.vx;
    } else if (shape.x + r > canvasWidth) {
      shape.x = canvasWidth - r;
      shape.vx = -shape.vx;
    }

    if (shape.y - r < 0) {
      shape.y = r;
      shape.vy = -shape.vy;
    } else if (shape.y + r > canvasHeight) {
      shape.y = canvasHeight - r;
      shape.vy = -shape.vy;
    }
  });

  for (let i = 0; i < shapes.length; i++) {
    for (let j = i + 1; j < shapes.length; j++) {
      const s1 = shapes[i];
      const s2 = shapes[j];
      const dx = s2.x - s1.x;
      const dy = s2.y - s1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const minDist = s1.radius + s2.radius;

      if (distance < minDist) {
        const overlap = minDist - distance;
        const nx = distance > 0 ? dx / distance : 1;
        const ny = distance > 0 ? dy / distance : 0;

        s1.x -= nx * overlap * 0.5;
        s1.y -= ny * overlap * 0.5;
        s2.x += nx * overlap * 0.5;
        s2.y += ny * overlap * 0.5;

        const rvx = s2.vx - s1.vx;
        const rvy = s2.vy - s1.vy;
        const velAlongNormal = rvx * nx + rvy * ny;

        if (velAlongNormal < 0) {
          const impulse = -velAlongNormal;
          s1.vx -= nx * impulse;
          s1.vy -= ny * impulse;
          s2.vx += nx * impulse;
          s2.vy += ny * impulse;
        }
      }
    }
  }
}
