import {
    RingGeometry,
    MeshBasicMaterial,
    Mesh,
    TextureLoader,
    MeshBasicMaterialParameters,
    PlaneBufferGeometry,
    MeshStandardMaterial,
    MeshStandardMaterialParameters,
    CylinderGeometry,
    Group,
    MathUtils,
    AdditiveBlending,
    RingBufferGeometry,
  } from "three";
import { asset } from "./util";

export interface Selector {
    update(delta: number): void;
    dispose(): void;
}

export let Selectors: Selector[] = [];

  class AnimatedSelector {
    public mesh: Mesh;
    private rotationSpeed: number;
  
    constructor(
      materialOptions: MeshStandardMaterialParameters = {}
    ) {
      // Load texture
      const texture = new TextureLoader().load(asset("/map/icons/circle.png"));
      const rotationSpeed: number = Math.PI / 2; // Default: 90 degrees per second
      
      // Create material with merged options
      const material = new MeshStandardMaterial({
        map: texture,
        transparent: false,
        alphaTest: .15,
        color: 0xffffff,
        emissive: 0x00ff00, // Glow color (e.g., green)
        emissiveIntensity: .4, // Adjust glow strength
        ...materialOptions,
      });
  
      // Create mesh
      this.mesh = new Mesh(
        new PlaneBufferGeometry(2.4, 2.4),
        material
      );
      this.mesh.position.z = -0.1;
      this.mesh.rotateX(-1*Math.PI / 4.3);
      
      this.rotationSpeed = rotationSpeed;
      Selectors.push(this);
    }
  
    // Call this in your animation loop with delta time
    update(delta: number) {
        this.mesh.rotation.z += delta * this.rotationSpeed;
    }
  
    // Optional: Setter for rotation speed
    setRotationSpeed(speed: number) {
      this.rotationSpeed = speed;
    }

    public dispose(): void {
        this.mesh.parent.remove(this.mesh);
        this.mesh.geometry.dispose();
        const index = Selectors.indexOf(this);
        if (index !== -1) Selectors.splice(index, 1);
    }
  }
  
  export class LightOfGod implements Selector {
    public group: Group;
    private cylinders: Mesh[] = [];
    private flickerSpeed: number;
    private flickerRange: number; 
  
    constructor(
      shaftCount = 6,            // Number of cylinders
      initialOpacity = 0.0,      // Base opacity
      flickerSpeed = 1,          // Speed of flicker
      flickerRange = 0.01,       // How much flicker can change opacity
      height = 75,                // Cylinder height
      radiusTop = 0.2,
      radiusBottom = .2
    ) {
      this.group = new Group();
      this.flickerSpeed = flickerSpeed;
      this.flickerRange = flickerRange;
      
      for (let i = 0; i < shaftCount; i++) {
        const geometry = new CylinderGeometry(
          radiusTop, 
          radiusBottom, 
          height, 
          16,
          1,
        //   true  // openEnded to get a hollow cylinder if you want
        );
  
        // Slight offset so each cylinder is scaled or angled differently
        geometry.translate(0, height / 2, 0);
  
        const material = new MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: initialOpacity,
          blending: AdditiveBlending,  // Helps get a nice “light” look
          depthWrite: false,           // Often turned off for additive glowing
          side: 2,                     // DoubleSide – shows from inside & outside
        });
  
        const cylinder = new Mesh(geometry, material);
  
        // Optionally, rotate or scale cylinders slightly differently
        // cylinder.rotation.x = Math.random() * 0.3 - 0.15; // small tilt
        // cylinder.rotation.z = Math.random() * 0.3 - 0.15;
         cylinder.position.y = Math.random()*1.5 - .75;
        cylinder.position.x = Math.random()*1.5 - .75;

        cylinder.scale.set(0.8 + Math.random() * 0.4, 1, 0.8 + Math.random() * 0.4);
        cylinder.rotateX(Math.PI / 4.5);

        this.cylinders.push(cylinder);
        this.group.add(cylinder);
      }
      Selectors.push(this);
    }
  
    update(delta: number) {
      // Example “flicker” or “pulsing” effect by adjusting each cylinder's opacity
      this.cylinders.forEach((cyl, idx) => {
        const material = cyl.material as MeshBasicMaterial;
        if (!material) return;
  
        // Simple flicker wave:
        const flicker =
          Math.sin((performance.now() / 1000) * this.flickerSpeed + idx) *
          this.flickerRange;
        const baseOpacity = 0.02;
        material.opacity = MathUtils.clamp(baseOpacity + flicker, 0, 1);
  
        // Or animate rotation, scale, etc.:
        // cyl.rotation.y += 0.4 * delta;
      });
    }

    public dispose(): void {
        if (this.group.parent) {
          this.group.parent.remove(this.group);
        }

        // Remove from array
        const index = Selectors.indexOf(this);
        if (index !== -1) Selectors.splice(index, 1);
    
        // Clean up
        this.cylinders.forEach((mesh) => {
          mesh.geometry.dispose();
        });
    }
  }

export class WhiteOutline implements Selector {
    private group: Group;
    mesh: Mesh;
    private circles: Mesh[];
    private circleParams: { scale: number }[];
  
    constructor() {
      this.group = new Group();
  


      const selector = new Mesh(
          new RingBufferGeometry(0.9, 1, 6, -.6), 
          new MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.75,
            emissive: 0xffffff,
            emissiveIntensity: 100, // Adjust glow strength
          }))
      // selector.rotateX(-1*Math.PI / 4.3);
      // selector.rotateZ(Math.PI/2)
      this.mesh = selector;
      this.group.add(this.mesh);
      Selectors.push(this);
    }
  
    update(delta: number) {
}
  
    dispose() {
      // Cleanup group
      if (this.group.parent) {
        this.group.parent.remove(this.group);
      }
  
      // Dispose geometry and materials
      this.mesh.geometry.dispose();
      (this.mesh.material as MeshStandardMaterial).dispose();
  
      // Remove from global list
      const index = Selectors.indexOf(this);
      if (index !== -1) {
        Selectors.splice(index, 1);
      }
    }
  }

  export default AnimatedSelector;