var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define(["require", "exports", "three"], function (require, exports, THREE) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    THREE = __importStar(THREE);
    class ParticleSystem {
        constructor(scene, options = {}) {
            this.scene = scene;
            this.particles = [];
            this.geometry = new THREE.BufferGeometry();
            // Set default options
            this.options = {
                maxParticles: options.maxParticles || 1000,
                particleSize: options.particleSize || 0.1,
                lifetime: options.lifetime || 2,
                spawnRate: options.spawnRate || 50,
                spawnArea: options.spawnArea || { x: 1, y: 1, z: 1 },
                gravity: options.gravity || -9.8,
                type: options.type || 'fire'
            };
            this.positions = new Float32Array(this.options.maxParticles * 3);
            this.colors = new Float32Array(this.options.maxParticles * 3);
            this.sizes = new Float32Array(this.options.maxParticles);
            this.setupMaterial();
            this.setupParticleSystem();
        }
        setupMaterial() {
            const vertexShader = `
            attribute float size;
            varying vec3 vColor;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
            const fragmentShader = `
            varying vec3 vColor;
            
            void main() {
                if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) discard;
                gl_FragColor = vec4(vColor, 1.0);
            }
        `;
            this.material = new THREE.ShaderMaterial({
                uniforms: {},
                vertexShader,
                fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
        }
        setupParticleSystem() {
            this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
            this.geometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
            this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
            this.particleSystem = new THREE.Points(this.geometry, this.material);
            this.scene.add(this.particleSystem);
        }
        spawnParticle() {
            const particle = {
                position: new THREE.Vector3((Math.random() - 0.5) * this.options.spawnArea.x, (Math.random() - 0.5) * this.options.spawnArea.y, (Math.random() - 0.5) * this.options.spawnArea.z),
                velocity: new THREE.Vector3(),
                color: new THREE.Color(),
                size: this.options.particleSize,
                age: 0,
                lifetime: this.options.lifetime * (0.7 + Math.random() * 0.6)
            };
            switch (this.options.type) {
                case 'fire':
                    particle.color.setHSL(0.05 + Math.random() * 0.05, 1, 0.5 + Math.random() * 0.2);
                    particle.velocity.set((Math.random() - 0.5) * 0.5, 2 + Math.random() * 1, (Math.random() - 0.5) * 0.5);
                    break;
                case 'explosion':
                    particle.color.setHSL(0.05 + Math.random() * 0.05, 1, 0.5 + Math.random() * 0.2);
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 2 + Math.random() * 3;
                    particle.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed, (Math.random() - 0.5) * speed);
                    break;
                case 'fireworks':
                    particle.color.setHSL(Math.random(), 1, 0.5 + Math.random() * 0.2);
                    const phi = Math.random() * Math.PI * 2;
                    const theta = Math.random() * Math.PI;
                    const speed2 = 2 + Math.random() * 2;
                    particle.velocity.set(Math.sin(theta) * Math.cos(phi) * speed2, Math.sin(theta) * Math.sin(phi) * speed2, Math.cos(theta) * speed2);
                    break;
                case 'confetti':
                    particle.color.setHSL(Math.random(), 0.8, 0.5 + Math.random() * 0.3);
                    particle.velocity.set((Math.random() - 0.5) * 2, 3 + Math.random() * 2, (Math.random() - 0.5) * 2);
                    break;
            }
            this.particles.push(particle);
        }
        update(deltaTime) {
            // Spawn new particles
            const particlesToSpawn = Math.floor(this.options.spawnRate * deltaTime);
            for (let i = 0; i < particlesToSpawn; i++) {
                if (this.particles.length < this.options.maxParticles) {
                    this.spawnParticle();
                }
            }
            // Update existing particles
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                particle.age += deltaTime;
                if (particle.age >= particle.lifetime) {
                    this.particles.splice(i, 1);
                    continue;
                }
                // Update velocity and position
                particle.velocity.y += this.options.gravity * deltaTime;
                particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
                // Update color and size based on age
                const lifeRatio = particle.age / particle.lifetime;
                particle.color.multiplyScalar(1 - lifeRatio * 0.1);
                particle.size = this.options.particleSize * (1 - lifeRatio * 0.5);
                // Update buffers
                const index = i * 3;
                this.positions[index] = particle.position.x;
                this.positions[index + 1] = particle.position.y;
                this.positions[index + 2] = particle.position.z;
                this.colors[index] = particle.color.r;
                this.colors[index + 1] = particle.color.g;
                this.colors[index + 2] = particle.color.b;
                this.sizes[i] = particle.size;
            }
            // Update geometry attributes
            this.geometry.attributes.position.needsUpdate = true;
            this.geometry.attributes.color.needsUpdate = true;
            this.geometry.attributes.size.needsUpdate = true;
        }
        dispose() {
            this.scene.remove(this.particleSystem);
            this.geometry.dispose();
            this.material.dispose();
        }
    }
    exports.default = ParticleSystem;
});
//# sourceMappingURL=Particles.js.map