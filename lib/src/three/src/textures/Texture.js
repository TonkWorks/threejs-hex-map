define(["require", "exports", "../core/EventDispatcher.js", "../constants.js", "../math/MathUtils.js", "../math/Vector2.js", "../math/Matrix3.js", "../extras/ImageUtils.js"], function (require, exports, EventDispatcher_js_1, constants_js_1, MathUtils_js_1, Vector2_js_1, Matrix3_js_1, ImageUtils_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let textureId = 0;
    function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
        Object.defineProperty(this, 'id', { value: textureId++ });
        this.uuid = MathUtils_js_1.MathUtils.generateUUID();
        this.name = '';
        this.image = image !== undefined ? image : Texture.DEFAULT_IMAGE;
        this.mipmaps = [];
        this.mapping = mapping !== undefined ? mapping : Texture.DEFAULT_MAPPING;
        this.wrapS = wrapS !== undefined ? wrapS : constants_js_1.ClampToEdgeWrapping;
        this.wrapT = wrapT !== undefined ? wrapT : constants_js_1.ClampToEdgeWrapping;
        this.magFilter = magFilter !== undefined ? magFilter : constants_js_1.LinearFilter;
        this.minFilter = minFilter !== undefined ? minFilter : constants_js_1.LinearMipmapLinearFilter;
        this.anisotropy = anisotropy !== undefined ? anisotropy : 1;
        this.format = format !== undefined ? format : constants_js_1.RGBAFormat;
        this.internalFormat = null;
        this.type = type !== undefined ? type : constants_js_1.UnsignedByteType;
        this.offset = new Vector2_js_1.Vector2(0, 0);
        this.repeat = new Vector2_js_1.Vector2(1, 1);
        this.center = new Vector2_js_1.Vector2(0, 0);
        this.rotation = 0;
        this.matrixAutoUpdate = true;
        this.matrix = new Matrix3_js_1.Matrix3();
        this.generateMipmaps = true;
        this.premultiplyAlpha = false;
        this.flipY = true;
        this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
        // Values of encoding !== THREE.LinearEncoding only supported on map, envMap and emissiveMap.
        //
        // Also changing the encoding after already used by a Material will not automatically make the Material
        // update. You need to explicitly call Material.needsUpdate to trigger it to recompile.
        this.encoding = encoding !== undefined ? encoding : constants_js_1.LinearEncoding;
        this.version = 0;
        this.onUpdate = null;
    }
    exports.Texture = Texture;
    Texture.DEFAULT_IMAGE = undefined;
    Texture.DEFAULT_MAPPING = constants_js_1.UVMapping;
    Texture.prototype = Object.assign(Object.create(EventDispatcher_js_1.EventDispatcher.prototype), {
        constructor: Texture,
        isTexture: true,
        updateMatrix: function () {
            this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
        },
        clone: function () {
            return new this.constructor().copy(this);
        },
        copy: function (source) {
            this.name = source.name;
            this.image = source.image;
            this.mipmaps = source.mipmaps.slice(0);
            this.mapping = source.mapping;
            this.wrapS = source.wrapS;
            this.wrapT = source.wrapT;
            this.magFilter = source.magFilter;
            this.minFilter = source.minFilter;
            this.anisotropy = source.anisotropy;
            this.format = source.format;
            this.internalFormat = source.internalFormat;
            this.type = source.type;
            this.offset.copy(source.offset);
            this.repeat.copy(source.repeat);
            this.center.copy(source.center);
            this.rotation = source.rotation;
            this.matrixAutoUpdate = source.matrixAutoUpdate;
            this.matrix.copy(source.matrix);
            this.generateMipmaps = source.generateMipmaps;
            this.premultiplyAlpha = source.premultiplyAlpha;
            this.flipY = source.flipY;
            this.unpackAlignment = source.unpackAlignment;
            this.encoding = source.encoding;
            return this;
        },
        toJSON: function (meta) {
            const isRootObject = (meta === undefined || typeof meta === 'string');
            if (!isRootObject && meta.textures[this.uuid] !== undefined) {
                return meta.textures[this.uuid];
            }
            const output = {
                metadata: {
                    version: 4.5,
                    type: 'Texture',
                    generator: 'Texture.toJSON'
                },
                uuid: this.uuid,
                name: this.name,
                mapping: this.mapping,
                repeat: [this.repeat.x, this.repeat.y],
                offset: [this.offset.x, this.offset.y],
                center: [this.center.x, this.center.y],
                rotation: this.rotation,
                wrap: [this.wrapS, this.wrapT],
                format: this.format,
                type: this.type,
                encoding: this.encoding,
                minFilter: this.minFilter,
                magFilter: this.magFilter,
                anisotropy: this.anisotropy,
                flipY: this.flipY,
                premultiplyAlpha: this.premultiplyAlpha,
                unpackAlignment: this.unpackAlignment
            };
            if (this.image !== undefined) {
                // TODO: Move to THREE.Image
                const image = this.image;
                if (image.uuid === undefined) {
                    image.uuid = MathUtils_js_1.MathUtils.generateUUID(); // UGH
                }
                if (!isRootObject && meta.images[image.uuid] === undefined) {
                    let url;
                    if (Array.isArray(image)) {
                        // process array of images e.g. CubeTexture
                        url = [];
                        for (let i = 0, l = image.length; i < l; i++) {
                            url.push(ImageUtils_js_1.ImageUtils.getDataURL(image[i]));
                        }
                    }
                    else {
                        // process single image
                        url = ImageUtils_js_1.ImageUtils.getDataURL(image);
                    }
                    meta.images[image.uuid] = {
                        uuid: image.uuid,
                        url: url
                    };
                }
                output.image = image.uuid;
            }
            if (!isRootObject) {
                meta.textures[this.uuid] = output;
            }
            return output;
        },
        dispose: function () {
            this.dispatchEvent({ type: 'dispose' });
        },
        transformUv: function (uv) {
            if (this.mapping !== constants_js_1.UVMapping)
                return uv;
            uv.applyMatrix3(this.matrix);
            if (uv.x < 0 || uv.x > 1) {
                switch (this.wrapS) {
                    case constants_js_1.RepeatWrapping:
                        uv.x = uv.x - Math.floor(uv.x);
                        break;
                    case constants_js_1.ClampToEdgeWrapping:
                        uv.x = uv.x < 0 ? 0 : 1;
                        break;
                    case constants_js_1.MirroredRepeatWrapping:
                        if (Math.abs(Math.floor(uv.x) % 2) === 1) {
                            uv.x = Math.ceil(uv.x) - uv.x;
                        }
                        else {
                            uv.x = uv.x - Math.floor(uv.x);
                        }
                        break;
                }
            }
            if (uv.y < 0 || uv.y > 1) {
                switch (this.wrapT) {
                    case constants_js_1.RepeatWrapping:
                        uv.y = uv.y - Math.floor(uv.y);
                        break;
                    case constants_js_1.ClampToEdgeWrapping:
                        uv.y = uv.y < 0 ? 0 : 1;
                        break;
                    case constants_js_1.MirroredRepeatWrapping:
                        if (Math.abs(Math.floor(uv.y) % 2) === 1) {
                            uv.y = Math.ceil(uv.y) - uv.y;
                        }
                        else {
                            uv.y = uv.y - Math.floor(uv.y);
                        }
                        break;
                }
            }
            if (this.flipY) {
                uv.y = 1 - uv.y;
            }
            return uv;
        }
    });
    Object.defineProperty(Texture.prototype, "needsUpdate", {
        set: function (value) {
            if (value === true)
                this.version++;
        }
    });
});
//# sourceMappingURL=Texture.js.map