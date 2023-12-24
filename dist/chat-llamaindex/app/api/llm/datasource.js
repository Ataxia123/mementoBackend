"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataSource = void 0;
const constants_mjs_1 = require("@/scripts/constants.mjs");
const llamaindex_1 = require("llamaindex");
async function getDataSource(serviceContext, datasource) {
    let storageContext = await (0, llamaindex_1.storageContextFromDefaults)({
        persistDir: `${constants_mjs_1.DATASOURCES_CACHE_DIR}/${datasource}`,
    });
    const numberOfDocs = Object.keys(storageContext.docStore.toDict()).length;
    if (numberOfDocs === 0) {
        throw new Error(`StorageContext for datasource '${datasource}' is empty - make sure to generate the datasource first`);
    }
    return await llamaindex_1.VectorStoreIndex.init({
        storageContext,
        serviceContext,
    });
}
exports.getDataSource = getDataSource;
