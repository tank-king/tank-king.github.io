import {p5js} from "./constants.js";

export function range(n) {
    let nums = [];
    for (let i = 0; i < n; i++) {
        nums.push(i);
    }
    return nums;
}

export function lerpColor(color1, color2, amount = 0.5) {
    const color_1 = p5js.color(color1);
    const color_2 = p5js.color(color2);
    let vec3 = p5js.createVector(color_1.levels[0], color_1.levels[1], color_1.levels[2]);
    vec3 = vec3.lerp(color_2.levels[0], color_2.levels[1], color_2.levels[2], amount);
    return p5js.color(vec3.x, vec3.y, vec3.z);
}

function set_draw_properties(color, outline_color, outline_width) {
    if (outline_color != null && outline_width != null) {
        p5js.stroke(outline_color);
        p5js.strokeWeight(outline_width);
    }
    else {
        p5js.noStroke();
    }
    if (color != null) {
        p5js.fill(color);
    }
    else {
        p5js.noFill();
    }
}

export function drawRect(color, x, y, w, h, outlineColor = null, outlineWidth = null) {
    set_draw_properties(color, outlineColor, outlineWidth);
    p5js.rect(x, y, w, h);
}

export function drawRects(color, rects, outlineColor = null, outlineWidth = null) {
    set_draw_properties(color, outlineColor, outlineWidth);
    rects.forEach(
        (rectangle) => {
            const [x, y, w, h] = rectangle;
            rect(x, y, w, h);
        }
    );
}

export function drawCircle(color, x, y, radius, outlineColor, outlineThickness) {
    set_draw_properties(color, outlineColor, outlineThickness);
    p5js.circle(x, y, radius * 2);
}

export function drawPolygon(color, points, outlineColor, outlineThickness) {
    set_draw_properties(color, outlineColor, outlineThickness);
    p5js.beginShape();
    points.forEach(
        (p, index, array) => {
            // p5js.vertex(p[0], p[1]);
            if (index < points.length - 25) {
                console.log(index);
                p5js.curveVertex(p[0], p[1]);
            }
            else {
                p5js.vertex(p[0], p[1]);
            }
        }
    );
    p5js.endShape(p5js.CLOSE);
}


export function text(text, font, size, color, x, y, outlineColor, outlineThickness, anchor = "center") {
    if (anchor === "center") {
        p5js.rectMode(p5js.CENTER);
    }
    else {
        p5js.rectMode(p5js.CORNER);
    }
    set_draw_properties(color, outlineColor, outlineThickness);
    p5js.textFont(font, size);
    p5js.text(text, x, y);
}

export function get_time() {
    return Date.now() * 0.001; // in seconds
}

export class Timer {
    constructor(timeout = 0.0, reset = true, callback = null) {
        this.timeout = timeout;
        this.timer = get_time();
        this.paused_timer = get_time();
        this.paused = false;
        this._reset = reset;
        this._callback = callback;
        this.done = false;
    }

    set_timeout(timeout) {
        this.timeout = timeout;
    }

    set_callback(func) {
        this._callback = func;
    }

    reset() {
        this.timer = get_time();
    }

    pause() {
        this.paused = true;
        this.paused_timer = get_time();
    }

    resume() {
        this.paused = false;
        this.timer -= get_time() - this.paused_timer;
    }

    elapsed() {
        if (this.paused) {
            return get_time() - this.timer - (get_time() - this.paused_timer);
        }
        return get_time() - this.timer;
    }

    tick() {
        if (this.done === true) {
            return false;
        }
        if (this.elapsed() > this.timeout) {
            if (this._reset) {
                this.reset();
            }
            else {
                this.done = true;
            }
            if (this._callback !== null) {
                this._callback.call();
            }
            return true;
        }
        else {
            return false;
        }
    }
}


export class InfiniteTimer extends Timer {
    constructor() {
        super();
        this.done = true;
    }
}

