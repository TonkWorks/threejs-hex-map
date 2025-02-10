define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function WebGLAnimation() {
        let context = null;
        let isAnimating = false;
        let animationLoop = null;
        let requestId = null;
        function onAnimationFrame(time, frame) {
            animationLoop(time, frame);
            requestId = context.requestAnimationFrame(onAnimationFrame);
        }
        return {
            start: function () {
                if (isAnimating === true)
                    return;
                if (animationLoop === null)
                    return;
                requestId = context.requestAnimationFrame(onAnimationFrame);
                isAnimating = true;
            },
            stop: function () {
                context.cancelAnimationFrame(requestId);
                isAnimating = false;
            },
            setAnimationLoop: function (callback) {
                animationLoop = callback;
            },
            setContext: function (value) {
                context = value;
            }
        };
    }
    exports.WebGLAnimation = WebGLAnimation;
});
//# sourceMappingURL=WebGLAnimation.js.map