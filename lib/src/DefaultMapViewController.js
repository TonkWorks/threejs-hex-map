define(["require", "exports", "./map/coords", "three"], function (require, exports, coords_1, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Animation {
        /**
         * Simple animation helper
         * @param durationMs duration of the animation in milliseconds
         * @param update animation function which will receive values between 0.0 and 1.0 over the duration of the animation
         * @param easingFunction function that determines the progression of the animation over time
         */
        constructor(durationMs, update, easingFunction = Animation.easeInOutQuad) {
            this.durationMs = durationMs;
            this.update = update;
            this.easingFunction = easingFunction;
            /**
             * Progress of the animation between 0.0 (start) and 1.0 (end).
             */
            this.progress = 0.0;
        }
        /**
         * Advances the animation by the given amount of time in seconds.
         * Returns true if the animation is finished.
         */
        animate(dtS) {
            this.progress = this.progress + dtS * 1000 / this.durationMs;
            this.update(this.easingFunction(this.progress));
            return this.progress >= 1.0;
        }
    }
    Animation.easeInOutQuad = (t) => {
        if ((t /= 0.5) < 1)
            return 0.5 * t * t;
        return -0.5 * ((--t) * (t - 2) - 1);
    };
    Animation.easeLinear = (t) => t;
    class Controller {
        constructor() {
            this.lastDrag = null;
            this.debugText = null;
            this.selectedQR = { q: 0, r: 0 };
            this.animations = [];
            this.onAnimate = (dtS) => {
                const animations = this.animations;
                for (let i = 0; i < animations.length; i++) {
                    // advance the animation
                    const animation = animations[i];
                    const finished = animation.animate(dtS);
                    // if the animation is finished (returned true) remove it
                    if (finished) {
                        // remove the animation
                        animations[i] = animations[animations.length - 1];
                        animations[animations.length - 1] = animation;
                        animations.pop();
                    }
                }
            };
            this.onKeyDown = (e) => {
                if (e.keyCode == 32) { // SPACE BAR
                    console.log(`center view on QR(${this.selectedQR.q},${this.selectedQR.r})`);
                    //this.controls.focus(this.selectedQR.q, this.selectedQR.r)
                    this.PanCameraTo(this.selectedQR, 600 /*ms*/);
                }
            };
            this.onMouseDown = (e) => {
                this.pickingCamera = this.controls.getCamera().clone();
                this.mouseDownPos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.pickingCamera);
                this.dragStartCameraPos = this.controls.getCamera().position.clone();
            };
            this.onMouseEnter = (e) => {
                if (e.buttons === 1) {
                    this.onMouseDown(e);
                }
            };
            this.onMouseMove = (e) => {
                // scrolling via mouse drag
                if (this.mouseDownPos) {
                    const mousePos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.pickingCamera);
                    const dv = this.lastDrag = mousePos.sub(this.mouseDownPos).multiplyScalar(-1);
                    const newCameraPos = dv.clone().add(this.dragStartCameraPos);
                    this.controls.getCamera().position.copy(newCameraPos);
                }
                // scrolling via screen edge only in fullscreen mode
                if (window.innerHeight == screen.height && !this.mouseDownPos) {
                    const scrollZoneSize = 20;
                    const mousePos2D = new three_1.Vector2(e.clientX, e.clientY);
                    const screenCenter2D = new three_1.Vector2(window.innerWidth / 2, window.innerHeight / 2);
                    const diff = mousePos2D.clone().sub(screenCenter2D);
                    if (Math.abs(diff.x) > screenCenter2D.x - scrollZoneSize || Math.abs(diff.y) > screenCenter2D.y - scrollZoneSize) {
                        this.controls.setScrollDir(diff.x, -diff.y);
                    }
                    else {
                        this.controls.setScrollDir(0, 0);
                    }
                }
                //
                const mousePos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.controls.getCamera());
                const tile = this.controls.pickTile(mousePos);
                this.controls.hoverTile(tile, e.clientX, e.clientY);
            };
            this.onMouseUp = (e) => {
                if (!this.lastDrag || this.lastDrag.length() < 0.1) {
                    const mousePos = (0, coords_1.screenToWorld)(e.clientX, e.clientY, this.controls.getCamera());
                    const tile = this.controls.pickTile(mousePos);
                    if (tile) {
                        if (e.button === 0) {
                            this.controls.selectTile(tile);
                            this.selectedQR = tile;
                        }
                        if (e.button === 2) {
                            // Handle right-click logic here
                            this.controls.actionTile(tile);
                            // console.log(`Right-click detected on tile ${tile.q}:${tile.r}`);
                        }
                    }
                }
                this.mouseDownPos = null; // end drag
                this.lastDrag = null;
            };
            this.onMouseOut = (e) => {
                this.mouseDownPos = null; // end drag
                this.controls.hoverTile(undefined, e.clientX, e.clientY);
                this.controls.setScrollDir(0, 0);
            };
            this.onMouseUpMini = (e) => {
                if (!this.lastDrag || this.lastDrag.length() < 0.1) {
                    const mousePos = (0, coords_1.screenToWorldMiniMap)(e.clientX, e.clientY, this.controls.getMiniMapCamera());
                    const tile = this.controls.pickTile(mousePos);
                    this.PanCameraTo(tile, 600 /*ms*/);
                }
                this.mouseDownPos = null; // end drag
                this.lastDrag = null;
            };
        }
        set debugOutput(elem) {
            this.debugText = elem;
        }
        init(controls, canvas) {
            this.controls = controls;
            document.addEventListener("keydown", this.onKeyDown, false);
            canvas.addEventListener("mousedown", this.onMouseDown, false);
            canvas.addEventListener("mousemove", this.onMouseMove, false);
            canvas.addEventListener("mouseup", this.onMouseUp, false);
            canvas.addEventListener("mouseout", this.onMouseOut, false);
            canvas.addEventListener("mouseenter", this.onMouseEnter, false);
            canvas.addEventListener("touchstart", (e) => {
                this.onMouseDown(e.touches[0]);
                e.preventDefault();
            }, false);
            canvas.addEventListener("touchmove", (e) => {
                this.onMouseMove(e.touches[0]);
                e.preventDefault();
            }, false);
            canvas.addEventListener("touchend", (e) => this.onMouseUp(e.touches[0] || e.changedTouches[0]), false);
            // setInterval(() => this.showDebugInfo(), 200)
            document.getElementById("minimap").addEventListener("mouseup", this.onMouseUpMini, false);
            this.controls.setOnAnimateCallback(this.onAnimate);
        }
        addAnimation(animation) {
            this.animations.push(animation);
        }
        PanCameraTo(qr, durationMs) {
            const from = this.controls.getCamera().position.clone();
            const to = this.controls.getCameraFocusPosition(qr);
            this.addAnimation(new Animation(durationMs, (a) => {
                this.controls.getCamera().position.copy(from.clone().lerp(to, a));
            }));
        }
    }
    exports.default = Controller;
});
//# sourceMappingURL=DefaultMapViewController.js.map