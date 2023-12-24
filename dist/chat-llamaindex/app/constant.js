"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_TYPES = exports.DOCUMENT_TYPES = exports.DOCUMENT_FILE_SIZE_LIMIT = exports.ALLOWED_DOCUMENT_EXTENSIONS = exports.ALLOWED_TEXT_EXTENSIONS = exports.ALLOWED_IMAGE_EXTENSIONS = exports.MAX_RENDER_MSG_COUNT = exports.CHAT_PAGE_SIZE = exports.REQUEST_TIMEOUT_MS = exports.FileName = exports.Path = exports.GITHUB_URL = void 0;
exports.GITHUB_URL = "https://github.com/run-llama/chat-llamaindex";
var Path;
(function (Path) {
    Path["Home"] = "/";
    Path["Chat"] = "/";
    Path["Settings"] = "/settings";
    Path["Bots"] = "/";
})(Path || (exports.Path = Path = {}));
var FileName;
(function (FileName) {
    FileName["Bots"] = "bots.json";
})(FileName || (exports.FileName = FileName = {}));
exports.REQUEST_TIMEOUT_MS = 60000;
exports.CHAT_PAGE_SIZE = 15;
exports.MAX_RENDER_MSG_COUNT = 45;
exports.ALLOWED_IMAGE_EXTENSIONS = ["jpeg", "jpg", "png", "gif", "webp"];
exports.ALLOWED_TEXT_EXTENSIONS = ["pdf", "txt"];
exports.ALLOWED_DOCUMENT_EXTENSIONS = [
    ...exports.ALLOWED_TEXT_EXTENSIONS,
    ...exports.ALLOWED_IMAGE_EXTENSIONS,
];
exports.DOCUMENT_FILE_SIZE_LIMIT = 1024 * 1024 * 10; // 10 MB
exports.DOCUMENT_TYPES = [
    "text/html",
    "application/pdf",
    "text/plain",
];
exports.IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];
