import {BaseStructure} from "./objects.js";
import {TransitionManager} from "./transition.js";

import {Game} from "../scenes/game.js";
import {UnloadedScene} from "./scene.js";

class SceneManager extends BaseStructure {
    constructor() {
        super();
        this.to_switch = "none";
        this.to_reset = false;
        this.to_save_in_stack = true;
        this.transition_manager = new TransitionManager();
        this.scenes = {};

        // load all scenes here
        this.getLoadableScenes().forEach((s) => {
            this.loadScene(s);
        });
        this.scene = this.scenes["game"];
        this.scene.enter();
        this.scene_stack = [];
        this._default_reset = false;
        this._default_transition = false;
    }

    loadScene(scene) {
        const _scene = new scene(this);
        this.scenes[_scene.name()] = _scene;
    }

    getLoadableScenes() {
        return [
            UnloadedScene,
            Game,
        ];
    }

    loadScenesDynamically() {
        const isDirectory = path => statSync(path).isDirectory();
        const getDirectories = path =>
            readdirSync(path).map(name => join(path, name)).filter(isDirectory);

        const isFile = path => statSync(path).isFile();
        const getFiles = path =>
            readdirSync(path).map(name => join(path, name)).filter(isFile);

    }

    switch_to_prev_scene() {
        if (this.scene_stack.length > 0) {
            this.switch_scene(this.scene_stack.pop(), this._default_reset, this._default_transition, false);
        }
    }

    switch_scene(scene, reset = false, transition = false, save_in_stack = false) {
        if (scene in this.scenes) {
            if (transition === true) {
                this.to_switch = scene;
                this.to_reset = reset;
                this.to_save_in_stack = save_in_stack;
                this.transition_manager.close();
            }
            else {
                if (save_in_stack === true) {
                    this.scene_stack.push(this.scene);
                }
                this.scene = scene;
                this.scene.exit();
                this.scene = this.scenes[scene];
                this.scene.enter();
                if (reset === true) {
                    this.scene.reset();
                }
            }
        }
    }

    update(dt) {
        if (this.to_switch !== "none") {
            if (this.transition_manager.transition.get_status() === "closed") {
                this.switch_scene(this.to_switch, this.to_reset, false, this.to_save_in_stack);
                this.to_switch = "none";
                this.to_reset = false;
                this.transition_manager.open();
            }
        }
        this.scene.update(dt);
        this.transition_manager.update(dt);
    }

    render(offset, scale) {
        this.scene.render(offset, scale);
        this.transition_manager.render(offset, scale);
    }

    on_resize() {
        try {
            this.scene.on_resize();
        }
        catch (err) {
            console.log("Scene <" + this.scene.name() + "> : " + err.message);
        }
    }
}

export {SceneManager};