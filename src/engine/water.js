import {BaseObject} from "./objects.js";
import {p5js, WATER_LAYER} from "./constants.js";
import {drawPolygon, lerpColor, range} from "./utils.js";

class WaterSpring extends BaseObject {
    constructor(x, y, height, target_height = null) {
        super(x, y);
        if (target_height === null) {
            this.target_height = height - 10;
        }
        else {
            this.target_height = target_height;
        }
        this.dampening = 0.05;
        this.tension = 0.01;
        this.height = this.target_height;
        this.vel = 0;
    }

    update(dt) {
        const dh = this.target_height - this.height;
        if (p5js.abs(dh) < 0.01) {
            this.height = this.target_height;
        }
        this.vel += (this.tension * dh - this.vel * this.dampening) * dt;
        this.height += this.vel * dt;
    }

    render(offset, scale) {
    }
}


class Water extends BaseObject {
    constructor(x, y, width, height, depth = 0) {
        super(x, y, WATER_LAYER);
        const diff = Math.round(20 * 1.5);
        this.springs = Array.from(
            {length: Math.floor(width / diff) + 2},
            (_, i) => new WaterSpring(x = i * diff, y = 0, height = depth)
        );
        this.diff = diff;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.points = [];
    }

    get_points(offset = [0, 0]) {
        this.points = Array.from(this.springs,
            (i, _) => [offset[0] + i.x, offset[1] + i.height]
        );
        this.points = getCurve(this.points);
        this.points.push([this.springs.slice(-1)[0].x, p5js.windowHeight]);
        this.points.push([0, p5js.windowHeight]);
        return this.points;
    }

    get_spring_index_for_x_pos(x) {
        return p5js.int((x - this.x) / this.diff);
    }

    get_target_height() {
        return this.springs[0].target_height;
    }

    set_target_height(height) {
        this.springs.forEach((i) => {
            i.target_height = height;
        });
    }

    add_volume(volume) {
        const height = volume / this.height;
        this.set_target_height(this.get_target_height() - height);
    }

    update(dt) {
        this.springs.forEach((i) => {
            i.update(dt);
        });
        this.spreadWave(dt);
        this.points = this.get_points([this.x, this.y]);
        const index = p5js.random(0, this.springs.length - 1);
        this.splash(index, dt * 0.5 * 2);
    }

    render(offset, scale) {
        drawPolygon(this.getColor(), this.points, null, 5);
        // drawPolygon('blue', [[0, 0], [150, 150], [0, 150]], "white", 5)
    }

    spreadWave(dt) {
        const spread = 0.08 * dt;
        for (const i of range(this.springs.length)) {
            if (i > 0 && i < this.springs.length) {
                this.springs[i - 1].vel += spread * (this.springs[i].height - this.springs[i - 1].height);
            }
            if (i < this.springs.length - 1) {
                this.springs[i + 1].vel += spread * (this.springs[i].height - this.springs[i + 1].height);
            }
        }
    }

    splash(index, vel) {
        index = p5js.int(index);
        try {
            this.springs[index].vel += vel;
        }
        catch (e) {
        }
    }

    getColor(pollution = 0) {
        return lerpColor("#006994", "black", pollution / 150);
    }
}


function getCurve(points, diff = 20 * 1.5) {
    return points
    // adapted from the following answer:
    // https://stackoverflow.com/questions/26877497/how-do-i-produce-an-interpolation-function-given-n-data-points
    const multiLine = d3.scale.linear;
    multiLine.domain = (x) => {
        return x.map(
            (p) => p[0]
        );
    };
    multiLine.range = (y) => {
        return y.map(
            (p) => p[1]
        );
    };
    // return Array.from(
    //     {length: (points.slice(-1)[0] - points[0][0])},
    //     (v, k) => {
    //         const x = points[Math.floor(k)][0];
    //         return [x, multiLine(x)];
    //     }
    // );
    const result = [];
    for (let i = points[0][0]; i <= points.slice(-1)[0][0]; i += diff) {
        result.push(
            [i, i]
        );
    }
    return result;
}


export {
    Water
};