"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_mjs_1 = require("@/scripts/constants.mjs");
const llamaindex_1 = require("llamaindex");
async function splitAndEmbed(document) {
    const nodes = (0, llamaindex_1.getNodesFromDocument)(new llamaindex_1.Document({ text: document }), new llamaindex_1.SentenceSplitter({
        chunkSize: constants_mjs_1.DATASOURCES_CHUNK_SIZE,
        chunkOverlap: constants_mjs_1.DATASOURCES_CHUNK_OVERLAP,
    }));
    const nodesWithEmbeddings = await llamaindex_1.VectorStoreIndex.getNodeEmbeddingResults(nodes, (0, llamaindex_1.serviceContextFromDefaults)(), true);
    return nodesWithEmbeddings.map((nodeWithEmbedding) => ({
        text: nodeWithEmbedding.getContent(llamaindex_1.MetadataMode.NONE),
        embedding: nodeWithEmbedding.getEmbedding(),
    }));
}
exports.default = splitAndEmbed;
