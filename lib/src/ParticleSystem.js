define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class ParticleSystem {
        constructor(scene, options = {}) {
            this.systemAge = 0;
            this.active = true;
            this.scene = scene;
            this.particles = [];
            this.geometry = new three_1.BufferGeometry();
            this.options = {
                maxParticles: options.maxParticles || 2000,
                particleSize: options.particleSize || 5,
                lifetime: options.lifetime || 2,
                spawnRate: options.spawnRate || 50,
                spawnPosition: options.spawnPosition || { x: 0, y: 0, z: 0 },
                spawnArea: options.spawnArea || { x: 0, y: 0, z: 0 },
                gravity: options.gravity || -9.8,
                type: options.type || 'fire',
                shape: options.shape || 'square',
                duration: options.duration || 0,
                fireworkColors: options.fireworkColors || [
                    new three_1.Color(0xff0000), new three_1.Color(0x00ff00), new three_1.Color(0x0000ff),
                    new three_1.Color(0xffff00), new three_1.Color(0xff00ff)
                ],
                confettiColors: options.confettiColors || [
                    new three_1.Color(0xff0000), new three_1.Color(0x00ff00), new three_1.Color(0x0000ff),
                    new three_1.Color(0xffff00), new three_1.Color(0xff00ff), new three_1.Color(0x00ffff),
                    new three_1.Color(0xffaa00)
                ]
            };
            const maxParticles = this.options.maxParticles;
            this.positions = new Float32Array(maxParticles * 3);
            this.colors = new Float32Array(maxParticles * 3);
            this.sizes = new Float32Array(maxParticles);
            this.rotations = new Float32Array(maxParticles);
            this.shapeTypes = new Float32Array(maxParticles);
            this.setupMaterial();
            this.setupParticleSystem();
        }
        setupMaterial() {
            const vertexShader = `
            attribute float size;
            attribute vec3 color;
            attribute float rotation;
            attribute float shapeType;
            
            varying vec3 vColor;
            varying float vRotation;
            varying float vShapeType;
            
            void main() {
                vColor = color;
                vRotation = rotation;
                vShapeType = shapeType;
                
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
            const fragmentShader = `
            varying vec3 vColor;
            varying float vRotation;
            varying float vShapeType;
            
            vec2 rotateUV(vec2 uv, float angle) {
                uv -= 0.5;
                float s = sin(angle);
                float c = cos(angle);
                mat2 rotMat = mat2(c, -s, s, c);
                uv = rotMat * uv;
                uv += 0.5;
                return uv;
            }
            
            void main() {
                vec2 rotatedUV = rotateUV(gl_PointCoord, vRotation);
                float alpha = 1.0;
                
                // Shape definitions
                if (vShapeType < 0.5) { // Circle
                    float dist = length(rotatedUV - 0.5);
                    if (dist > 0.5) discard;
                    alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                } else if (vShapeType < 1.5) { // Rectangle
                    vec2 coord = rotatedUV;
                    if (abs(coord.x - 0.5) > 0.25 || abs(coord.y - 0.5) > 0.4) discard;
                } else if (vShapeType < 2.5) { // Slim rectangle
                    vec2 coord = rotateUV(gl_PointCoord, vRotation + 0.785); // 45 degrees
                    if (abs(coord.x - 0.5) > 0.4 || abs(coord.y - 0.5) > 0.1) discard;
                } else { // Ring
                    float dist = length(gl_PointCoord - 0.5);
                    if (dist > 0.5 || dist < 0.3) discard;
                }
                
                gl_FragColor = vec4(vColor, alpha);
            }
        `;
            this.material = new three_1.ShaderMaterial({
                vertexShader,
                fragmentShader,
                uniforms: {},
                transparent: true,
                blending: three_1.AdditiveBlending,
                depthWrite: false
            });
        }
        setupParticleSystem() {
            this.geometry.setAttribute('position', new three_1.BufferAttribute(this.positions, 3));
            this.geometry.setAttribute('color', new three_1.BufferAttribute(this.colors, 3));
            this.geometry.setAttribute('size', new three_1.BufferAttribute(this.sizes, 1));
            this.geometry.setAttribute('rotation', new three_1.BufferAttribute(this.rotations, 1));
            this.geometry.setAttribute('shapeType', new three_1.BufferAttribute(this.shapeTypes, 1));
            this.particleSystem = new three_1.Points(this.geometry, this.material);
            this.scene.add(this.particleSystem);
        }
        spawnParticle() {
            if (this.particles.length >= this.options.maxParticles)
                return;
            const particle = {
                position: new three_1.Vector3(this.options.spawnPosition.x + (Math.random() - 0.5) * this.options.spawnArea.x, this.options.spawnPosition.y + (Math.random() - 0.5) * this.options.spawnArea.y, this.options.spawnPosition.z + (Math.random() - 0.5) * this.options.spawnArea.z),
                velocity: new three_1.Vector3(),
                startColor: new three_1.Color(),
                endColor: new three_1.Color(),
                size: this.options.particleSize,
                age: 0,
                lifetime: this.options.lifetime * (0.7 + Math.random() * 0.6),
                rotation: Math.random() * Math.PI * 2,
                angularVelocity: (Math.random() - 0.5) * Math.PI * 4,
                shapeType: Math.floor(Math.random() * 3) // 0-2 for circle, rectangle, slim rectangle
            };
            switch (this.options.type) {
                case 'confetti':
                    const color = this.options.confettiColors[Math.floor(Math.random() * this.options.confettiColors.length)];
                    particle.startColor = color.clone();
                    particle.endColor = color.clone().multiplyScalar(0.7);
                    particle.velocity.set((Math.random() - 0.5) * 8, 8 + Math.random() * 4, (Math.random() - 0.5) * 8);
                    particle.size = this.options.particleSize * (0.6 + Math.random() * 0.4);
                    particle.lifetime = Math.random() * 5;
                    particle.shapeType = Math.floor(Math.random() * 2) + 1; //Math.floor(Math.random() * 4); // 0-3 shapes
                    break;
                // Other particle types remain similar...
            }
            this.particles.push(particle);
        }
        update(deltaTime) {
            if (deltaTime <= 0)
                return;
            if (deltaTime >= .1)
                return;
            this.systemAge += deltaTime;
            let shouldSpawn = true;
            if (this.options.duration > 0 && this.systemAge >= this.options.duration) {
                shouldSpawn = false;
            }
            if (this.options.duration > 0 && this.systemAge >= this.options.duration + 10 * this.options.lifetime) {
                this.active = false;
            }
            // Spawn particles
            const spawnCount = Math.min(Math.floor(this.options.spawnRate * deltaTime), this.options.maxParticles - this.particles.length);
            if (shouldSpawn) {
                for (let i = 0; i < spawnCount; i++)
                    this.spawnParticle();
            }
            // Update particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.age += deltaTime;
                if (p.age >= p.lifetime) {
                    this.particles.splice(i, 1);
                    continue;
                }
                // Physics update
                p.velocity.y += this.options.gravity * deltaTime;
                if (this.options.type === 'confetti') {
                    p.velocity.multiplyScalar(1 - 0.1 * deltaTime); // Air resistance
                }
                p.position.add(p.velocity.clone().multiplyScalar(deltaTime));
                p.rotation += p.angularVelocity * deltaTime;
                // Color transition
                const lifeRatio = p.age / p.lifetime;
                p.startColor.lerp(p.endColor, lifeRatio);
                // Update buffers
                const idx = i * 3;
                this.positions[idx] = p.position.x;
                this.positions[idx + 1] = p.position.y;
                this.positions[idx + 2] = p.position.z;
                this.colors[idx] = p.startColor.r;
                this.colors[idx + 1] = p.startColor.g;
                this.colors[idx + 2] = p.startColor.b;
                this.sizes[i] = p.size * (1 - lifeRatio * 0.2);
                this.rotations[i] = p.rotation;
                this.shapeTypes[i] = p.shapeType;
            }
            // Hide particles that are beyond the current count
            for (let i = this.particles.length; i < this.options.maxParticles; i++) {
                const idx = i * 3;
                // Optionally reset position to avoid artifacts
                this.positions[idx] = 0;
                this.positions[idx + 1] = 0;
                this.positions[idx + 2] = 0;
                // Set size to 0 to make the particle invisible
                this.sizes[i] = 0;
            }
            // Update geometry
            this.geometry.attributes.position.needsUpdate = true;
            this.geometry.attributes.color.needsUpdate = true;
            this.geometry.attributes.size.needsUpdate = true;
            this.geometry.attributes.rotation.needsUpdate = true;
            this.geometry.attributes.shapeType.needsUpdate = true;
        }
        dispose() {
            this.scene.remove(this.particleSystem);
            this.geometry.dispose();
            this.material.dispose();
        }
        isActive() { return this.active; }
    }
    exports.ParticleSystem = ParticleSystem;
});
//# sourceMappingURL=ParticleSystem.js.map