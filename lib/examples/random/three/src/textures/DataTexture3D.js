define(["require", "exports", "./Texture.js", "../constants.js"], function (require, exports, Texture_js_1, constants_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function DataTexture3D(data, width, height, depth) {
        // We're going to add .setXXX() methods for setting properties later.
        // Users can still set in DataTexture3D directly.
        //
        //	const texture = new THREE.DataTexture3D( data, width, height, depth );
        // 	texture.anisotropy = 16;
        //
        // See #14839
        Texture_js_1.Texture.call(this, null);
        this.image = { data: data || null, width: width || 1, height: height || 1, depth: depth || 1 };
        this.magFilter = constants_js_1.NearestFilter;
        this.minFilter = constants_js_1.NearestFilter;
        this.wrapR = constants_js_1.ClampToEdgeWrapping;
        this.generateMipmaps = false;
        this.flipY = false;
        this.needsUpdate = true;
    }
    exports.DataTexture3D = DataTexture3D;
    DataTexture3D.prototype = Object.create(Texture_js_1.Texture.prototype);
    DataTexture3D.prototype.constructor = DataTexture3D;
    DataTexture3D.prototype.isDataTexture3D = true;
});
//# sourceMappingURL=DataTexture3D.js.map