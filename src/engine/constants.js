import {range} from "./utils.js";

export const [
    DEFAULT_LAYER,
    WATER_SPLASH_LAYER,
    WATER_LAYER,
    OBJECTS_LAYER,
    FISH_LAYER,
    BUBBLE_LAYER,
    UI_LAYER,
    ..._
] = range(10);


export const BG_COlOR = [247, 213, 147];
export const WATER_DEPTH = 0;

export var p5js = null;


export function set_p5js_global_instance(p) {
    p5js = p;
}
