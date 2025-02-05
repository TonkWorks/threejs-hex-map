import {
    Scene, Vector3, Color,
    BufferGeometry, BufferAttribute,
    ShaderMaterial, Points,
    AdditiveBlending
} from 'three';
import { ParticleSystem, ParticleSystems } from './ParticleSystem';

export class Explosion {
    private particleSystem: ParticleSystem;
    private startColors = [
        new Color(0xFF0000), // Red
        new Color(0x6E5B4B), // Green
        new Color('white'),
    ];
    private endColors = [
        new Color(0xFF0000),
        new Color('purple'),
    ];
    constructor(fromPosition: Vector3, position: Vector3, scene: Scene) {

        const direction = new Vector3().subVectors(position, fromPosition).normalize();

        this.particleSystem = new ParticleSystem(scene, {
            maxParticles: 1000,
            particleSize: 3,
            lifetime: 4,
            spawnRate: 1000,
            spawnPosition: position,
            spawnArea: new Vector3(0.15, 0.15, 0.0),
            gravity: -12,
            shape: 'square',
            duration: 0.1,
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(
                    Math.floor(system.options.spawnRate * deltaTime),
                    system.options.maxParticles - system.particles.length
                );
                for (let i = 0; i < spawnCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 0.5;
                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;
                    const zVel = Math.random() * 10;
                    
                    let startColor = this.startColors[Math.floor(Math.random() * this.startColors.length)];
                    let endColor = this.endColors[Math.floor(Math.random() * this.endColors.length)];

                    system.addParticle({
                        position: new Vector3(
                            system.options.spawnPosition.x + x,
                            system.options.spawnPosition.y + y,
                            system.options.spawnPosition.z
                        ),
                        velocity: new Vector3(
                            x * 7 * Math.random() + direction.x*4* Math.random(),
                            y * .5 * Math.random() + direction.y*1*Math.random(),
                            zVel
                        ),
                        startColor: new Color(startColor),
                        endColor: new Color(endColor),
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
        ParticleSystems.push(this.particleSystem);
    }
}

export class Rocket {
    private particleSystem: ParticleSystem;
    private explosionTriggered: boolean = false;
    private from: Vector3;
    private to: Vector3;
    private duration: number;
    private height: number;
    private isNuke: boolean;

    constructor(from: Vector3, to: Vector3, scene: Scene, isNuke: boolean = false) {
        this.from = from.clone();
        this.to = to.clone();
        this.isNuke = isNuke;
        this.height = from.distanceTo(to) / 2;
        if (this.height < 2) this.height = 2

        this.duration = from.distanceTo(to) / 8
        if (this.duration < .5) this.duration = .5

        this.particleSystem = new ParticleSystem(scene, {
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
                    const progress = new Vector3().lerpVectors(this.from, this.to, t);
                    const arcHeight = this.height * Math.sin(t * Math.PI);
                    progress.z += arcHeight;
                    particle.position.copy(progress);

                    // Add trail particle
                    if (system.particles.length < system.options.maxParticles) {
                        const randomColor = Math.random();
                        let endColor;
                        if (randomColor < 0.33) {
                            endColor = new Color(1, 0.4, 0.2);
                        } else if (randomColor < 0.66) {
                            endColor = new Color(0.2, 0.2, 0.2); // Dark grey
                        } else {
                            endColor = new Color(1, 1, 1); // Bright white
                        }

                        system.addParticle({
                            position: progress.clone(),
                            velocity: new Vector3(
                                (Math.random() - 0.5) * 0.2,
                                (Math.random() - 0.5) * 0.2,
                                -1 - Math.random()
                            ),
                            startColor: new Color(0, 0, 0),
                            endColor: new Color(1, 0.4, 0.2),
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
                        } else {
                            new Explosion(this.from, this.to, scene);
                        }
                        // system.active = false; // Stop updating after explosion
                    }
                } else {
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
            velocity: new Vector3(),
            startColor: new Color(1, 0.8, 0),
            endColor: new Color(1, 0.4, 0),
            size: 3,
            age: 0,
            lifetime: this.duration,
            rotation: 0,
            angularVelocity: 0,
            shapeType: 1,
            data: { isRocket: true }
        });

        ParticleSystems.push(this.particleSystem);
        setTimeout(() => this.particleSystem.dispose(), 12000);
    }
}

export function FireWithSmoke(location: Vector3, scene: Scene) {
    // Fire particle system
    const fireSystem = new ParticleSystem(scene, {
        maxParticles: 1000,
        particleSize: 10,
        lifetime: 10,
        spawnRate: 60,
        spawnPosition: location,
        spawnArea: new Vector3(2, 2, 0.1),
        gravity: 0.5, // Accelerate upward
        shape: 'circle',
        onSpawn: (system, deltaTime) => {
            const spawnCount = Math.min(
                Math.floor(system.options.spawnRate * deltaTime),
                system.options.maxParticles - system.particles.length
            );
            for (let i = 0; i < spawnCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 0.4;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * .2;
                system.addParticle({
                    position: new Vector3(
                        location.x + x,
                        location.y + y,
                        location.z
                    ),
                    velocity: new Vector3(
                        x * 0.75,
                        y * 0.75,
                        Math.random() * 1
                    ),
                    startColor: new Color(1, 1, 1),
                    endColor: new Color(0, 0, 0),
                    size: 5,
                    age: 0,
                    lifetime: 6 + Math.random()  * 8,
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
    const smokeSystem = new ParticleSystem(scene, {
        maxParticles: 500,
        particleSize: 2.5,
        lifetime: 6,
        spawnRate: 60,
        spawnPosition: location,
        spawnArea: new Vector3(0.3, 0.3, 0.3),
        gravity: 0.5, // Decelerate upward movement
        shape: 'square',
        onSpawn: (system, deltaTime) => {
            const spawnCount = Math.min(
                Math.floor(system.options.spawnRate * deltaTime),
                system.options.maxParticles - system.particles.length
            );
            for (let i = 0; i < spawnCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const radius = Math.random() * 0.4;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                system.addParticle({
                    position: new Vector3(
                        location.x + x,
                        location.y + y,
                        location.z
                    ),
                    velocity: new Vector3(
                        x * 0.5,
                        y * 0.5,
                        2 + Math.random() * 1
                    ),
                    startColor: new Color('#555555'),
                    endColor: new Color(0, 0, 0),
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

    ParticleSystems.push(fireSystem, smokeSystem);
    //ParticleSystems.push(fireSystem);
}

export class NuclearExplosion {
    private coreSystem: ParticleSystem;
    private mushroomSystem: ParticleSystem;
    private groundFlashSystem: ParticleSystem;
    private blastPosition: Vector3;

    constructor(position: Vector3, scene: Scene) {
        this.blastPosition = position.clone();

        // Initial flash and core column
        this.coreSystem = new ParticleSystem(scene, {
            maxParticles: 1500,
            particleSize: 12,
            lifetime: 10,
            spawnRate: 2000,
            spawnPosition: this.blastPosition,
            spawnArea: new Vector3(2, 2, 0.5),
            gravity: -1.5,
            shape: 'cloud',
            duration: 0.8,
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(
                    Math.floor(system.options.spawnRate * deltaTime),
                    system.options.maxParticles - system.particles.length
                );

                for (let i = 0; i < spawnCount; i++) {
                    const phase = system.systemAge < 0.4 ? 'burst' : 
                                system.systemAge < 1.2 ? 'column' : 'cap';
                    
                    const startColor = phase === 'burst' ? 
                        new Color(1, 0.9, 0.6) : 
                        new Color(0.9, 0.4 + Math.random()*0.2, 0.1);
                        
                    const endColor = phase === 'burst' ?
                        new Color(1, 0.5, 0.1) :
                        new Color(0.3, 0.3, 0.3);

                    system.addParticle({
                        position: this.blastPosition.clone().add(
                            new Vector3(
                                (Math.random() - 0.5) * 3,
                                (Math.random() - 0.5) * 3,
                                0
                            )
                        ),
                        velocity: new Vector3(
                            phase === 'burst' ? (Math.random() - 0.5) * 15 :
                            phase === 'column' ? (Math.random() - 0.5) * 2 : 
                            (Math.random() - 0.5) * 8,
                            
                            phase === 'burst' ? (Math.random() - 0.5) * 15 :
                            phase === 'column' ? (Math.random() - 0.5) * 2 : 
                            (Math.random() - 0.5) * 8,
                            
                            phase === 'burst' ? 40 + Math.random() * 20 :
                            phase === 'column' ? 25 + Math.random() * 10 :
                            10 + Math.random() * 5
                        ),
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
                switch(particle.data && particle.data.phase) {
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
            spawnArea: new Vector3(0, 0, 6),
            gravity: -0.5,
            shape: 'cloud',
            duration: 4,
            onSpawn: (system, deltaTime) => {
                const spawnCount = Math.min(
                    Math.floor(system.options.spawnRate * deltaTime),
                    system.options.maxParticles - system.particles.length
                );

                for (let i = 0; i < spawnCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const radius = Math.random() * 2;
                    
                    system.addParticle({
                        position: new Vector3(
                            this.blastPosition.x + Math.cos(angle) * radius + .25,
                            this.blastPosition.y + Math.sin(angle) * radius + .25,
                            this.blastPosition.z + 3.3 + Math.random() * 2
                        ),
                        velocity: new Vector3(
                            (Math.random() - 0.5) * 4,
                            (Math.random() - 0.5) * 4,
                            3 + Math.random() * 2
                        ),
                        startColor: new Color(0.8, 0.8, 0.8),
                        endColor: new Color(0.2, 0.2, 0.2),
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
                const spawnCount = Math.min(
                    Math.floor(system.options.spawnRate * deltaTime),
                    system.options.maxParticles - system.particles.length
                );

                for (let i = 0; i < spawnCount; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = 40 + Math.random() * .2;
                    
                    system.addParticle({
                        position: this.blastPosition.clone(),
                        velocity: new Vector3(
                            Math.cos(angle) * speed,
                            Math.sin(angle) * speed,
                            3
                        ),
                        startColor: new Color(1, 0.9, 0.7),
                        endColor: new Color(1, 0.4, 0.1),
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

        ParticleSystems.push(this.coreSystem, this.mushroomSystem, this.groundFlashSystem);
        setTimeout(() => this.dispose(), 20000);
    }

    public dispose(): void {
        this.coreSystem.dispose();
        this.mushroomSystem.dispose();
        this.groundFlashSystem.dispose();
    }
}
export const createSpotlightEffect = (scene: Scene, position: Vector3) => {
    const spotlight = new ParticleSystem(scene, {
        maxParticles: 1500,
        particleSize: 5,
        lifetime: 4,
        spawnRate: 120,
        spawnPosition: new Vector3(position.x, position.y, 20),  // Beam origin (top position)
        spawnArea: new Vector3(1.5, 1.5, 25),  // Cylindrical spawn area (radius 1.5, height 25)
        gravity: -0.2,                         // Gentle downward acceleration
        shape: 'circle',
        onSpawn: (system, deltaTime) => {
            const spawnCount = Math.min(
                Math.floor(system.options.spawnRate * deltaTime),
                system.options.maxParticles - system.particles.length
            );

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
                const velocityZ = -0.3;  // Base downward speed

                system.addParticle({
                    position: new Vector3(x, y, z),
                    velocity: new Vector3(velocityX, velocityY, velocityZ),
                    startColor: new Color(0.9, 0.9, 1.0),  // Bright white-blue
                    endColor: new Color(0.3, 0.3, 0.6),    // Deep blue
                    size: system.options.particleSize,
                    age: 0,
                    lifetime: system.options.lifetime,
                    rotation: Math.random() * Math.PI * 2,
                    angularVelocity: (Math.random() - 0.5) * Math.PI * 0.3,
                    shapeType: 0  // Circle particles
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

    ParticleSystems.push(spotlight);
    return spotlight;
};

export function SelectionParticles(scene: Scene, position: Vector3, radius: number = .65): ParticleSystem {
    const selectParticle =  new ParticleSystem(scene, {
        maxParticles: 15000,
        particleSize: 1.25,
        lifetime: 1.5,
        spawnRate: 600,
        spawnPosition: position,
        spawnArea: new Vector3(radius, 0, 0), // Using x-component for radius
        gravity: -1,
        shape: 'circle',
        onSpawn: (system, deltaTime) => {
            const spawnCount = Math.min(
                Math.floor(system.options.spawnRate * deltaTime),
                system.options.maxParticles - system.particles.length
            );

            for (let i = 0; i < spawnCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const particleRadius = system.options.spawnArea.x * (0.8 + Math.random() * 0.4);
                const angularSpeed = (Math.random() - 0.5) * 1.5;
                const verticalSpeed = Math.random() * 0.8 + 0.5;

                system.addParticle({
                    position: new Vector3(
                        system.options.spawnPosition.x + Math.cos(angle) * particleRadius,
                        system.options.spawnPosition.y + Math.sin(angle) * particleRadius,
                        system.options.spawnPosition.z + Math.sin(0) * 0.4 + .2
                    ),
                    velocity: new Vector3(),
                    startColor: new Color(1, 0.9, 0.6),
                    endColor: new Color(1, 0.5, 0.2),
                    size: system.options.particleSize * (0.8 + Math.random() * 0.4),
                    age: 0,
                    lifetime: system.options.lifetime * (0.8 + Math.random() * 0.4),
                    rotation: angle,
                    angularVelocity: angularSpeed * 1.5,
                    shapeType: 0, // Circle shape
                    data: {
                        angle: angle,
                        radius: particleRadius,
                        angularSpeed: angularSpeed,
                        verticalSpeed: verticalSpeed,
                        baseZ: system.options.spawnPosition.z
                    }
                });
            }
        },
        onUpdateParticle: (particle, deltaTime, system) => {
            particle.age += deltaTime;
            const data = particle.data;

            // Update orbital position
            data.angle += data.angularSpeed * deltaTime;
            particle.position.x = system.options.spawnPosition.x + Math.cos(data.angle) * data.radius;
            particle.position.y = system.options.spawnPosition.y + Math.sin(data.angle) * data.radius;
            
            // Vertical bobbing motion
            particle.position.z = data.baseZ + Math.sin(particle.age * data.verticalSpeed) * 0.4;

            // Size variation
            particle.size = system.options.particleSize * 
                (0.8 + Math.sin(particle.age * 5) * 0.2) * 
                (1 - (particle.age / particle.lifetime));

            // Color fade
            const colorProgress = particle.age / particle.lifetime;
            particle.startColor.lerp(particle.endColor, colorProgress * colorProgress);

            // Rotate to face direction
            particle.rotation += particle.angularVelocity * deltaTime;
        }
    });
    ParticleSystems.push(selectParticle);
    return selectParticle;
}