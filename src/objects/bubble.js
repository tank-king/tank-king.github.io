import {BaseObject} from "../engine/objects.js";
import {BUBBLE_LAYER, p5js, WATER_DEPTH} from "../engine/constants.js";
import {drawCircle} from "../engine/utils.js";

class Bubble extends BaseObject {
    constructor(x, y, radius = null, randomizeOffset = true) {
        if (randomizeOffset === true) {
            x += p5js.random(-20 * 2, 20 * 2);
        }
        super(x, y, BUBBLE_LAYER);
        this.radius = radius !== null ? radius : p5js.random(1, 20);
        this.outlineThickness = p5js.int(p5js.map(this.radius, 1, 20, 1, 5));
    }

    update(dt) {
        this.y -= dt * this.radius * 0.5;
        this.x += p5js.random(-1, 1) * dt;
        this.radius -= dt * 0.2;
        if (this.radius <= 0 || this.y - this.radius <= WATER_DEPTH) {
            this.radius = 0;
            this.destroy();
        }
    }

    render(offset, scale) {
        if (!this.alive) {
            return;
        }
        drawCircle(null, ...this.position(), this.radius, "white", this.outlineThickness);
    }
}

export {Bubble};