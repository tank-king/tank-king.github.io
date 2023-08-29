import {BaseStructure} from "./objects.js";
import {drawRect, range} from "./utils.js";
import {p5js} from "./constants.js";


class Transition extends BaseStructure {
    constructor() {
        super();
        this._status = "ready";
        this.k = 0;
        this.multiplier = 1;
        this.size = 0;
    }

    get_size() {
        throw new Error("get_size method not implemented yet");
    }

    get_status() {
        if (this.size === 0) {
            throw new Error("size should not be 0");
        }
        if (this.k === 0) {
            return "ready";
        }
        else if (this.k > 0) {
            if (this.get_status() >= this.size) {
                return "closed";
            }
            else {
                return "closing";
            }
        }
        else if (this.k < 0) {
            if (this.get_status() <= this.size) {
                return "open";
            }
            else {
                return "opening";
            }
        }
        else {
            return "unknown";
        }
    }

    start() {
        this.k = this.multiplier;
    }

    stop() {
        this.k = 0;
    }
}


class SquareTransition extends Transition {
    constructor() {
        super();
        this.size = 50;
        this.multiplier = 5;
        let cols = Math.floor(window.windowWidth / this.size) + 1;
        let rows = Math.floor(window.windowHeight / this.size) + 1;
        this.squares = Array.from({length: rows}, () => new Array(cols).fill(0));
    }

    update(dt) {
        this.squares.forEach((squares) => {
                for (const i in range(squares.length)) {
                    squares[i] += this.k * dt;
                    squares[i] = clamp(squares[i], 0, this.size);
                }
            }
        );
    }

    render(offset, scale) {
        for (const row in range(this.squares.length)) {
            for (const col in range(this.squares[row].length)) {
                const size = this.squares[row][col];
                drawRect(
                    "black",
                    col * this.size + this.size / 2 - size / 2,
                    row * this.size + this.size / 2 - size / 2,
                    size,
                    size,
                    "white",
                    2
                );
            }
        }
    }
}

class TransitionManager extends BaseStructure {
    constructor() {
        super();
        this.transition = new SquareTransition();
        this.transitions = {
            squareTransition: SquareTransition,
        };
    }

    open() {
        this.transition.k = -this.transition.multiplier;
    }

    close() {
        this.transition.k = this.transition.multiplier;
    }


    set_transition(transition) {
        this.transition = new transition();
    }

    update(dt) {
        this.transition.update(dt);
    }

    render(offset, scale) {
        this.transition.render(offset, scale);
    }
}


export {TransitionManager};