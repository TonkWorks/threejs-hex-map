define(["require", "exports", "three", "./util"], function (require, exports, three_1, util_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LightOfGod = exports.Selectors = void 0;
    exports.Selectors = [];
    class AnimatedSelector {
        constructor(materialOptions = {}) {
            // Load texture
            const texture = new three_1.TextureLoader().load((0, util_1.asset)("/map/icons/circle.png"));
            const rotationSpeed = Math.PI / 2; // Default: 90 degrees per second
            // Create material with merged options
            const material = new three_1.MeshStandardMaterial(Object.assign({ map: texture, transparent: false, alphaTest: .15, color: 0xffffff, emissive: 0x00ff00, emissiveIntensity: .4 }, materialOptions));
            // Create mesh
            this.mesh = new three_1.Mesh(new three_1.PlaneBufferGeometry(2.4, 2.4), material);
            this.mesh.position.z = -0.1;
            this.mesh.rotateX(-1 * Math.PI / 4.3);
            this.rotationSpeed = rotationSpeed;
            exports.Selectors.push(this);
        }
        // Call this in your animation loop with delta time
        update(delta) {
            this.mesh.rotation.z += delta * this.rotationSpeed;
        }
        // Optional: Setter for rotation speed
        setRotationSpeed(speed) {
            this.rotationSpeed = speed;
        }
        dispose() {
            this.mesh.parent.remove(this.mesh);
            this.mesh.geometry.dispose();
            const index = exports.Selectors.indexOf(this);
            if (index !== -1)
                exports.Selectors.splice(index, 1);
        }
    }
    class LightOfGod {
        constructor(shaftCount = 6, // Number of cylinders
        initialOpacity = 0.0, // Base opacity
        flickerSpeed = 1, // Speed of flicker
        flickerRange = 0.1, // How much flicker can change opacity
        height = 75, // Cylinder height
        radiusTop = 0.2, radiusBottom = .2) {
            this.cylinders = [];
            this.group = new three_1.Group();
            this.flickerSpeed = flickerSpeed;
            this.flickerRange = flickerRange;
            for (let i = 0; i < shaftCount; i++) {
                const geometry = new three_1.CylinderGeometry(radiusTop, radiusBottom, height, 16, 1);
                // Slight offset so each cylinder is scaled or angled differently
                geometry.translate(0, height / 2, 0);
                const material = new three_1.MeshBasicMaterial({
                    color: 0xffffff,
                    transparent: true,
                    opacity: initialOpacity,
                    //   blending: AdditiveBlending,  // Helps get a nice “light” look
                    depthWrite: false, // Often turned off for additive glowing
                    side: 2, // DoubleSide – shows from inside & outside
                });
                const cylinder = new three_1.Mesh(geometry, material);
                // Optionally, rotate or scale cylinders slightly differently
                // cylinder.rotation.x = Math.random() * 0.3 - 0.15; // small tilt
                // cylinder.rotation.z = Math.random() * 0.3 - 0.15;
                cylinder.position.y = Math.random() * 1.5 - .75;
                cylinder.position.x = Math.random() * 1.5 - .75;
                cylinder.scale.set(0.8 + Math.random() * 0.4, 1, 0.8 + Math.random() * 0.4);
                cylinder.rotateX(Math.PI / 4.5);
                this.cylinders.push(cylinder);
                this.group.add(cylinder);
            }
            exports.Selectors.push(this);
        }
        update(delta) {
            // Example “flicker” or “pulsing” effect by adjusting each cylinder's opacity
            this.cylinders.forEach((cyl, idx) => {
                const material = cyl.material;
                if (!material)
                    return;
                // Simple flicker wave:
                const flicker = Math.sin((performance.now() / 1000) * this.flickerSpeed + idx) *
                    this.flickerRange;
                const baseOpacity = 0.03;
                material.opacity = three_1.MathUtils.clamp(baseOpacity + flicker, 0, 1);
                // Or animate rotation, scale, etc.:
                // cyl.rotation.y += 0.4 * delta;
            });
        }
        dispose() {
            if (this.group.parent) {
                this.group.parent.remove(this.group);
            }
            // Remove from array
            const index = exports.Selectors.indexOf(this);
            if (index !== -1)
                exports.Selectors.splice(index, 1);
            // Clean up
            this.cylinders.forEach((mesh) => {
                mesh.geometry.dispose();
            });
        }
    }
    exports.LightOfGod = LightOfGod;
    exports.default = AnimatedSelector;
});
//# sourceMappingURL=Selector.js.map