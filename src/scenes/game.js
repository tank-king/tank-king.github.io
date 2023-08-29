import {Scene} from "../engine/scene.js";
import {Bubble} from "../objects/bubble.js";
import {p5js, WATER_DEPTH} from "../engine/constants.js";
import {Water} from "../engine/water.js";
import {text, Timer} from "../engine/utils.js";

class Game extends Scene {
    constructor(manager) {
        super(manager);
        this.timer = new Timer(0.02);
    }

    update(dt) {
        super.update(dt);
        if (this.timer.tick()) {
            this.objectManager.add(
                new Bubble(p5js.mouseX, p5js.mouseY)
            );
        }
    }

    render(offset, scale) {
        p5js.background("#006494");
        super.render(offset, scale);

        // p5js.fill("white")
        // p5js.noStroke()
        // p5js.text("Tank King", 50, 125)
        // text("Tank King", "impact", 100, "white", 50, 125, null, null);
    }
}

export {Game};