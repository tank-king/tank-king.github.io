export const Game = (p) => {
    let stars;

    class Star {
        constructor(x=null, y=null) {
            if (x == null){
                x = p.random(0, p.width);
            }
            if (y == null){
                y = p.random(0, p.height);
            }
            this.x = x
            this.y = y
            this.r = p.random(10, 20);
            this.dx = p.random(-10, 10) / 10;
            this.dy = p.random(-10, 10) / 10;
        }

        pos() {
            return p.createVector(this.x, this.y);
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;
            if (this.x < -this.r / 2) {
                this.x = p.width + this.r;
            }
            if (this.x > p.width + this.r) {
                this.x = -this.r / 2;
            }
            if (this.y < -this.r / 2) {
                this.y = p.height + this.r;
            }
            if (this.y > p.height + this.r) {
                this.y = -this.r / 2;
            }
        }
        render() {
            p.noStroke();
            p.drawingContext.shadowBlur = 22;
            const d = this.pos().dist(p.createVector(p.mouseX, p.mouseY))
            let dr = 0;
            if (d <= 250){
                dr = p.map(d, 0, 250, 10, 0)
            }
            // p.fill([255, 255, 255, 150 + dr * 10])
            p.ellipse(this.x, this.y, this.r + dr);
        }

        interact(stars) {
            // p.fill([255, 255, 255, 150])
            stars.forEach((star) => {
                const d = this.pos().dist(star.pos())
                p.drawingContext.shadowBlur = 0;
                if (d <= 255) {
                    p.stroke([255, 255, 255, 255 - d]);
                    p.strokeWeight((this.r + star.r) * 0.1)
                    p.line(this.x, this.y, star.x, star.y);
                }
            });
        }
    }


    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.frameRate(60);
        stars = Array.from({ length: 30 }, (i) => new Star());
        p.drawingContext.shadowColor = "white";
        p.fill("white")
    };


    p.draw = () => {
        p.background(0);
        stars.forEach((star) => {
            star.update();
            star.render();
            star.interact(stars);
        });
    };

    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    };


    p.mousePressed = (event) => {
        stars.push(new Star(p.mouseX, p.mouseY))
    }
};
new p5(Game, document.getElementById('sketch'))