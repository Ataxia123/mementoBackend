"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatControllerPool = void 0;
// To store AbortControllers per session
exports.ChatControllerPool = {
    controllers: {},
    addController(sessionId, controller) {
        this.controllers[sessionId] = controller;
    },
    stop(sessionId) {
        const controller = this.controllers[sessionId];
        controller?.abort();
    },
    isRunning(sessionId) {
        return this.controllers[sessionId] !== undefined;
    },
    remove(sessionId) {
        delete this.controllers[sessionId];
    },
};
