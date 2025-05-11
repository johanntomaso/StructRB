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
        this.transformedPointsP = this.transformPoints(this.positionP, this.rotationP);
        this.transformedPointsX = this.transformPoints(this.positionX, this.rotationX);
        this.color = color;
    }

    transformPoints(position, rotationDeg) {
        return this.points.map(pt =>
            pt
                .rotateDeg(rotationDeg)
                .added(position)
        );
    }

    worldToLocal(worldPoint, position, rotationDeg) {
        return worldPoint
            .subtracted(position)
            .rotateDeg(-rotationDeg);
    }

    localToWorld(localPoint, position, rotationDeg) {
        return localPoint
            .rotateDeg(rotationDeg)
            .added(position);
    }

    draw(ctx) {
        if (this.points.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(this.transformedPointsX[0].x, this.transformedPointsX[0].y);
        for (let i = 1; i < this.transformedPointsX.length; i++) {
            ctx.lineTo(this.transformedPointsX[i].x, this.transformedPointsX[i].y);
        }
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
