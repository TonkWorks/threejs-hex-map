/**
 * Development repository: https://github.com/kaisalmen/WWOBJLoader
 */
define(["require", "exports", "../../OBJLoader2Parser.js", "./WorkerRunner.js"], function (require, exports, OBJLoader2Parser_js_1, WorkerRunner_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    new WorkerRunner_js_1.WorkerRunner(new WorkerRunner_js_1.DefaultWorkerPayloadHandler(new OBJLoader2Parser_js_1.OBJLoader2Parser()));
});
//# sourceMappingURL=OBJLoader2JsmWorker.js.map