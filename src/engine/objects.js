import {DEFAULT_LAYER, p5js} from "./constants.js";

class BaseStructure {
    handle_events(events) {

    }

    update(dt) {
    }

    render(offset, scale) {
    }
}

class Singleton {
    static __instance = null;

    // constructor() {
    //     return Singleton.instance();
    // }

    static instance() {
        if (Singleton.__instance === null) {
            Singleton.__instance = new Singleton();
        }
        return Singleton.__instance;
    }
}


class BaseObject extends BaseStructure {
    constructor(x, y, z = DEFAULT_LAYER) {
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.object_manager = null;
        this.alive = true;
    }

    set_object_manager(manager) {
        this.object_manager = manager;
    }

    get_object_manager() {
        return this.object_manager;
    }

    position() {
        return [this.x, this.y];
        // return p5js.createVector(this.x, this.y);
    }

    set_position(x, y) {
        this.x = x;
        this.y = y;
    }

    destroy() {
        this.alive = false;
    }

    get_rect() {
        throw new Error("get_rect not defined");
    }

    move(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    move_to(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        this.move(dx, dy);
    }
}

class ObjectManager extends BaseStructure {
    constructor() {
        super();
        this.objects = [];
        this.to_add = [];
    }

    get_objects(instance) {
        const objects = [];
        for (const element of this.objects) {
            if (element instanceof BaseObject) {
                objects.push(element);
            }
        }
        return objects;
    }

    add(object) {
        object.set_object_manager(this);
        this.to_add.push(object);
    }

    add_multiple(objects) {
        for (const element of objects) {
            this.add(element);
        }
    }

    update(dt) {
        if (this.to_add.length >= 0) {
            this.objects = [...this.objects, ...this.to_add];
            this.to_add = [];
        }
        this.objects = this.objects.filter((element) => element.alive === true);
        this.objects.sort((a, b) => a.z - b.z);
        for (const element of this.objects) {
            element.update(dt);
        }
    }

    render(offset, scale) {
        for (const element of this.objects) {
            element.render(offset, scale);
        }
    }
}

export {
    BaseStructure,
    BaseObject,
    ObjectManager,
    Singleton
};