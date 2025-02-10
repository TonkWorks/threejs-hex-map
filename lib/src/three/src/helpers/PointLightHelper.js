define(["require", "exports", "../objects/Mesh.js", "../materials/MeshBasicMaterial.js", "../geometries/SphereBufferGeometry.js"], function (require, exports, Mesh_js_1, MeshBasicMaterial_js_1, SphereBufferGeometry_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class PointLightHelper extends Mesh_js_1.Mesh {
        constructor(light, sphereSize, color) {
            const geometry = new SphereBufferGeometry_js_1.SphereBufferGeometry(sphereSize, 4, 2);
            const material = new MeshBasicMaterial_js_1.MeshBasicMaterial({ wireframe: true, fog: false, toneMapped: false });
            super(geometry, material);
            this.light = light;
            this.light.updateMatrixWorld();
            this.color = color;
            this.type = 'PointLightHelper';
            this.matrix = this.light.matrixWorld;
            this.matrixAutoUpdate = false;
            this.update();
            /*
        // TODO: delete this comment?
        const distanceGeometry = new THREE.IcosahedronBufferGeometry( 1, 2 );
        const distanceMaterial = new THREE.MeshBasicMaterial( { color: hexColor, fog: false, wireframe: true, opacity: 0.1, transparent: true } );
    
        this.lightSphere = new THREE.Mesh( bulbGeometry, bulbMaterial );
        this.lightDistance = new THREE.Mesh( distanceGeometry, distanceMaterial );
    
        const d = light.distance;
    
        if ( d === 0.0 ) {
    
            this.lightDistance.visible = false;
    
        } else {
    
            this.lightDistance.scale.set( d, d, d );
    
        }
    
        this.add( this.lightDistance );
        */
        }
        dispose() {
            this.geometry.dispose();
            this.material.dispose();
        }
        update() {
            if (this.color !== undefined) {
                this.material.color.set(this.color);
            }
            else {
                this.material.color.copy(this.light.color);
            }
            /*
            const d = this.light.distance;
    
            if ( d === 0.0 ) {
    
                this.lightDistance.visible = false;
    
            } else {
    
                this.lightDistance.visible = true;
                this.lightDistance.scale.set( d, d, d );
    
            }
            */
        }
    }
    exports.PointLightHelper = PointLightHelper;
});
//# sourceMappingURL=PointLightHelper.js.map