"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotAvatar = exports.EmojiAvatar = exports.EmojiAvatarPicker = exports.getEmojiUrl = void 0;
const emoji_picker_react_1 = __importStar(require("emoji-picker-react"));
function getEmojiUrl(unified, style) {
    return `https://cdn.staticfile.org/emoji-datasource-apple/14.0.0/img/${style}/64/${unified}.png`;
}
exports.getEmojiUrl = getEmojiUrl;
function EmojiAvatarPicker(props) {
    return (<emoji_picker_react_1.default lazyLoadEmojis theme={emoji_picker_react_1.Theme.AUTO} getEmojiUrl={getEmojiUrl} onEmojiClick={(e) => {
            props.onEmojiClick(e.unified);
        }}/>);
}
exports.EmojiAvatarPicker = EmojiAvatarPicker;
function EmojiAvatar(props) {
    return (<emoji_picker_react_1.Emoji unified={props.avatar} size={props.size ?? 18} getEmojiUrl={getEmojiUrl}/>);
}
exports.EmojiAvatar = EmojiAvatar;
function BotAvatar(props) {
    const { avatar } = props;
    return <EmojiAvatar avatar={avatar}/>;
}
exports.BotAvatar = BotAvatar;
