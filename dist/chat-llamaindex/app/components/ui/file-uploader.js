"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const button_1 = require("@/app/components/ui/button");
const utils_1 = require("@/app/lib/utils");
const file_1 = require("@/app/utils/file");
const react_1 = require("react");
const locales_1 = __importDefault(require("../../locales"));
const lucide_react_1 = require("lucide-react");
const DEFAULT_INPUT_ID = "fileInput";
const DEFAULT_FILE_SIZE_LIMIT = 1024 * 1024 * 50; // 50 MB
function FileUploader({ config, onUpload, onError, }) {
    const [uploading, setUploading] = (0, react_1.useState)(false);
    const inputId = config?.inputId || DEFAULT_INPUT_ID;
    const fileSizeLimit = config?.fileSizeLimit || DEFAULT_FILE_SIZE_LIMIT;
    const allowedExtensions = config?.allowedExtensions;
    const defaultCheckExtension = (extension) => {
        if (allowedExtensions && !allowedExtensions.includes(extension)) {
            return locales_1.default.Upload.Invalid(allowedExtensions.join(","));
        }
        return null;
    };
    const checkExtension = config?.checkExtension ?? defaultCheckExtension;
    const isFileSizeExceeded = (file) => {
        return file.size > fileSizeLimit;
    };
    const resetInput = () => {
        const fileInput = document.getElementById(inputId);
        fileInput.value = "";
    };
    const onFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploading(true);
        const fileWrap = new file_1.FileWrap(file);
        await handleUpload(fileWrap);
        resetInput();
        setUploading(false);
    };
    const handleUpload = async (file) => {
        const extensionError = checkExtension(file.extension);
        if (extensionError) {
            return onError(extensionError);
        }
        if (isFileSizeExceeded(file)) {
            return onError(locales_1.default.Upload.SizeExceeded(fileSizeLimit / 1024 / 1024));
        }
        await onUpload(file);
    };
    return (<div className="self-stretch">
      <input type="file" id={inputId} style={{ display: "none" }} onChange={onFileChange} accept={allowedExtensions?.join(",")} disabled={config?.disabled || uploading}/>
      <label htmlFor={inputId} className={(0, utils_1.cn)((0, button_1.buttonVariants)({ variant: "secondary", size: "icon" }), "cursor-pointer", uploading && "opacity-50")}>
        {uploading ? (<lucide_react_1.Loader2 className="h-4 w-4 animate-spin"/>) : (<lucide_react_1.Paperclip className="-rotate-45 w-4 h-4"/>)}
      </label>
    </div>);
}
exports.default = FileUploader;
