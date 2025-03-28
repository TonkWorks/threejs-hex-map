define(["require", "exports", "three", "./ParticleSystem"], function (require, exports, three_1, ParticleSystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MainParticleEffects = exports.MeshSurfaceSampler = exports.createSpotlightEffect = exports.NuclearExplosion = exports.Rocket = exports.Explosion = void 0;
    exports.FireWithSmoke = FireWithSmoke;
    exports.SelectionParticles = SelectionParticles;
    exports.SelectionParticlesFromGeometry = SelectionParticlesFromGeometry;
    exports.HexDust = HexDust;
    exports.OceanGlimmer = OceanGlimmer;
    class Explosion {
        constructor(fromPosition, position, scene) {
            this.startColors = [
                new three_1.Color(0xFF0000), // Red
                new three_1.Color(0x6E5B4B), // Green
                new three_1.Color('white'),
            ];
            this.endColors = [
                new three_1.Color(0xFF0000),
                new three_1.Color('purple'),
            ];
            const direction = new three_1.Vector3().subVectors(position, fromPosition).normalize();
            this.particleSystem = new ParticleSystem_1.ParticleSystem(scene, {
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
            ParticleSystem_1.ParticleSystems.push(this.particleSystem);
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
            this.particleSystem = new ParticleSystem_1.ParticleSystem(scene, {
                maxParticles: 100,
                particleSize: 1,
                lifetime: this.duration,
                spawnRate: 0, // Disable automatic spawning
                spawnPosition: from,
                duration: 0, // No emission duration
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
            ParticleSystem_1.ParticleSystems.push(this.particleSystem);
            setTimeout(() => this.particleSystem.dispose(), 12000);
        }
    }
    exports.Rocket = Rocket;
    function FireWithSmoke(location, scene) {
        // Fire particle system
        const fireSystem = new ParticleSystem_1.ParticleSystem(scene, {
            maxParticles: 1000,
            particleSize: 10,
            lifetime: 10,
            spawnRate: 60,
            spawnPosition: location,
            spawnArea: new three_1.Vector3(2, 2, 0.1),
            gravity: 0.5, // Accelerate upward
            shape: 'circle',
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                for (let i = 0; i < spawnCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.4;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * .2;
                    system.addParticle({
                        position: new three_1.Vector3(location.x + x, location.y + y, location.z),
                        velocity: new three_1.Vector3(x * 0.75, y * 0.75, Math.random() * 1),
                        startColor: new three_1.Color(1, 1, 1),
                        endColor: new three_1.Color(0, 0, 0),
                        size: 5,
                        age: 0,
                        lifetime: 6 + Math.random() * 8,
                        rotation: Math.random() * Math.PI * 2,
                        angularVelocity: (Math.random() - 0.5) * Math.PI * 2,
                        shapeType: 0
                    });
                }
            },
            onUpdateParticle: (particle, deltaTime, system) => {
                particle.age += deltaTime;
                particle.velocity.z += system.options.gravity * deltaTime;
                particle.position.addScaledVector(particle.velocity, deltaTime);
                particle.rotation += particle.angularVelocity * deltaTime;
                particle.startColor.lerp(particle.endColor, particle.age / particle.lifetime);
                // Add turbulence
                particle.velocity.x += (Math.random() - 0.5) * 0.1 * deltaTime;
                particle.velocity.y += (Math.random() - 0.5) * 0.1 * deltaTime;
            }
        });
        // Smoke particle system
        const smokeSystem = new ParticleSystem_1.ParticleSystem(scene, {
            maxParticles: 500,
            particleSize: 2.5,
            lifetime: 6,
            spawnRate: 60,
            spawnPosition: location,
            spawnArea: new three_1.Vector3(0.3, 0.3, 0.3),
            gravity: 0.5, // Decelerate upward movement
            shape: 'square',
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                for (let i = 0; i < spawnCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.4;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    system.addParticle({
                        position: new three_1.Vector3(location.x + x, location.y + y, location.z),
                        velocity: new three_1.Vector3(x * 0.5, y * 0.5, 2 + Math.random() * 1),
                        startColor: new three_1.Color('#555555'),
                        endColor: new three_1.Color(0, 0, 0),
                        size: this.particleSize * (1 + Math.random() * 0.5),
                        age: 0,
                        lifetime: 14 + Math.random() * 6,
                        rotation: Math.random() * Math.PI * 2,
                        angularVelocity: (Math.random() - 0.5) * Math.PI * 0.5,
                        shapeType: 0 // Rotated rectangle shape
                    });
                }
            },
            onUpdateParticle: (particle, deltaTime, system) => {
                particle.age += deltaTime;
                particle.velocity.z += system.options.gravity * deltaTime;
                particle.position.addScaledVector(particle.velocity, deltaTime);
                particle.rotation += particle.angularVelocity * deltaTime;
                particle.startColor.lerp(particle.endColor, particle.age / particle.lifetime);
                // Add turbulence and size growth
                particle.velocity.x += (Math.random() - 0.5) * 0.1 * deltaTime;
                particle.velocity.y += (Math.random() - 0.5) * 0.1 * deltaTime;
                particle.size = system.options.particleSize * (1 + (particle.age / particle.lifetime) * 2);
            }
        });
        ParticleSystem_1.ParticleSystems.push(fireSystem, smokeSystem);
        //ParticleSystems.push(fireSystem);
    }
    class NuclearExplosion {
        constructor(position, scene) {
            this.blastPosition = position.clone();
            // Initial flash and core column
            this.coreSystem = new ParticleSystem_1.ParticleSystem(scene, {
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
            this.mushroomSystem = new ParticleSystem_1.ParticleSystem(scene, {
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
            this.groundFlashSystem = new ParticleSystem_1.ParticleSystem(scene, {
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
            ParticleSystem_1.ParticleSystems.push(this.coreSystem, this.mushroomSystem, this.groundFlashSystem);
            setTimeout(() => this.dispose(), 20000);
        }
        dispose() {
            this.coreSystem.dispose();
            this.mushroomSystem.dispose();
            this.groundFlashSystem.dispose();
        }
    }
    exports.NuclearExplosion = NuclearExplosion;
    const createSpotlightEffect = (scene, position) => {
        const spotlight = new ParticleSystem_1.ParticleSystem(scene, {
            maxParticles: 1500,
            particleSize: 5,
            lifetime: 4,
            spawnRate: 120,
            spawnPosition: new three_1.Vector3(position.x, position.y, 20), // Beam origin (top position)
            spawnArea: new three_1.Vector3(1.5, 1.5, 25), // Cylindrical spawn area (radius 1.5, height 25)
            gravity: -0.2, // Gentle downward acceleration
            shape: 'circle',
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                for (let i = 0; i < spawnCount; i++) {
                    // Generate cylindrical coordinates
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * system.options.spawnArea.x;
                    const verticalPos = Math.random() * system.options.spawnArea.z;
                    const x = system.options.spawnPosition.x + Math.cos(angle) * radius;
                    const y = system.options.spawnPosition.y + Math.sin(angle) * radius;
                    const z = system.options.spawnPosition.z - verticalPos;
                    // Calculate swirling velocity
                    const swirlSpeed = 0.8;
                    const velocityX = -Math.sin(angle) * swirlSpeed;
                    const velocityY = Math.cos(angle) * swirlSpeed;
                    const velocityZ = -0.3; // Base downward speed
                    system.addParticle({
                        position: new three_1.Vector3(x, y, z),
                        velocity: new three_1.Vector3(velocityX, velocityY, velocityZ),
                        startColor: new three_1.Color(0.9, 0.9, 1.0), // Bright white-blue
                        endColor: new three_1.Color(0.3, 0.3, 0.6), // Deep blue
                        size: system.options.particleSize,
                        age: 0,
                        lifetime: system.options.lifetime,
                        rotation: Math.random() * Math.PI * 2,
                        angularVelocity: (Math.random() - 0.5) * Math.PI * 0.3,
                        shapeType: 0 // Circle particles
                    });
                }
            },
            onUpdateParticle: (particle, deltaTime, system) => {
                particle.age += deltaTime;
                // Apply natural movement
                particle.position.addScaledVector(particle.velocity, deltaTime);
                // Add turbulence to velocity
                particle.velocity.x += (Math.random() - 0.5) * 0.1;
                particle.velocity.y += (Math.random() - 0.5) * 0.1;
                // Maintain swirling motion
                const centerDistance = particle.position.distanceTo(system.options.spawnPosition);
                if (centerDistance > 0.1) {
                    const centripetalForce = 0.1 * deltaTime;
                    particle.velocity.x -= (particle.position.x - system.options.spawnPosition.x) * centripetalForce;
                    particle.velocity.y -= (particle.position.y - system.options.spawnPosition.y) * centripetalForce;
                }
                // Update visual properties
                particle.rotation += particle.angularVelocity * deltaTime;
                const ageRatio = particle.age / particle.lifetime;
                // Fade color and size
                particle.startColor.lerp(particle.endColor, ageRatio);
                particle.size = system.options.particleSize * (1 - ageRatio * 0.7);
            }
        });
        ParticleSystem_1.ParticleSystems.push(spotlight);
        return spotlight;
    };
    exports.createSpotlightEffect = createSpotlightEffect;
    function SelectionParticles(scene, position, radius = 0.65) {
        // Precompute vertices for a flat‐topped regular hexagon.
        // We use an offset of π/6 so that the hexagon has flat top and bottom.
        const hexVertices = [];
        for (let i = 0; i < 6; i++) {
            const angle = (2 * Math.PI * i) / 6 + Math.PI / 6;
            hexVertices.push(new three_1.Vector2(radius * Math.cos(angle), radius * Math.sin(angle)));
        }
        const selectParticle = new ParticleSystem_1.ParticleSystem(scene, {
            maxParticles: 15000,
            particleSize: 0.5,
            lifetime: 3,
            spawnRate: 200,
            spawnPosition: position,
            // We no longer use a circular spawn area since we’ll position along the hexagon perimeter.
            spawnArea: new three_1.Vector3(0, 0, 0),
            gravity: 0,
            shape: 'circle',
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                for (let i = 0; i < spawnCount; i++) {
                    // Choose a random edge (side) of the hexagon.
                    const side = Math.floor(Math.random() * 6);
                    const t = Math.random(); // fraction along this side
                    // Interpolate between the current vertex and the next.
                    const currentVertex = hexVertices[side];
                    const nextVertex = hexVertices[(side + 1) % 6];
                    const offset = new three_1.Vector2().lerpVectors(currentVertex, nextVertex, t);
                    // Define a subtle upward drift speed (in units per second).
                    const verticalSpeed = 0.75 + Math.random() * 0.19;
                    system.addParticle({
                        position: new three_1.Vector3(system.options.spawnPosition.x + offset.x, system.options.spawnPosition.y + offset.y, system.options.spawnPosition.z),
                        velocity: new three_1.Vector3(0, 0, 0), // velocity not used in update
                        startColor: new three_1.Color(1, 0.9, 0.6),
                        endColor: new three_1.Color(1, 0.5, 0.2),
                        size: system.options.particleSize * (0.8 + Math.random() * 0.4),
                        age: 0,
                        lifetime: system.options.lifetime * (0.8 + Math.random() * 0.4),
                        rotation: 0,
                        angularVelocity: 0,
                        shapeType: 3, // Use the hexagon branch in your fragment shader
                        data: {
                            // Store the fixed x–y offset relative to spawnPosition.
                            offset: offset,
                            baseZ: system.options.spawnPosition.z,
                            verticalSpeed: verticalSpeed
                        }
                    });
                }
            },
            onUpdateParticle: (particle, deltaTime, system) => {
                particle.age += deltaTime;
                const data = particle.data;
                // x and y remain fixed (the particle stays on its spawned hexagon position)
                // Only update the z-axis with a subtle, linear upward drift.
                particle.position.z = data.baseZ + particle.age * data.verticalSpeed;
                // Update size over lifetime (optional variation).
                particle.size =
                    system.options.particleSize *
                        (0.8 + Math.sin(particle.age * 5) * 0.2) *
                        (1 - particle.age / particle.lifetime);
                // Fade the color over the particle's lifetime.
                const colorProgress = particle.age / particle.lifetime;
                particle.startColor.lerp(particle.endColor, colorProgress * colorProgress);
                // No change to x–y or rotation.
            }
        });
        ParticleSystem_1.ParticleSystems.push(selectParticle);
        return selectParticle;
    }
    class MeshSurfaceSampler {
        constructor(mesh) {
            this.cumulativeAreas = [];
            this.totalArea = 0;
            this.mesh = mesh;
            this.geometry = mesh.geometry;
            this.build();
        }
        build() {
            const geometry = this.geometry;
            const positionAttr = geometry.attributes.position;
            if (!positionAttr) {
                throw new Error('MeshSurfaceSampler: Geometry must have a position attribute.');
            }
            const indexAttr = geometry.index;
            const faceCount = indexAttr ? indexAttr.count / 3 : positionAttr.count / 3;
            this.cumulativeAreas = new Array(faceCount);
            let cumulativeArea = 0;
            const vA = new three_1.Vector3(), vB = new three_1.Vector3(), vC = new three_1.Vector3();
            for (let i = 0; i < faceCount; i++) {
                if (indexAttr) {
                    const a = indexAttr.getX(i * 3);
                    const b = indexAttr.getX(i * 3 + 1);
                    const c = indexAttr.getX(i * 3 + 2);
                    vA.fromBufferAttribute(positionAttr, a);
                    vB.fromBufferAttribute(positionAttr, b);
                    vC.fromBufferAttribute(positionAttr, c);
                }
                else {
                    vA.fromBufferAttribute(positionAttr, i * 3);
                    vB.fromBufferAttribute(positionAttr, i * 3 + 1);
                    vC.fromBufferAttribute(positionAttr, i * 3 + 2);
                }
                const area = this.triangleArea(vA, vB, vC);
                cumulativeArea += area;
                this.cumulativeAreas[i] = cumulativeArea;
            }
            this.totalArea = cumulativeArea;
            return this;
        }
        // Compute area of triangle ABC
        triangleArea(a, b, c) {
            const ab = new three_1.Vector3().subVectors(b, a);
            const ac = new three_1.Vector3().subVectors(c, a);
            const cross = new three_1.Vector3().crossVectors(ab, ac);
            return 0.5 * cross.length();
        }
        /**
         * Samples a random point on the surface.
         * @param target A Vector3 to store the sampled point (in world space).
         * @returns The target vector containing the sampled point.
         */
        sample(target) {
            // Pick a random value in [0, totalArea)
            const r = Math.random() * this.totalArea;
            // Binary search to select a triangle weighted by area.
            let low = 0, high = this.cumulativeAreas.length - 1;
            while (low < high) {
                const mid = Math.floor((low + high) / 2);
                if (r < this.cumulativeAreas[mid]) {
                    high = mid;
                }
                else {
                    low = mid + 1;
                }
            }
            const faceIndex = low;
            // Retrieve vertices for the selected face.
            const geometry = this.geometry;
            const positionAttr = geometry.attributes.position;
            const indexAttr = geometry.index;
            const a = new three_1.Vector3(), b = new three_1.Vector3(), c = new three_1.Vector3();
            if (indexAttr) {
                a.fromBufferAttribute(positionAttr, indexAttr.getX(faceIndex * 3));
                b.fromBufferAttribute(positionAttr, indexAttr.getX(faceIndex * 3 + 1));
                c.fromBufferAttribute(positionAttr, indexAttr.getX(faceIndex * 3 + 2));
            }
            else {
                a.fromBufferAttribute(positionAttr, faceIndex * 3);
                b.fromBufferAttribute(positionAttr, faceIndex * 3 + 1);
                c.fromBufferAttribute(positionAttr, faceIndex * 3 + 2);
            }
            // Generate random barycentric coordinates.
            const r1 = Math.random();
            const r2 = Math.random();
            const sqrtR1 = Math.sqrt(r1);
            const baryA = 1 - sqrtR1;
            const baryB = sqrtR1 * (1 - r2);
            const baryC = sqrtR1 * r2;
            // Interpolate to get the sample point.
            target.set(0, 0, 0);
            target.addScaledVector(a, baryA);
            target.addScaledVector(b, baryB);
            target.addScaledVector(c, baryC);
            // Transform the point to world space using the mesh's matrix.
            target.applyMatrix4(this.mesh.matrixWorld);
            return target;
        }
    }
    exports.MeshSurfaceSampler = MeshSurfaceSampler;
    function SelectionParticlesFromGeometry(scene, mesh, // Using a mesh to sample its surface (e.g. the ground)
    verticalDrift = .3 // Base upward speed for the initial dust kick
    ) {
        // Build a surface sampler for the mesh's geometry.
        const sampler = new MeshSurfaceSampler(mesh).build();
        const selectParticle = new ParticleSystem_1.ParticleSystem(scene, {
            maxParticles: 15000,
            particleSize: .55,
            lifetime: .8, // Slightly longer lifetime to let the effect evolve
            spawnRate: 5000,
            // spawnPosition and spawnArea aren’t used because we sample from the mesh.
            spawnPosition: new three_1.Vector3(),
            spawnArea: new three_1.Vector3(),
            duration: .25,
            gravity: .05, // Gravity (a downward acceleration) that slows the upward burst
            shape: 'circle', // or 'hexagon' if your shader supports it.
            // Material options to get a glowing, additive-blended effect:
            //   materialOptions: {
            //     blending: AdditiveBlending,
            //     transparent: true,
            //     depthWrite: false,
            //     // Optionally disable lighting if supported by your system:
            //     lights: false
            //   },
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                for (let i = 0; i < spawnCount; i++) {
                    // Sample a random point on the mesh surface (i.e. the ground)
                    const point = new three_1.Vector3();
                    sampler.sample(point);
                    // If the mesh is transformed, update its world matrix:
                    mesh.updateMatrixWorld();
                    // Uncomment if needed:
                    // point.applyMatrix4(mesh.matrixWorld);
                    // Create an initial velocity vector:
                    // - A small random horizontal push to scatter dust
                    // - A stronger upward kick to simulate the burst from the ground
                    const initialVelocity = new three_1.Vector3((Math.random() - 0.5) * 0.5, // random horizontal (x)
                    (Math.random() - 0.5) * 0.5, // random horizontal (y)
                    verticalDrift + Math.random() * 0.25 // upward (z) with randomness
                    );
                    system.addParticle({
                        position: new three_1.Vector3(point.x, point.y, point.z),
                        velocity: initialVelocity,
                        // Start with a bright, warm color (like a glow from the ground)
                        startColor: new three_1.Color(1, .1, 0.3),
                        // Fade toward a dustier, orange hue as the particle rises
                        endColor: new three_1.Color(1, 0.6, 0.2),
                        size: system.options.particleSize * (0.8 + Math.random() * 0.8),
                        age: 0,
                        lifetime: system.options.lifetime * (0.8 + Math.random() * 0.6),
                        rotation: 0,
                        angularVelocity: 0,
                        shapeType: 0, // Adjust if you want a different shape.
                        data: {} // No extra data needed with integrated velocity.
                    });
                }
            },
            onUpdateParticle: (particle, deltaTime, system) => {
                // Increase the particle's age.
                particle.age += deltaTime;
                // Update the particle's position by integrating its velocity.
                // This now includes both the initial dust kick and the horizontal spread.
                particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
                // Apply a gravity effect (reducing the upward velocity over time).
                particle.velocity.z -= system.options.gravity * deltaTime;
                // Update the particle's size:
                // It can expand slightly as it rises before fading out.
                const progress = particle.age / particle.lifetime;
                particle.size =
                    system.options.particleSize *
                        (1 + progress * 0.5) * // Slight expansion over time.
                        (1 - progress); // Then taper off.
                // Fade the particle's color over time.
                // Using a squared progress for a smooth, nonlinear transition.
                const colorProgress = particle.age / particle.lifetime;
                particle.startColor.lerp(particle.endColor, colorProgress * colorProgress);
            }
        });
        ParticleSystem_1.ParticleSystems.push(selectParticle);
        return selectParticle;
    }
    function HexDust(scene, position, radius = 1, verticalDrift = .3 // Base upward speed for the initial dust kick
    ) {
        const selectParticle = new ParticleSystem_1.ParticleSystem(scene, {
            maxParticles: 15000,
            particleSize: .55,
            lifetime: .8, // Slightly longer lifetime to let the effect evolve
            spawnRate: 5000,
            spawnPosition: position,
            spawnArea: new three_1.Vector3(),
            duration: .25,
            gravity: .05, // Gravity (a downward acceleration) that slows the upward burst
            shape: 'circle', // Using hexagon shape now
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                // Define the hexagon vertices
                const hexVertices = [];
                for (let i = 0; i < 6; i++) {
                    const angle = (2 * Math.PI * i) / 6 + Math.PI / 2; // Add Math.PI/2 for rotation
                    hexVertices.push(new three_1.Vector2(radius * Math.cos(angle), radius * Math.sin(angle)));
                }
                for (let i = 0; i < spawnCount; i++) {
                    // Choose a random edge (side) of the hexagon
                    const side = Math.floor(Math.random() * 6);
                    const t = Math.random(); // Random position along this side (0 to 1)
                    // Get the vertices of this side
                    const v1 = hexVertices[side];
                    const v2 = hexVertices[(side + 1) % 6];
                    // Interpolate between vertices to get a point along the edge
                    const offsetX = v1.x + (v2.x - v1.x) * t;
                    const offsetY = v1.y + (v2.y - v1.y) * t;
                    const initialVelocity = new three_1.Vector3((Math.random() - 0.5) * 0.5, // random horizontal (x)
                    (Math.random() - 0.5) * 0.5, // random horizontal (y)
                    verticalDrift + Math.random() * 0.25 // upward (z) with randomness
                    );
                    system.addParticle({
                        // Use the sampled point from the ring geometry
                        position: new three_1.Vector3(system.options.spawnPosition.x + offsetX, system.options.spawnPosition.y + offsetY, system.options.spawnPosition.z),
                        velocity: initialVelocity,
                        // Start with a bright, warm color (like a glow from the ground)
                        startColor: new three_1.Color(1, .1, 0.3),
                        // Fade toward a dustier, orange hue as the particle rises
                        endColor: new three_1.Color(1, 0.6, 0.2),
                        size: system.options.particleSize * (0.8 + Math.random() * 0.8),
                        age: 0,
                        lifetime: system.options.lifetime * (0.8 + Math.random() * 0.6),
                        rotation: 0,
                        angularVelocity: 0,
                        shapeType: 0, // Adjust if you want a different shape.
                        data: {} // No extra data needed with integrated velocity.
                    });
                }
            },
            onUpdateParticle: (particle, deltaTime, system) => {
                // Increase the particle's age.
                particle.age += deltaTime;
                // Update the particle's position by integrating its velocity.
                // This now includes both the initial dust kick and the horizontal spread.
                particle.position.add(particle.velocity.clone().multiplyScalar(deltaTime));
                // Apply a gravity effect (reducing the upward velocity over time).
                particle.velocity.z -= system.options.gravity * deltaTime;
                // Update the particle's size:
                // It can expand slightly as it rises before fading out.
                const progress = particle.age / particle.lifetime;
                particle.size =
                    system.options.particleSize *
                        (1 + progress * 0.5) * // Slight expansion over time.
                        (1 - progress); // Then taper off.
                // Fade the particle's color over time.
                // Using a squared progress for a smooth, nonlinear transition.
                const colorProgress = particle.age / particle.lifetime;
                particle.startColor.lerp(particle.endColor, colorProgress * colorProgress);
            }
        });
        ParticleSystem_1.ParticleSystems.push(selectParticle);
        return selectParticle;
    }
    // Civilization VI inspired particle effects for isometric hex map
    class MainParticleEffects {
        // Static methods to create different effects
        static createHexSelection(position, scene) {
            // Hex selection effect - glowing border with light pulse
            const hexSelectionSystem = new ParticleSystem_1.ParticleSystem(scene, {
                maxParticles: 600,
                particleSize: 80,
                lifetime: 0.5, // Half second duration
                spawnRate: 300,
                spawnPosition: position.clone(),
                gravity: 0,
                shape: 'circle',
                duration: 0.5,
                onSpawn: (system, deltaTime) => {
                    const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                    for (let i = 0; i < spawnCount; i++) {
                        // Create particles along hex border
                        const angle = (i / spawnCount) * Math.PI * 2;
                        const radius = 1.8 + Math.random() * 0.1; // Hex radius
                        system.addParticle({
                            position: new three_1.Vector3(position.x + Math.cos(angle) * radius, position.y + Math.sin(angle) * radius, position.z + 0.1),
                            velocity: new three_1.Vector3(0, 0, Math.random() * 0.5),
                            startColor: new three_1.Color(0.9, 0.8, 0.2), // Golden glow
                            endColor: new three_1.Color(0.9, 0.5, 0.1), // Fades to orange
                            size: 80 + Math.random() * 0.2,
                            age: 0,
                            lifetime: 0.5 + Math.random() * 0.2,
                            rotation: angle,
                            angularVelocity: 0,
                            shapeType: 0, // Using hexagon shape
                            data: { isHexBorder: true }
                        });
                    }
                },
                onUpdateParticle: (particle, deltaTime) => {
                    particle.age += deltaTime;
                    const lifeRatio = particle.age / particle.lifetime;
                    // Pulsing effect
                    const pulsePhase = (lifeRatio * 6) % 1;
                    const pulseScale = 1 + 0.2 * Math.sin(pulsePhase * Math.PI * 2);
                    particle.size *= 20 + pulseScale;
                    // Color transition
                    particle.startColor.lerp(particle.endColor, lifeRatio);
                    // Fade out at the end
                    const opacity = lifeRatio > 0.7 ? 1 - ((lifeRatio - 0.7) / 0.3) : 1;
                    particle.startColor.multiplyScalar(opacity);
                    // Slight drift
                    particle.position.addScaledVector(particle.velocity, deltaTime);
                }
            });
            // Cleanup after effect duration
            setTimeout(() => hexSelectionSystem.dispose(), 800);
            ParticleSystem_1.ParticleSystems.push(hexSelectionSystem);
            return hexSelectionSystem;
        }
        static createObjectCreation(position, scene) {
            // Object creation effect - rising particles with converging rays
            const creationSystem = new ParticleSystem_1.ParticleSystem(scene, {
                maxParticles: 12000,
                particleSize: 6,
                lifetime: 10, // Half second duration
                spawnRate: 4000,
                spawnPosition: position.clone(),
                gravity: -0.1,
                shape: 'circle',
                duration: .08,
                onSpawn: (system, deltaTime) => {
                    const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                    for (let i = 0; i < spawnCount; i++) {
                        // Determine particle type - either converging beam or rising sparkle
                        const particleType = Math.random() > 0.6 ? 'beam' : 'sparkle';
                        if (particleType === 'beam') {
                            // Converging beams from outside the hex toward center
                            const angle = Math.random() * Math.PI * 2;
                            const distanceFromCenter = 1.1 + Math.random() * 1;
                            system.addParticle({
                                position: new three_1.Vector3(position.x + Math.cos(angle) * distanceFromCenter, position.y + Math.sin(angle) * distanceFromCenter, position.z + 0.1),
                                velocity: new three_1.Vector3(-Math.cos(angle) * (5 + Math.random()), -Math.sin(angle) * (5 + Math.random()), Math.random() * 0.8),
                                startColor: new three_1.Color(0, 0, 1), // Bright blue
                                endColor: new three_1.Color(0.7, 0.9, 1.0), // Fade to white-blue
                                size: 1.5 + Math.random() * 0.1,
                                age: 0,
                                lifetime: 0.2,
                                rotation: angle,
                                angularVelocity: 0,
                                shapeType: 1, // Use line shape for beams
                                data: { type: 'beam' }
                            });
                        }
                        else {
                            // Rising sparkles from the center
                            const angle = Math.random() * Math.PI * 2;
                            const radius = Math.random() * 1.2;
                            system.addParticle({
                                position: new three_1.Vector3(position.x + Math.cos(angle) * radius * 0.5, position.y + Math.sin(angle) * radius * 0.5, position.z),
                                velocity: new three_1.Vector3((Math.random() - 0.5) * 1.02, (Math.random() - 0.5) * 1.5, 3 + Math.random() * 2),
                                startColor: new three_1.Color(0.9, 0.9, 1.0), // White-blue
                                endColor: new three_1.Color(0.3, 0.3, 0.9), // Blue
                                size: 0.1 + Math.random() * 0.2,
                                age: 0,
                                lifetime: .2 + Math.random() * 3,
                                rotation: Math.random() * Math.PI * 2,
                                angularVelocity: (Math.random() - 0.5) * Math.PI,
                                shapeType: 0, // Star shape for sparkles
                                data: { type: 'sparkle' }
                            });
                        }
                    }
                },
                onUpdateParticle: (particle, deltaTime) => {
                    particle.age += deltaTime;
                    const lifeRatio = particle.age / particle.lifetime;
                    // Different behavior based on particle type
                    if (particle.data && particle.data.type === 'beam') {
                        // Beams get thinner as they approach center
                        particle.size *= 0.95;
                        // Accelerate toward center
                        particle.velocity.multiplyScalar(1.05);
                        // Fade out near the end
                        if (lifeRatio > 0.7) {
                            particle.startColor.multiplyScalar(0.9);
                        }
                    }
                    else {
                        // Sparkles rise and expand
                        particle.velocity.z *= 0.98; // Slow down ascent
                        // Rotate sparkles
                        particle.rotation += particle.angularVelocity * deltaTime;
                        // Fade based on lifetime
                        const fadeOpacity = lifeRatio > 0.6 ? 1 - ((lifeRatio - 0.6) / 0.4) : 1;
                        particle.startColor.multiplyScalar(fadeOpacity);
                        // // Grow slightly then shrink
                        // const sizeMultiplier = lifeRatio < 0.3 ? 1.03 : 0.97;
                        // particle.size *= sizeMultiplier;
                    }
                    // Common updates
                    particle.startColor.lerp(particle.endColor, lifeRatio);
                    particle.position.addScaledVector(particle.velocity, deltaTime);
                }
            });
            // Cleanup after effect duration
            setTimeout(() => creationSystem.dispose(), 4000);
            ParticleSystem_1.ParticleSystems.push(creationSystem);
            return creationSystem;
        }
        // Additional helper method to combine both effects for showing construction
        static createBuildEffect(position, scene) {
            // First show selection
            this.createHexSelection(position, scene);
            // Then after a brief delay, show creation
            setTimeout(() => {
                this.createObjectCreation(position, scene);
            }, 200);
        }
    }
    exports.MainParticleEffects = MainParticleEffects;
    function OceanGlimmer(scene, position, radius = 5, waveHeight = 0.2, waveSpeed = 0.5) {
        const oceanParticle = new ParticleSystem_1.ParticleSystem(scene, {
            maxParticles: 10000,
            particleSize: 0.3,
            lifetime: 2, // Particles fade out over time
            spawnRate: 2000,
            spawnPosition: position,
            spawnArea: new three_1.Vector3(radius * 2, radius * 2, 0), // Spread particles over a circular area
            gravity: 0, // No gravity for glimmer effect
            shape: 'circle',
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(Math.floor(system.options.spawnRate * deltaTime), system.options.maxParticles - system.particles.length);
                for (let i = 0; i < spawnCount; i++) {
                    // Random position within a circular area
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * radius;
                    const offsetX = Math.cos(angle) * distance;
                    const offsetY = Math.sin(angle) * distance;
                    // Create a subtle upward drift for the particles
                    const initialVelocity = new three_1.Vector3(0, 0, Math.random() * 0.1 // Slight upward movement
                    );
                    system.addParticle({
                        position: new three_1.Vector3(system.options.spawnPosition.x + offsetX, system.options.spawnPosition.y + offsetY, system.options.spawnPosition.z),
                        velocity: initialVelocity,
                        startColor: new three_1.Color(0.2, 0.5, 1), // Ocean blue
                        endColor: new three_1.Color(0.8, 0.9, 1), // Light blue shimmer
                        size: system.options.particleSize * (0.8 + Math.random() * 0.4),
                        age: 0,
                        lifetime: system.options.lifetime * (0.8 + Math.random() * 0.4),
                        rotation: 0,
                        angularVelocity: 0,
                        shapeType: 0, // Circular particles
                        data: {
                            waveOffset: Math.random() * Math.PI * 2 // Random phase for wave motion
                        }
                    });
                }
            },
            onUpdateParticle: (particle, deltaTime, system) => {
                particle.age += deltaTime;
                // Apply wave-like motion to the z-axis
                const wavePhase = particle.data.waveOffset + system.systemAge * waveSpeed;
                particle.position.z =
                    system.options.spawnPosition.z + Math.sin(wavePhase) * waveHeight;
                // Fade the particle's color over time
                const progress = particle.age / particle.lifetime;
                particle.startColor.lerp(particle.endColor, progress);
                // Update size to create a pulsing effect
                particle.size =
                    system.options.particleSize *
                        (1 + Math.sin(wavePhase) * 0.2) * // Pulsing with wave motion
                        (1 - progress); // Taper off as the particle fades
            }
        });
        ParticleSystem_1.ParticleSystems.push(oceanParticle);
        return oceanParticle;
    }
});
//# sourceMappingURL=ParticleSystemEffects.js.map