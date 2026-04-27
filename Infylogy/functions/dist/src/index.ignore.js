"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runInfylogyAgent = void 0;
const https_1 = require("firebase-functions/v2/https");
const agentRouter_1 = require("./ai/agentRouter");
exports.runInfylogyAgent = (0, https_1.onCall)(async (req) => {
    const { agentType, input } = req.data;
    if (!req.auth) {
        throw new Error("Unauthorized");
    }
    const result = await (0, agentRouter_1.runAgent)(agentType, input);
    return result;
});
