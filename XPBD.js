import { CollisionDetector } from './CollisionDetector.js';

export class XPBD {
    constructor(config) {
        this.config = config;
        this.collisionDetector = new CollisionDetector(config);
    }

    update() {
        const { substeps, paused } = this.config;
        if(paused) return;
        
        for (let i = 0; i < substeps; i++) {
            this.integrate();
            this.solveConstraints();
            this.collisionDetector.findCollisions();
            this.solveCollisionConstraints();
            this.updateVelocities();
        }
    }

    integrate() {
        const { particles, rigidBodies, gravity, dts, multiplier } = this.config;

        for (const particle of particles) {
            const force = gravity.scaled(particle.m);
            const acceleration = force.scaled(particle.w);
            particle.velocity = particle.velocity.added(acceleration.scaled(dts * multiplier));
            particle.positionP = particle.positionX;
            particle.positionX = particle.positionX.added(particle.velocity.scaled(dts * multiplier));
        }

        for (const rigidBody of rigidBodies) {
            rigidBody.positionP = rigidBody.positionX;
            rigidBody.rotationP = rigidBody.rotationX;

            const force = gravity.scaled(rigidBody.m);
            const acceleration = force.scaled(rigidBody.w);
            rigidBody.velocity = rigidBody.velocity.added(acceleration.scaled(dts * multiplier));
            rigidBody.positionX = rigidBody.positionX.added(rigidBody.velocity.scaled(dts * multiplier));

            const torque = 0;
            const angularAcceleration = torque * rigidBody.iW;
            rigidBody.angularVelocity += angularAcceleration * dts;
            rigidBody.rotationX += rigidBody.angularVelocity * dts;

            rigidBody.transformedPointsP = rigidBody.transformPoints(rigidBody.positionP, rigidBody.rotationP);
            rigidBody.transformedPointsX = rigidBody.transformPoints(rigidBody.positionX, rigidBody.rotationX);
        }


    }

    solveConstraints() {
        this.config.constraints.forEach(constraint => constraint.solve());
        if(this.config.mouseConstraint) { this.config.mouseConstraint.solve(); }
    }

    solveCollisionConstraints() {
        this.config.environmentCollisionConstraints.forEach(constraint => constraint.solve());
    }

    updateVelocities() {
        const { particles, rigidBodies, dts, multiplier } = this.config;

        for (const particle of particles) {
            particle.velocity = particle.positionX.subtracted(particle.positionP).divided(dts * multiplier);
        }

        for (const rigidBody of rigidBodies) {
            rigidBody.velocity = rigidBody.positionX.subtracted(rigidBody.positionP).divided(dts * multiplier);
            rigidBody.angularVelocity = (rigidBody.rotationX - rigidBody.rotationP) / (dts);
        }

    }
}
