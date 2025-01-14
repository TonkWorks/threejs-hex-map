var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function takeTurn(mapView, player) {
        return __awaiter(this, void 0, void 0, function* () {
            // Generate a random delay between 0.1 and 1.5 seconds
            const randomDelay = Math.random() * (1500 - 100) + 100;
            yield sleep(randomDelay);
            determineStrategy();
            buildEconomy();
            mapView.endTurn();
        });
    }
    exports.takeTurn = takeTurn;
    function determineStrategy() {
        //
    }
    exports.determineStrategy = determineStrategy;
    function buildEconomy() {
        //
    }
    exports.buildEconomy = buildEconomy;
    exports.default = determineStrategy;
});
//# sourceMappingURL=AI.js.map