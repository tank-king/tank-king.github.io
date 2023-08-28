import {SceneManager} from "./engine/scene_manager.js";
import {EventManager} from "./engine/events.js";
import {set_p5js_global_instance} from "./engine/constants.js";
import {HEIGHT, WIDTH} from "./engine/config.js";


export const Game = (p) => {
    let sceneManager, evManager;
    set_p5js_global_instance(p);

    p.setup = () => {
        p.createCanvas(WIDTH, HEIGHT);
        sceneManager = new SceneManager();
        evManager = new EventManager();
        p.windowResized();
        p.frameRate(60)
    };


    p.draw = () => {
        sceneManager.update(1);
        sceneManager.render();
    };

    p.windowResized = () => {
        sceneManager.on_resize();
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };
};