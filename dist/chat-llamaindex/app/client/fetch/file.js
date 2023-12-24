"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isImageFileType = exports.getDetailContentFromFile = void 0;
const constant_1 = require("@/app/constant");
async function getDetailContentFromFile(file) {
    if (file.extension === "pdf")
        return await getPDFFileDetail(file);
    if (file.extension === "txt")
        return await getTextFileDetail(file);
    if (constant_1.ALLOWED_IMAGE_EXTENSIONS.includes(file.extension))
        return await getImageFileDetail(file);
    throw new Error("Not supported file type");
}
exports.getDetailContentFromFile = getDetailContentFromFile;
async function getPDFFileDetail(file) {
    const fileDataUrl = await file.readData({ asURL: true });
    const pdfBase64 = fileDataUrl.split(",")[1];
    const response = await fetch("/api/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            pdf: pdfBase64,
            fileName: file.name,
        }),
    });
    const data = await response.json();
    if (!response.ok)
        throw new Error(data.error);
    return data;
}
async function getTextFileDetail(file) {
    const textContent = await file.readData();
    const response = await fetch("/api/fetch", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: textContent,
            fileName: file.name,
        }),
    });
    const data = await response.json();
    if (!response.ok)
        throw new Error(data.error);
    return data;
}
async function getImageFileDetail(file) {
    const response = await fetch(`/api/upload?filename=${file.name}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: file.file,
    });
    const data = await response.json();
    if (!response.ok)
        throw new Error(data.error);
    console.log(data);
    return data;
}
const isImageFileType = (type) => constant_1.IMAGE_TYPES.includes(type);
exports.isImageFileType = isImageFileType;
