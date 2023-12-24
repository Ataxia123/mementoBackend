"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFromFile = exports.downloadAs = void 0;
function downloadAs(text, filename) {
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
exports.downloadAs = downloadAs;
function readFromFile() {
    return new Promise((res, rej) => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "application/json";
        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
                res(e.target.result);
            };
            fileReader.onerror = (e) => rej(e);
            fileReader.readAsText(file);
        };
        fileInput.click();
    });
}
exports.readFromFile = readFromFile;
