import {
    Scene, Vector3, Color,
    BufferGeometry, BufferAttribute,
    ShaderMaterial, Points,
    AdditiveBlending
} from 'three';

export interface ParticleSystemOptions {
    maxParticles?: number;
    particleSize?: number;
    lifetime?: number;
    spawnRate?: number;
    spawnPosition?: Vector3;
    spawnArea?: Vector3;
    gravity?: number;
    shape?: 'square' | 'circle' | 'cloud';
    duration?: number;
    onSpawn?: (system: ParticleSystem, deltaTime: number) => void;
    onUpdateParticle?: (particle: Particle, deltaTime: number, system: ParticleSystem) => void;
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
    data?: Record<string, any>;
}

export let ParticleSystems: ParticleSystem[] = [];

export class ParticleSystem {
    public readonly scene: Scene;
    public particles: Particle[];
    public readonly options: Required<ParticleSystemOptions>;
    
    private geometry: BufferGeometry;
    private positions: Float32Array;
    private colors: Float32Array;
    private sizes: Float32Array;
    private rotations: Float32Array;
    private shapeTypes: Float32Array;
    private material: ShaderMaterial;
    private particleSystem: Points;
    systemAge: number = 0;
    private active: boolean = true;

    constructor(scene: Scene, options: ParticleSystemOptions = {}) {
        this.scene = scene;
        this.particles = [];
        this.geometry = new BufferGeometry();

        this.options = {
            maxParticles: options.maxParticles || 2000,
            particleSize: options.particleSize || 5,
            lifetime: options.lifetime || 2,
            spawnRate: options.spawnRate || 50,
            spawnPosition: options.spawnPosition ? options.spawnPosition.clone() : new Vector3(0, 0, 0),
            spawnArea: options.spawnArea ? options.spawnArea.clone() : new Vector3(0, 0, 0),
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

        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {},
            transparent: true,
            blending: AdditiveBlending,
            depthWrite: false,
            // depthTest: false // Important for overlay effect
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

    private defaultSpawn(deltaTime: number): void {
        const spawnCount = Math.min(
            Math.floor(this.options.spawnRate * deltaTime),
            this.options.maxParticles - this.particles.length
        );

        for (let i = 0; i < spawnCount; i++) {
            this.addParticle({
                position: new Vector3(
                    this.options.spawnPosition.x + (Math.random() - 0.5) * this.options.spawnArea.x,
                    this.options.spawnPosition.y + (Math.random() - 0.5) * this.options.spawnArea.y,
                    this.options.spawnPosition.z + (Math.random() - 0.5) * this.options.spawnArea.z
                ),
                velocity: new Vector3(
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    2 + Math.random() * 2
                ),
                startColor: new Color(1, 0.8, 0),
                endColor: new Color(1, 0.4, 0),
                size: this.options.particleSize,
                age: 0,
                lifetime: this.options.lifetime,
                rotation: Math.random() * Math.PI * 2,
                angularVelocity: (Math.random() - 0.5) * Math.PI * 2,
                shapeType: this.options.shape === 'circle' ? 0 : 1
            });
        }
    }

    private defaultUpdateParticle(particle: Particle, deltaTime: number): void {
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

    public addParticle(particle: Particle): void {
        if (this.particles.length < this.options.maxParticles) {
            this.particles.push(particle);
        }
    }

    public addParticles(particles: Particle[]): void {
        const remaining = this.options.maxParticles - this.particles.length;
        this.particles.push(...particles.slice(0, remaining));
    }

    public update(deltaTime: number): void {
        if (deltaTime <= 0 || deltaTime >= 0.1) return;

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

    public dispose(): void {
        this.scene.remove(this.particleSystem);
        this.geometry.dispose();
        this.material.dispose();
        const index = ParticleSystems.indexOf(this);
        if (index !== -1) ParticleSystems.splice(index, 1);
    }

    public isActive(): boolean {
        return this.active;
    }
}
