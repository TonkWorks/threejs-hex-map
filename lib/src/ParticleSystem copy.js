define(["require", "exports", "three"], function (require, exports, three_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ParticleSystems = [];
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
                spawnPosition: options.spawnPosition ? options.spawnPosition.clone() : new three_1.Vector3(0, 0, 0),
                spawnArea: options.spawnArea ? options.spawnArea.clone() : new three_1.Vector3(0, 0, 0),
                gravity: options.gravity || -9.8,
                shape: options.shape || 'square',
                duration: options.duration || 0,
                onSpawn: options.onSpawn || this.defaultSpawn.bind(this),
                onUpdateParticle: options.onUpdateParticle || this.defaultUpdateParticle.bind(this)
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
                
                if (vShapeType < 0.5) {
                    float dist = length(rotatedUV - 0.5);
                    if (dist > 0.5) discard;
                    alpha = 1.0 - smoothstep(0.4, 0.5, dist);
                } else if (vShapeType < 1.5) {
                    if (abs(rotatedUV.x - 0.5) > 0.25 || abs(rotatedUV.y - 0.5) > 0.4) discard;
                } else if (vShapeType < 2.5) {
                    vec2 coord = rotateUV(gl_PointCoord, vRotation + 0.785);
                    if (abs(coord.x - 0.5) > 0.4 || abs(coord.y - 0.5) > 0.1) discard;
                } else {
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
        defaultSpawn(deltaTime) {
            const spawnCount = Math.min(Math.floor(this.options.spawnRate * deltaTime), this.options.maxParticles - this.particles.length);
            for (let i = 0; i < spawnCount; i++) {
                this.addParticle({
                    position: new three_1.Vector3(this.options.spawnPosition.x + (Math.random() - 0.5) * this.options.spawnArea.x, this.options.spawnPosition.y + (Math.random() - 0.5) * this.options.spawnArea.y, this.options.spawnPosition.z + (Math.random() - 0.5) * this.options.spawnArea.z),
                    velocity: new three_1.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, 2 + Math.random() * 2),
                    startColor: new three_1.Color(1, 0.8, 0),
                    endColor: new three_1.Color(1, 0.4, 0),
                    size: this.options.particleSize,
                    age: 0,
                    lifetime: this.options.lifetime,
                    rotation: Math.random() * Math.PI * 2,
                    angularVelocity: (Math.random() - 0.5) * Math.PI * 2,
                    shapeType: this.options.shape === 'circle' ? 0 : 1
                });
            }
        }
        defaultUpdateParticle(particle, deltaTime) {
            particle.age += deltaTime;
            particle.velocity.z += this.options.gravity * deltaTime;
            particle.position.addScaledVector(particle.velocity, deltaTime);
            // Ground collision and bounce
            if (particle.position.z < 0) {
                particle.velocity.z *= -0.6;
                particle.velocity.x *= 0.8;
                particle.velocity.y *= 0.8;
                particle.position.z = 0;
            }
            particle.rotation += particle.angularVelocity * deltaTime;
            particle.startColor.lerp(particle.endColor, particle.age / particle.lifetime);
        }
        addParticle(particle) {
            if (this.particles.length < this.options.maxParticles) {
                this.particles.push(particle);
            }
        }
        addParticles(particles) {
            const remaining = this.options.maxParticles - this.particles.length;
            this.particles.push(...particles.slice(0, remaining));
        }
        update(deltaTime) {
            if (deltaTime <= 0 || deltaTime >= 0.1)
                return;
            this.systemAge += deltaTime;
            let shouldSpawn = true;
            if (this.options.duration > 0) {
                shouldSpawn = this.systemAge <= this.options.duration;
                if (this.systemAge >= this.options.duration + this.options.lifetime) {
                    this.active = false;
                }
            }
            if (shouldSpawn) {
                this.options.onSpawn(this, deltaTime);
            }
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                this.options.onUpdateParticle(p, deltaTime, this);
                if (p.age >= p.lifetime) {
                    this.particles.splice(i, 1);
                    continue;
                }
                const idx = i * 3;
                this.positions[idx] = p.position.x;
                this.positions[idx + 1] = p.position.y;
                this.positions[idx + 2] = p.position.z;
                this.colors[idx] = p.startColor.r;
                this.colors[idx + 1] = p.startColor.g;
                this.colors[idx + 2] = p.startColor.b;
                this.sizes[i] = p.size * (1 - (p.age / p.lifetime) * 0.2);
                this.rotations[i] = p.rotation;
                this.shapeTypes[i] = p.shapeType;
            }
            for (let i = this.particles.length; i < this.options.maxParticles; i++) {
                const idx = i * 3;
                this.positions[idx] = 0;
                this.positions[idx + 1] = 0;
                this.positions[idx + 2] = 0;
                this.sizes[i] = 0;
            }
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
        isActive() {
            return this.active;
        }
    }
    exports.ParticleSystem = ParticleSystem;
    class Explosion {
        constructor(fromPosition, position, scene) {
            this.startColors = [
                new three_1.Color(0xFF0000),
                new three_1.Color(0x6E5B4B),
                new three_1.Color('white'),
            ];
            this.endColors = [
                new three_1.Color(0xFF0000),
                new three_1.Color('purple'),
            ];
            const direction = new three_1.Vector3().subVectors(position, fromPosition).normalize();
            this.particleSystem = new ParticleSystem(scene, {
                maxParticles: 1000,
                particleSize: 3,
                lifetime: 4,
                spawnRate: 1000,
                spawnPosition: position,
                spawnArea: new three_1.Vector3(0.15, 0.15, 0.0),
                gravity: -12,
                shape: 'square',
                duration: 0.1,
                onSpawn: (system, deltaTime) => {
                    const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                    for (let i = 0; i < spawnCount; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.random() * 0.5;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius;
                        const zVel = Math.random() * 10;
                        let startColor = this.startColors[Math.floor(Math.random() * this.startColors.length)];
                        let endColor = this.endColors[Math.floor(Math.random() * this.endColors.length)];
                        system.addParticle({
                            position: new three_1.Vector3(system.options.spawnPosition.x + x, system.options.spawnPosition.y + y, system.options.spawnPosition.z),
                            velocity: new three_1.Vector3(x * 7 * Math.random() + direction.x * 4 * Math.random(), y * .5 * Math.random() + direction.y * 1 * Math.random(), zVel),
                            startColor: new three_1.Color(startColor),
                            endColor: new three_1.Color(endColor),
                            size: Math.random() * this.particleSystem.options.particleSize,
                            age: 0,
                            lifetime: 3 + this.particleSystem.options.lifetime + Math.random(),
                            rotation: Math.random() * Math.PI * 2,
                            angularVelocity: (Math.random() - 0.5) * Math.PI * 4,
                            shapeType: Math.floor(Math.random() * 2) + 1
                        });
                    }
                }
            });
            exports.ParticleSystems.push(this.particleSystem);
        }
    }
    exports.Explosion = Explosion;
    class Rocket {
        constructor(from, to, scene, isNuke = false) {
            this.explosionTriggered = false;
            this.from = from.clone();
            this.to = to.clone();
            this.isNuke = isNuke;
            this.height = from.distanceTo(to) / 2;
            if (this.height < 2)
                this.height = 2;
            this.duration = from.distanceTo(to) / 8;
            if (this.duration < .5)
                this.duration = .5;
            this.particleSystem = new ParticleSystem(scene, {
                maxParticles: 100,
                particleSize: 1,
                lifetime: this.duration,
                spawnRate: 0,
                spawnPosition: from,
                duration: 0,
                gravity: -9.8,
                shape: 'square',
                onUpdateParticle: (particle, deltaTime, system) => {
                    if (particle.data && particle.data.isRocket) {
                        // Rocket particle update
                        particle.age += deltaTime;
                        const t = Math.min(particle.age / particle.lifetime, 1);
                        // Calculate parabolic trajectory
                        const progress = new three_1.Vector3().lerpVectors(this.from, this.to, t);
                        const arcHeight = this.height * Math.sin(t * Math.PI);
                        progress.z += arcHeight;
                        particle.position.copy(progress);
                        // Add trail particle
                        if (system.particles.length < system.options.maxParticles) {
                            const randomColor = Math.random();
                            let endColor;
                            if (randomColor < 0.33) {
                                endColor = new three_1.Color(1, 0.4, 0.2);
                            }
                            else if (randomColor < 0.66) {
                                endColor = new three_1.Color(0.2, 0.2, 0.2); // Dark grey
                            }
                            else {
                                endColor = new three_1.Color(1, 1, 1); // Bright white
                            }
                            system.addParticle({
                                position: progress.clone(),
                                velocity: new three_1.Vector3((Math.random() - 0.5) * 0.2, (Math.random() - 0.5) * 0.2, -1 - Math.random()),
                                startColor: new three_1.Color(0, 0, 0),
                                endColor: new three_1.Color(1, 0.4, 0.2),
                                size: Math.random() * 2,
                                age: 0,
                                lifetime: 0.8,
                                rotation: Math.random() * Math.PI * 2,
                                angularVelocity: (Math.random() - 0.5) * Math.PI,
                                shapeType: 1,
                                data: { isTrail: true }
                            });
                        }
                        // Trigger explosion at destination
                        if (t >= 1 && !this.explosionTriggered) {
                            this.explosionTriggered = true;
                            if (this.isNuke) {
                                const nuke = new NuclearExplosion(this.to, scene);
                                setTimeout(() => nuke.dispose(), 12000);
                            }
                            else {
                                new Explosion(this.from, this.to, scene);
                            }
                            // system.active = false; // Stop updating after explosion
                        }
                    }
                    else {
                        // Trail particle update
                        particle.age += deltaTime;
                        // particle.velocity.z += system.options.gravity * deltaTime;
                        particle.position.addScaledVector(particle.velocity, deltaTime);
                        particle.startColor.lerp(particle.endColor, particle.age / particle.lifetime);
                        particle.rotation += particle.angularVelocity * deltaTime;
                    }
                }
            });
            // Add main rocket particle
            this.particleSystem.addParticle({
                position: this.from.clone(),
                velocity: new three_1.Vector3(),
                startColor: new three_1.Color(1, 0.8, 0),
                endColor: new three_1.Color(1, 0.4, 0),
                size: 3,
                age: 0,
                lifetime: this.duration,
                rotation: 0,
                angularVelocity: 0,
                shapeType: 1,
                data: { isRocket: true }
            });
            exports.ParticleSystems.push(this.particleSystem);
        }
    }
    exports.Rocket = Rocket;
    class FireWithSmoke {
        constructor(position, scene, options = {}) {
            this.basePosition = position.clone();
            this.intensity = options.intensity || 1;
            this.particleSystem = new ParticleSystem(scene, {
                maxParticles: 400,
                particleSize: options.particleSize || 2,
                lifetime: 3,
                spawnRate: 40 * this.intensity,
                spawnPosition: this.basePosition,
                spawnArea: new three_1.Vector3(0.3, 0.3, 0.2),
                gravity: -10,
                shape: 'cloud',
                duration: options.duration || 0,
                onSpawn: (system, deltaTime) => {
                    const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                    for (let i = 0; i < spawnCount; i++) {
                        const isSmoke = Math.random() > 0.6;
                        const startColor = isSmoke
                            ? new three_1.Color(0.1, 0.1, 0.1)
                            : new three_1.Color(1, 0.5 + Math.random() * 0.3, 0);
                        const endColor = isSmoke
                            ? new three_1.Color(0.05, 0.05, 0.05)
                            : new three_1.Color(1, 0.2, 0);
                        system.addParticle({
                            position: new three_1.Vector3(system.options.spawnPosition.x + (Math.random() - 0.5) * system.options.spawnArea.x, system.options.spawnPosition.y + (Math.random() - 0.5) * system.options.spawnArea.y, system.options.spawnPosition.z + (Math.random() - 0.5) * system.options.spawnArea.z),
                            velocity: new three_1.Vector3((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 2 + Math.random() * 2 * this.intensity),
                            startColor: startColor,
                            endColor: endColor,
                            size: isSmoke
                                ? 2 + Math.random() * 3
                                : 1 + Math.random() * 2,
                            age: 0,
                            lifetime: isSmoke
                                ? 2 + Math.random() * 2
                                : 1 + Math.random(),
                            rotation: Math.random() * Math.PI * 2,
                            angularVelocity: (Math.random() - 0.5) * Math.PI,
                            shapeType: isSmoke ? 3 : 0,
                            data: { isSmoke }
                        });
                    }
                },
                onUpdateParticle: (particle, deltaTime) => {
                    // Common updates
                    particle.age += deltaTime;
                    particle.rotation += particle.angularVelocity * deltaTime;
                    particle.startColor.lerp(particle.endColor, particle.age / particle.lifetime);
                    if (particle.data && particle.data.isSmoke) {
                        // Smoke behavior
                        particle.velocity.z += 100 * deltaTime;
                        // particle.velocity.multiplyScalar(0.98);
                        particle.size *= 1.02;
                        // Add horizontal drift
                        particle.velocity.x += (Math.random() - 0.5) * 0.1;
                        particle.velocity.y += (Math.random() - 0.5) * 0.1;
                    }
                    else {
                        // Fire behavior
                        particle.velocity.z += 1.5 * deltaTime;
                        particle.velocity.multiplyScalar(0.95);
                        particle.size *= 0.97;
                    }
                    // Fade out particles
                    const lifeRatio = particle.age / particle.lifetime;
                    particle.size *= 1 - lifeRatio * 0.2;
                }
            });
            exports.ParticleSystems.push(this.particleSystem);
        }
        setIntensity(newIntensity) {
            this.intensity = Math.max(0, newIntensity);
            this.particleSystem.options.spawnRate = 40 * this.intensity;
        }
        dispose() {
            this.particleSystem.dispose();
            const index = exports.ParticleSystems.indexOf(this.particleSystem);
            if (index !== -1)
                exports.ParticleSystems.splice(index, 1);
        }
    }
    exports.FireWithSmoke = FireWithSmoke;
    class NuclearExplosion {
        constructor(position, scene) {
            this.blastPosition = position.clone();
            // Initial flash and core column
            this.coreSystem = new ParticleSystem(scene, {
                maxParticles: 1500,
                particleSize: 12,
                lifetime: 10,
                spawnRate: 2000,
                spawnPosition: this.blastPosition,
                spawnArea: new three_1.Vector3(2, 2, 0.5),
                gravity: -1.5,
                shape: 'cloud',
                duration: 0.8,
                onSpawn: (system, deltaTime) => {
                    const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                    for (let i = 0; i < spawnCount; i++) {
                        const phase = system.systemAge < 0.4 ? 'burst' :
                            system.systemAge < 1.2 ? 'column' : 'cap';
                        const startColor = phase === 'burst' ?
                            new three_1.Color(1, 0.9, 0.6) :
                            new three_1.Color(0.9, 0.4 + Math.random() * 0.2, 0.1);
                        const endColor = phase === 'burst' ?
                            new three_1.Color(1, 0.5, 0.1) :
                            new three_1.Color(0.3, 0.3, 0.3);
                        system.addParticle({
                            position: this.blastPosition.clone().add(new three_1.Vector3((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, 0)),
                            velocity: new three_1.Vector3(phase === 'burst' ? (Math.random() - 0.5) * 15 :
                                phase === 'column' ? (Math.random() - 0.5) * 2 :
                                    (Math.random() - 0.5) * 8, phase === 'burst' ? (Math.random() - 0.5) * 15 :
                                phase === 'column' ? (Math.random() - 0.5) * 2 :
                                    (Math.random() - 0.5) * 8, phase === 'burst' ? 40 + Math.random() * 20 :
                                phase === 'column' ? 25 + Math.random() * 10 :
                                    10 + Math.random() * 5),
                            startColor: startColor,
                            endColor: endColor,
                            size: phase === 'burst' ? 8 + Math.random() * 4 :
                                phase === 'column' ? 12 + Math.random() * 6 :
                                    20 + Math.random() * 10,
                            age: 0,
                            lifetime: phase === 'burst' ? 1.5 + Math.random() :
                                phase === 'column' ? 6 + Math.random() * 2 :
                                    8 + Math.random() * 3,
                            rotation: Math.random() * Math.PI * 2,
                            angularVelocity: (Math.random() - 0.5) * Math.PI * 0.5,
                            shapeType: phase === 'burst' ? 0 : 3,
                            data: { phase }
                        });
                    }
                },
                onUpdateParticle: (particle, deltaTime) => {
                    particle.age += deltaTime;
                    const lifeRatio = particle.age / particle.lifetime;
                    // Phase-specific behavior
                    switch (particle.data && particle.data.phase) {
                        case 'burst':
                            particle.velocity.multiplyScalar(0.92);
                            particle.size *= 0.97;
                            break;
                        case 'column':
                            particle.velocity.z *= 0.98;
                            particle.velocity.x *= 0.96;
                            particle.velocity.y *= 0.96;
                            particle.size *= 1.02;
                            break;
                        case 'cap':
                            particle.velocity.z = Math.max(particle.velocity.z * 0.95, 2);
                            particle.velocity.x *= 1.01;
                            particle.velocity.y *= 1.01;
                            particle.size *= 1.03;
                            break;
                    }
                    // Common updates
                    particle.startColor.lerp(particle.endColor, lifeRatio);
                    particle.rotation += particle.angularVelocity * deltaTime;
                    particle.size *= 1 - lifeRatio * 0.3;
                }
            });
            // Mushroom cloud formation system
            this.mushroomSystem = new ParticleSystem(scene, {
                maxParticles: 800,
                particleSize: 5,
                lifetime: 12,
                spawnRate: 300,
                spawnPosition: this.blastPosition,
                spawnArea: new three_1.Vector3(0, 0, 6),
                gravity: -0.5,
                shape: 'cloud',
                duration: 4,
                onSpawn: (system, deltaTime) => {
                    const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                    for (let i = 0; i < spawnCount; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const radius = Math.random() * 2;
                        system.addParticle({
                            position: new three_1.Vector3(this.blastPosition.x + Math.cos(angle) * radius + .25, this.blastPosition.y + Math.sin(angle) * radius + .25, this.blastPosition.z + 3.3 + Math.random() * 2),
                            velocity: new three_1.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4, 3 + Math.random() * 2),
                            startColor: new three_1.Color(0.8, 0.8, 0.8),
                            endColor: new three_1.Color(0.2, 0.2, 0.2),
                            size: 5 + Math.random() * 5,
                            age: 0,
                            lifetime: 20 + Math.random() * 5,
                            rotation: Math.random() * Math.PI * 2,
                            angularVelocity: (Math.random() - 0.5) * Math.PI * 0.2,
                            shapeType: 0,
                            data: { isMushroom: true }
                        });
                    }
                },
                onUpdateParticle: (particle, deltaTime) => {
                    particle.age += deltaTime;
                    const lifeRatio = particle.age / particle.lifetime;
                    // Mushroom cloud behavior
                    particle.velocity.z *= 1.55;
                    particle.velocity.x *= 1.02;
                    particle.velocity.y *= 1.02;
                    // Color and rotation updates
                    particle.startColor.lerp(particle.endColor, lifeRatio);
                    particle.rotation += particle.angularVelocity * deltaTime;
                    // Turbulence effect
                    particle.velocity.x += (Math.random() - 0.5) * 0.2;
                    particle.velocity.y += (Math.random() - 0.5) * 0.2;
                    // Size fade
                    particle.size *= 1 - lifeRatio * 0.1;
                }
            });
            // Ground flash system
            this.groundFlashSystem = new ParticleSystem(scene, {
                maxParticles: 4000,
                particleSize: 10,
                lifetime: 1.4,
                spawnRate: 4000,
                spawnPosition: this.blastPosition,
                gravity: 0,
                shape: 'circle',
                duration: 0.1,
                onSpawn: (system, deltaTime) => {
                    const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                    for (let i = 0; i < spawnCount; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 40 + Math.random() * .2;
                        system.addParticle({
                            position: this.blastPosition.clone(),
                            velocity: new three_1.Vector3(Math.cos(angle) * speed, Math.sin(angle) * speed, 3),
                            startColor: new three_1.Color(1, 0.9, 0.7),
                            endColor: new three_1.Color(1, 0.4, 0.1),
                            size: 25,
                            age: 0,
                            lifetime: 3,
                            rotation: 0,
                            angularVelocity: 0,
                            shapeType: 0
                        });
                    }
                },
                onUpdateParticle: (particle, deltaTime) => {
                    particle.age += deltaTime;
                    const lifeRatio = particle.age / particle.lifetime;
                    particle.size = particle.size * (1 + lifeRatio * 1.2);
                    particle.startColor.lerp(particle.endColor, lifeRatio);
                    particle.position.addScaledVector(particle.velocity, deltaTime);
                    particle.size *= 1 - lifeRatio;
                }
            });
            exports.ParticleSystems.push(this.coreSystem, this.mushroomSystem, this.groundFlashSystem);
        }
        dispose() {
            this.coreSystem.dispose();
            this.mushroomSystem.dispose();
            this.groundFlashSystem.dispose();
            exports.ParticleSystems = exports.ParticleSystems.filter(sys => sys !== this.coreSystem &&
                sys !== this.mushroomSystem &&
                sys !== this.groundFlashSystem);
        }
    }
    exports.NuclearExplosion = NuclearExplosion;
});
//# sourceMappingURL=ParticleSystem copy.js.map