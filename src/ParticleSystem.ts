import {
    Scene, Vector3, Color,
    BufferGeometry, BufferAttribute,
    ShaderMaterial, Points,
    AdditiveBlending
} from 'three';

export type ParticleType = 'fire' | 'explosion' | 'fireworks' | 'confetti';

export interface ParticleSystemOptions {
    maxParticles?: number;
    particleSize?: number;
    lifetime?: number;
    spawnRate?: number;
    spawnPosition?: {
        x: number;
        y: number;
        z: number;
    };
    spawnArea?: {
        x: number;
        y: number;
        z: number;
    };
    gravity?: number;
    type?: ParticleType;
    shape?: 'square' | 'cloud';
    duration?: number;
    fireworkColors?: Color[];
    confettiColors?: Color[];
    explosionBurstSize?: number;
    fireworkRocketLifetime?: number;
    fireworkBurstSize?: number;
}

export interface Particle {
    position: Vector3;
    velocity: Vector3;
    startColor: Color;
    endColor: Color;
    size: number;
    age: number;
    lifetime: number;
    rotation: number;
    angularVelocity: number;
    shapeType: number;
    isFireworkTrail?: boolean;

    isFireworkRocket?: boolean;  // rocket phase
    hasBurst?: boolean;          // track if the rocket has bursted
}

export class ParticleSystem {
    private scene: Scene;
    private particles: Particle[];
    private geometry: BufferGeometry;
    private positions: Float32Array;
    private colors: Float32Array;
    private sizes: Float32Array;
    private rotations: Float32Array;
    private shapeTypes: Float32Array;
    private material: ShaderMaterial;
    private particleSystem: Points;
    private options: Required<ParticleSystemOptions>;
    private systemAge: number = 0;
    private active: boolean = true;

    constructor(scene: Scene, options: ParticleSystemOptions = {}) {
        this.scene = scene;
        this.particles = [];
        this.geometry = new BufferGeometry();

        this.options = {
            // Fallback with ternary checks instead of "??"
            maxParticles: options.maxParticles !== undefined ? options.maxParticles : 2000,
            particleSize: options.particleSize !== undefined ? options.particleSize : 5,
            lifetime: options.lifetime !== undefined ? options.lifetime : 2,
            spawnRate: options.spawnRate !== undefined ? options.spawnRate : 50,
            spawnPosition: options.spawnPosition !== undefined ? options.spawnPosition : { x: 0, y: 0, z: 0 },
            spawnArea: options.spawnArea !== undefined ? options.spawnArea : { x: 0, y: 0, z: 0 },
            gravity: options.gravity !== undefined ? options.gravity : -9.8,
            type: options.type !== undefined ? options.type : 'fire',
            shape: options.shape !== undefined ? options.shape : 'square',
            duration: options.duration !== undefined ? options.duration : 0,
            fireworkColors: options.fireworkColors !== undefined
                ? options.fireworkColors
                : [
                    new Color(0xff0000), new Color(0x00ff00), new Color(0x0000ff),
                    new Color(0xffff00), new Color(0xff00ff)
                ],
            confettiColors: options.confettiColors !== undefined
                ? options.confettiColors
                : [
                    new Color(0xff0000), new Color(0x00ff00), new Color(0x0000ff),
                    new Color(0xffff00), new Color(0xff00ff), new Color(0x00ffff),
                    new Color(0xffaa00)
                ],

            // NEW: also fallback with ternaries
            explosionBurstSize: options.explosionBurstSize !== undefined ? options.explosionBurstSize : 40,
            fireworkRocketLifetime: options.fireworkRocketLifetime !== undefined ? options.fireworkRocketLifetime : .35,
            fireworkBurstSize: options.fireworkBurstSize !== undefined ? options.fireworkBurstSize : 40,
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

    private setupMaterial(): void {
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
                // Basic perspective size attenuation
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

        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {},
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false
        });
    }

    private setupParticleSystem(): void {
        this.geometry.setAttribute('position', new BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('color', new BufferAttribute(this.colors, 3));
        this.geometry.setAttribute('size', new BufferAttribute(this.sizes, 1));
        this.geometry.setAttribute('rotation', new BufferAttribute(this.rotations, 1));
        this.geometry.setAttribute('shapeType', new BufferAttribute(this.shapeTypes, 1));

        this.particleSystem = new Points(this.geometry, this.material);
        this.scene.add(this.particleSystem);
    }

    /**
     * Make a big explosion burst at a certain position.
     */
    private triggerExplosion(position: Vector3) {
        const burstSize = this.options.explosionBurstSize;
        for (let i = 0; i < burstSize; i++) {
            if (this.particles.length >= this.options.maxParticles) break;

            // Spherical outward velocity
            const speed = 3 + Math.random() * 6;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            const p: Partial<Particle> = {
                position: position.clone(),
                velocity: new Vector3(
                    speed * Math.sin(phi) * Math.cos(theta),
                    speed * Math.cos(phi),
                    speed * Math.sin(phi) * Math.sin(theta)
                ),
                startColor: new Color(1, 0.8, 0), // bright orange
                endColor: new Color(1, 0, 0),     // red fade
                size: this.options.particleSize * 2.5,
                age: 0,
                lifetime: 1.2 + Math.random() * 0.5,
                rotation: Math.random() * Math.PI * 2,
                angularVelocity: (Math.random() - 0.5) * Math.PI * 4,
                shapeType: 0 // circle
            };

            this.particles.push(p as Particle);
        }
    }

    /**
     * Spawn a rocket that will ascend and eventually burst.
     */
    private spawnFireworkRocket(): void {
        if (this.particles.length >= this.options.maxParticles) return;

        const rocket: Partial<Particle> = {
            position: new Vector3(
                this.options.spawnPosition.x + (Math.random() - 0.5) * this.options.spawnArea.x,
                this.options.spawnPosition.y + (Math.random() - 0.5) * this.options.spawnArea.y,
                this.options.spawnPosition.z + (Math.random() - 0.5) * this.options.spawnArea.z
            ),
            velocity: new Vector3(
                (Math.random() - 0.5) * 2,
                18 + Math.random() * 8,   // strong upward
                (Math.random() - 0.5) * 2
            ),
            startColor: new Color(1, 1, 1),
            endColor: new Color(1, 0.6, 0.3),
            size: this.options.particleSize,
            age: 0,
            lifetime: this.options.fireworkRocketLifetime,
            rotation: 0,
            angularVelocity: 0,
            shapeType: 2, // slim rectangle for a "flame" look
            isFireworkRocket: true,
            hasBurst: false
        };

        this.particles.push(rocket as Particle);
    }

    /**
     * Firework rocket bursts into many colored sparks.
     */
    private triggerFireworkBurst(position: Vector3): void {
        const burstCount = this.options.fireworkBurstSize;
        for (let i = 0; i < burstCount; i++) {
            if (this.particles.length >= this.options.maxParticles) break;

            // pick random color from array
            const colorIndex = Math.floor(Math.random() * this.options.fireworkColors.length);
            const c = this.options.fireworkColors[colorIndex];

            // outward velocity
            const speed = 8 + Math.random() * 8;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI;

            const p: Partial<Particle> = {
                position: position.clone(),
                velocity: new Vector3(
                    speed * Math.sin(phi) * Math.cos(theta),
                    speed * Math.cos(phi),
                    speed * Math.sin(phi) * Math.sin(theta)
                ),
                startColor: c.clone(),
                endColor: c.clone().multiplyScalar(0.2),
                size: this.options.particleSize * 1.4 * (0.7 + Math.random() * 0.5),
                age: 0,
                lifetime: 1.5 + Math.random() * 1.0,
                rotation: Math.random() * Math.PI * 2,
                angularVelocity: (Math.random() - 0.5) * Math.PI * 4,
                shapeType: 0 // circle or any shape
            };

            this.particles.push(p as Particle);
        }
    }

    /**
     * Continually spawn small trail particles behind a rocket.
     */
    private spawnFireworkTrail(position: Vector3): void {
        // spawn just a few small particles each frame
        for (let i = 0; i < 3; i++) {
            if (this.particles.length >= this.options.maxParticles) return;

            const p: Partial<Particle> = {
                position: position.clone(),
                velocity: new Vector3(
                    (Math.random() - 0.5) * 0.3,
                    -1 - Math.random(), // slight downward flicker
                    (Math.random() - 0.5) * 0.3
                ),
                startColor: new Color(1, 1, 1),
                endColor: new Color(1, 0.5, 0.2),
                size: this.options.particleSize * 0.5,
                age: 0,
                lifetime: 0.3 + Math.random() * 0.2,
                rotation: Math.random() * Math.PI * 2,
                angularVelocity: (Math.random() - 0.5) * Math.PI * 4,
                shapeType: 2,  // slim rectangle
                isFireworkTrail: true
            };

            this.particles.push(p as Particle);
        }
    }

    /**
     * Modified spawnParticle():
     * Dispatches to either 'triggerExplosion' or 'spawnFireworkRocket'.
     */
    private spawnParticle(): void {
        if (this.particles.length >= this.options.maxParticles) return;

        switch (this.options.type) {
            case 'explosion':
                // Instead of making a single particle, make an entire explosion burst
                this.triggerExplosion(new Vector3(
                    this.options.spawnPosition.x + (Math.random() - 0.5) * this.options.spawnArea.x,
                    this.options.spawnPosition.y + (Math.random() - 0.5) * this.options.spawnArea.y,
                    this.options.spawnPosition.z + (Math.random() - 0.5) * this.options.spawnArea.z
                ));
                break;

            case 'fireworks':
                // Spawn a single rocket
                this.spawnFireworkRocket();
                break;

            case 'confetti': {
                // Keep your existing confetti logic
                const color = this.options.confettiColors[
                    Math.floor(Math.random() * this.options.confettiColors.length)
                ];

                const p: Partial<Particle> = {
                    position: new Vector3(
                        this.options.spawnPosition.x + (Math.random() - 0.5) * this.options.spawnArea.x,
                        this.options.spawnPosition.y + (Math.random() - 0.5) * this.options.spawnArea.y,
                        this.options.spawnPosition.z + (Math.random() - 0.5) * this.options.spawnArea.z
                    ),
                    velocity: new Vector3(
                        (Math.random() - 0.5) * 8,
                        8 + Math.random() * 4,
                        (Math.random() - 0.5) * 8
                    ),
                    startColor: color.clone(),
                    endColor: color.clone().multiplyScalar(0.7),
                    size: this.options.particleSize * (0.6 + Math.random() * 0.4),
                    age: 0,
                    lifetime: Math.random() * 5,
                    rotation: Math.random() * Math.PI * 2,
                    angularVelocity: (Math.random() - 0.5) * Math.PI * 4,
                    shapeType: Math.floor(Math.random() * 2) + 1
                };
                this.particles.push(p as Particle);
                break;
            }

            default: {
                // Example fallback: single generic particle
                const p: Partial<Particle> = {
                    position: new Vector3(
                        this.options.spawnPosition.x + (Math.random() - 0.5) * this.options.spawnArea.x,
                        this.options.spawnPosition.y + (Math.random() - 0.5) * this.options.spawnArea.y,
                        this.options.spawnPosition.z + (Math.random() - 0.5) * this.options.spawnArea.z
                    ),
                    velocity: new Vector3(
                        (Math.random() - 0.5) * 2,
                        2 + Math.random() * 2,
                        (Math.random() - 0.5) * 2
                    ),
                    startColor: new Color(1, 0.8, 0),
                    endColor: new Color(1, 0.4, 0),
                    size: this.options.particleSize,
                    age: 0,
                    lifetime: this.options.lifetime,
                    rotation: Math.random() * Math.PI * 2,
                    angularVelocity: (Math.random() - 0.5) * Math.PI * 2,
                    shapeType: 0 // circle
                };
                this.particles.push(p as Particle);
                break;
            }
        }
    }

    public update(deltaTime: number): void {
        if (deltaTime <= 0) return;
        // Avoid large delta spikes
        if (deltaTime >= 0.1) return;

        this.systemAge += deltaTime;

        // Duration logic
        let shouldSpawn = true;
        if (this.options.duration > 0 && this.systemAge >= this.options.duration) {
            shouldSpawn = false;
        }
        if (
            this.options.duration > 0 &&
            this.systemAge >= this.options.duration + 10 * this.options.lifetime
        ) {
            this.active = false;
        }

        // Spawn new particles (or bursts/rockets)
        const spawnCount = Math.min(
            Math.floor(this.options.spawnRate * deltaTime),
            this.options.maxParticles - this.particles.length
        );
        if (shouldSpawn) {
            for (let i = 0; i < spawnCount; i++) {
                this.spawnParticle();
            }
        }

        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.age += deltaTime;

            // If rocket, spawn small trailing sparks
            if (p.isFireworkRocket && !p.hasBurst) {
                this.spawnFireworkTrail(p.position.clone());

                // if rocket lifetime is over or velocity goes downward, trigger burst
                if (p.age >= p.lifetime || p.velocity.y <= 0) {
                    this.triggerFireworkBurst(p.position.clone());
                    p.hasBurst = true; // so we don't burst multiple times
                    this.particles.splice(i, 1); // remove the rocket
                    continue; // move on
                }
            }

            // Normal lifetime check
            if (p.age >= p.lifetime) {
                this.particles.splice(i, 1);
                continue;
            }
            // if (p.position.z < 0) {
            //     this.particles.splice(i, 1);
            //     continue;
            // }
            // Physics update
            p.velocity.z += this.options.gravity * deltaTime/1.5
            p.velocity.y += this.options.gravity * deltaTime/1.5;

            // Confetti air resistance (and for small trails, if desired)
            if (this.options.type === 'confetti' || p.isFireworkTrail) {
                p.velocity.multiplyScalar(1 - 0.1 * deltaTime);
            }

            // Position, rotation
            p.position.addScaledVector(p.velocity, deltaTime);
            p.rotation += p.angularVelocity * deltaTime;

            // Color interpolation
            const lifeRatio = p.age / p.lifetime;
            p.startColor.lerp(p.endColor, lifeRatio);

            // Update GPU buffers
            const idx = i * 3;
            this.positions[idx] = p.position.x;
            this.positions[idx + 1] = p.position.y;
            this.positions[idx + 2] = p.position.z;

            this.colors[idx] = p.startColor.r;
            this.colors[idx + 1] = p.startColor.g;
            this.colors[idx + 2] = p.startColor.b;

            // Slight size shrink near the end
            this.sizes[i] = p.size * (1 - lifeRatio * 0.2);
            this.rotations[i] = p.rotation;
            this.shapeTypes[i] = p.shapeType;

        }

        // Hide unused particles
        for (let i = this.particles.length; i < this.options.maxParticles; i++) {
            const idx = i * 3;
            this.positions[idx] = 0;
            this.positions[idx + 1] = 0;
            this.positions[idx + 2] = 0;
            this.sizes[i] = 0;
        }

        // Mark attributes as dirty
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.color.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        this.geometry.attributes.rotation.needsUpdate = true;
        this.geometry.attributes.shapeType.needsUpdate = true;
    }

    public dispose(): void {
        this.scene.remove(this.particleSystem);
        this.geometry.dispose();
        this.material.dispose();
    }

    public isActive(): boolean {
        return this.active;
    }
}
