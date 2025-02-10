define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let _context;
    const AudioContext = {
        getContext: function () {
            if (_context === undefined) {
                _context = new (window.AudioContext || window.webkitAudioContext)();
            }
            return _context;
        },
        setContext: function (value) {
            _context = value;
        }
    };
    exports.AudioContext = AudioContext;
});
//# sourceMappingURL=AudioContext.js.map