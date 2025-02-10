define(["require", "exports", "../constants.js", "./Texture.js"], function (require, exports, constants_js_1, Texture_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function VideoTexture(video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy) {
        Texture_js_1.Texture.call(this, video, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy);
        this.format = format !== undefined ? format : constants_js_1.RGBFormat;
        this.minFilter = minFilter !== undefined ? minFilter : constants_js_1.LinearFilter;
        this.magFilter = magFilter !== undefined ? magFilter : constants_js_1.LinearFilter;
        this.generateMipmaps = false;
        const scope = this;
        function updateVideo() {
            scope.needsUpdate = true;
            video.requestVideoFrameCallback(updateVideo);
        }
        if ('requestVideoFrameCallback' in video) {
            video.requestVideoFrameCallback(updateVideo);
        }
    }
    exports.VideoTexture = VideoTexture;
    VideoTexture.prototype = Object.assign(Object.create(Texture_js_1.Texture.prototype), {
        constructor: VideoTexture,
        clone: function () {
            return new this.constructor(this.image).copy(this);
        },
        isVideoTexture: true,
        update: function () {
            const video = this.image;
            const hasVideoFrameCallback = 'requestVideoFrameCallback' in video;
            if (hasVideoFrameCallback === false && video.readyState >= video.HAVE_CURRENT_DATA) {
                this.needsUpdate = true;
            }
        }
    });
});
//# sourceMappingURL=VideoTexture.js.map