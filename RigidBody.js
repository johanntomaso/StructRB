// RigidBody.js
import { Vector2 } from './Vector2.js';

export class RigidBody {
    constructor(x, y, rotation, m = 1, i = 1, points = [], color = '#D91424') {
        this.positionP = new Vector2(x, y);
        this.positionX = new Vector2(x, y);
        this.velocity = new Vector2(0, 0);

        this.rotationP = rotation;
        this.rotationX = rotation;
        this.angularVelocity = 0;

        this.m = m;
        this.w = m === 0 ? 0 : 1 / m;

        this.i = i; //TODO: Must be computed from the shape
        this.iW = i === 0 ? 0 : 1 / i;

        this.points = points;
        this.transformedPointsP = this.transformPoints();
        this.transformedPointsX = this.transformPoints();
        this.color = color;
    }

    transformPoints() {
        const transformedPoints = [];
        for (let point of this.points) {

            let transformedPoint = point.rotateDeg(this.rotation);
            transformedPoint = transformedPoint.added(this.position);
            transformedPoints.push(transformedPoint);
        }

        return transformedPoints;
    }

    worldToLocal(worldPoint) {
        const rel = worldPoint.subtracted(this.positionP);
        return rel.rotateDeg(-this.rotationP);
    }

    localToWorld(localPoint) {
        const rotated = localPoint.rotateDeg(this.rotationP);
        return rotated.added(this.positionP);
    }

    draw(ctx) {
        if (this.points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(this.transformedPoints[0].x, this.transformedPoints[0].y);
        for (let i = 1; i < this.transformedPoints.length; i++) {
            ctx.lineTo(this.transformedPoints[i].x, this.transformedPoints[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
