import {BaseStructure, ObjectManager} from "./objects.js";
import {TransitionManager} from "./transition.js";
import {BG_COlOR, p5js} from "./constants.js";


class Scene extends BaseStructure {
    constructor(manager) {
        super();
        this.manager = manager;
        this.objectManager = new ObjectManager();
    }

    name() {
        return this.constructor.name.toLowerCase();
    }

    init() {
    }

    enter() {
    }

    exit() {
    }

    on_resize() {
        throw Error("method on_resize not implemented");
    }

    reset() {
        this.init();
    }

    update(dt) {
        this.objectManager.update(dt);
    }

    render(offset, scale) {
        this.objectManager.render(offset, scale);
    }
}

export class UnloadedScene extends Scene {
    render(offset, scale) {
        p5js.background(...BG_COlOR);
    }
}


export {Scene};