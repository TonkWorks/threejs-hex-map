define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const Cache = {
        enabled: false,
        files: {},
        add: function (key, file) {
            if (this.enabled === false)
                return;
            // console.log( 'THREE.Cache', 'Adding key:', key );
            this.files[key] = file;
        },
        get: function (key) {
            if (this.enabled === false)
                return;
            // console.log( 'THREE.Cache', 'Checking key:', key );
            return this.files[key];
        },
        remove: function (key) {
            delete this.files[key];
        },
        clear: function () {
            this.files = {};
        }
    };
    exports.Cache = Cache;
});
//# sourceMappingURL=Cache.js.map