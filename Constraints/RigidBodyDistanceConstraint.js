import { RigidBody } from '../RigidBody.js';

export class RigidBodyDistanceConstraint {

    constructor(rigidBodyA, rigidBodyB, positionGlobalA, positionGlobalB, stiffness = 1, config, color = '#F2B90F') {
        this.rigidBodyA = rigidBodyA;
        this.rigidBodyB = rigidBodyB;
        this.positionGlobalA = positionGlobalA;
        this.positionGlobalB = positionGlobalB;
        this.positionLocalA = this.rigidBodyA.worldToLocal(positionGlobalA, this.rigidBodyA.positionX, this.rigidBodyA.rotationX);
        this.positionLocalB = this.rigidBodyB.worldToLocal(positionGlobalB, this.rigidBodyB.positionX, this.rigidBodyB.rotationX);

        this.initialDistance = positionGlobalB.subtracted(positionGlobalA.positionX).length();
        this.stiffness = stiffness;
        this.config = config;
        this.color = color;
    }

    solve() {

        
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        ctx.moveTo(this.particleA.positionX.x, this.particleA.positionX.y);
        ctx.lineTo(this.particleB.positionX.x, this.particleB.positionX.y);
        ctx.stroke();
    }
}