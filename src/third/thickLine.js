// ThickLine.js
import * as THREE from 'three';

class ThickLine extends THREE.Mesh {
  /**
   * Constructs a thick border line mesh.
   *
   * This version assumes that the given points form the border in order.
   * Each consecutive pair of points defines a segment that is drawn as its own quad.
   *
   * @param {THREE.Vector3[]} points - Array of THREE.Vector3 points defining the border.
   * @param {Object} [parameters] - Optional parameters.
   * @param {number} [parameters.linewidth=1] - Desired line thickness in pixels.
   * @param {THREE.Vector2} [parameters.resolution=new THREE.Vector2(window.innerWidth, window.innerHeight)]
   *                                    - Screen resolution (used for scaling the line thickness).
   * @param {number|string} [parameters.color=0xffffff] - Line color.
   */
  constructor(points, parameters = {}) {
    if (!Array.isArray(points) || points.length < 2) {
      console.error('ThickLine: At least 2 points are required.');
      return;
    }

    // We'll build geometry one segment at a time.
    const positions = [];  // vertex positions
    const sides = [];      // side attribute: -1 for left edge, +1 for right edge
    const directions = []; // segment direction (same for all four vertices of a segment)
    const indices = [];
    let vertexIndex = 0;

    // For each segment (consecutive pair of points), create a quad.
    for (let i = 0; i < points.length - 1; i++) {
      const start = points[i];
      const end = points[i + 1];

      // Compute the normalized direction for this segment.
      const segDir = new THREE.Vector3().subVectors(end, start).normalize();

      // Create four vertices for the quad:
      // Two for the start point (left & right) and two for the end point.
      positions.push(start.x, start.y, start.z);
      positions.push(start.x, start.y, start.z);
      positions.push(end.x,   end.y,   end.z);
      positions.push(end.x,   end.y,   end.z);

      // Set the side attribute for each vertex.
      // Left edge: -1, right edge: +1.
      sides.push(-1, 1, -1, 1);

      // For each of the four vertices, store the segment direction.
      for (let j = 0; j < 4; j++) {
        directions.push(segDir.x, segDir.y, segDir.z);
      }

      // Build indices for the two triangles that form the quad.
      // The quad's vertices (relative to this segment) are:
      //   0 (start, left), 1 (start, right), 2 (end, left), 3 (end, right)
      indices.push(vertexIndex, vertexIndex + 2, vertexIndex + 1);
      indices.push(vertexIndex + 2, vertexIndex + 3, vertexIndex + 1);

      vertexIndex += 4;
    }

    // Create the BufferGeometry and add the attributes.
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('side', new THREE.Float32BufferAttribute(sides, 1));
    geometry.setAttribute('direction', new THREE.Float32BufferAttribute(directions, 3));
    geometry.setIndex(indices);

    // Get parameters.
    const linewidth = parameters.linewidth !== undefined ? parameters.linewidth : 1;
    const resolution =
      parameters.resolution !== undefined
        ? parameters.resolution
        : new THREE.Vector2(window.innerWidth, window.innerHeight);
    const color =
      parameters.color !== undefined ? new THREE.Color(parameters.color) : new THREE.Color(0xffffff);

    // Create a custom shader material.
    // The vertex shader offsets each vertex in screen space, using the precomputed segment direction.
    const material = new THREE.ShaderMaterial({
      uniforms: {
        linewidth: { value: linewidth },
        resolution: { value: resolution },
        color: { value: color }
      },
      vertexShader: `
        attribute vec3 direction;
        attribute float side;
        uniform float linewidth;
        uniform vec2 resolution;
        
        // Transform a position to clip space.
        vec4 projectPosition(vec4 pos) {
          return projectionMatrix * pos;
        }
        
        void main() {
          // Transform the vertex position to view space.
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vec4 clipPosition = projectionMatrix * mvPosition;
          
          // Transform the segment direction to view space.
          vec4 mvDir = modelViewMatrix * vec4(direction, 0.0);
          vec4 clipDir = projectionMatrix * mvDir;
          
          // Normalize the 2D direction in clip space.
          vec2 dir2D = normalize(clipDir.xy);
          
          // Compute a perpendicular (normal) in clip space.
          vec2 normal = vec2(-dir2D.y, dir2D.x);
          
          // Convert linewidth from pixels to clip-space units.
          // Multiply by clipPosition.w to account for perspective.
          float pixelWidth = linewidth / resolution.y;
          vec2 offset = normal * side * pixelWidth * clipPosition.w;
          
          // Apply the offset.
          clipPosition.xy += offset;
          gl_Position = clipPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          gl_FragColor = vec4(color, 1.0);
        }
      `,
      transparent: false,
      side: THREE.DoubleSide
    });

    // Call the parent Mesh constructor.
    super(geometry, material);
    this.type = 'ThickLine';
  }
}

export { ThickLine };
