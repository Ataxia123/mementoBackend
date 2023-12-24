"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelConfigList = void 0;
const checkbox_1 = require("@/app/components/ui/checkbox");
const input_1 = require("@/app/components/ui/input");
const select_1 = require("@/app/components/ui/select");
const locales_1 = __importDefault(require("../../../locales"));
const card_1 = require("../../ui/card");
const config_item_1 = __importDefault(require("./config-item"));
const llm_1 = require("../../../client/platforms/llm");
function limitNumber(x, min, max, defaultValue) {
    if (typeof x !== "number" || isNaN(x)) {
        return defaultValue;
    }
    return Math.min(max, Math.max(min, x));
}
const ModalConfigValidator = {
    model(x) {
        return x;
    },
    maxTokens(x) {
        return limitNumber(x, 0, 4096, 2000);
    },
    temperature(x) {
        return limitNumber(x, 0, 1, 1);
    },
    topP(x) {
        return limitNumber(x, 0, 1, 1);
    },
};
function ModelConfigList(props) {
    return (<card_1.Card>
      <card_1.CardContent className="divide-y p-5">
        <config_item_1.default title={locales_1.default.Settings.Model}>
          <select_1.Select value={props.modelConfig.model} onValueChange={(value) => {
            props.updateConfig((config) => (config.model = ModalConfigValidator.model(value)));
        }}>
            <select_1.SelectTrigger className="w-[180px]">
              <select_1.SelectValue placeholder="Select model"/>
            </select_1.SelectTrigger>
            <select_1.SelectContent>
              {llm_1.ALL_MODELS.map((model) => (<select_1.SelectItem value={model} key={model}>
                  {model}
                </select_1.SelectItem>))}
            </select_1.SelectContent>
          </select_1.Select>
        </config_item_1.default>

        <config_item_1.default title={locales_1.default.Settings.Temperature.Title} subTitle={locales_1.default.Settings.Temperature.SubTitle}>
          <input_1.InputRange value={(props.modelConfig.temperature ?? 0.5).toFixed(1)} min="0" max="1" // lets limit it to 0-1
     step="0.1" onChange={(e) => {
            props.updateConfig((config) => (config.temperature = ModalConfigValidator.temperature(e.currentTarget.valueAsNumber)));
        }}></input_1.InputRange>
        </config_item_1.default>
        <config_item_1.default title={locales_1.default.Settings.TopP.Title} subTitle={locales_1.default.Settings.TopP.SubTitle}>
          <input_1.InputRange value={(props.modelConfig.topP ?? 1).toFixed(1)} min="0" max="1" step="0.1" onChange={(e) => {
            props.updateConfig((config) => (config.topP = ModalConfigValidator.topP(e.currentTarget.valueAsNumber)));
        }}></input_1.InputRange>
        </config_item_1.default>
        <config_item_1.default title={locales_1.default.Settings.MaxTokens.Title} subTitle={locales_1.default.Settings.MaxTokens.SubTitle}>
          <input_1.Input type="number" min={100} max={100000} value={props.modelConfig.maxTokens} onChange={(e) => props.updateConfig((config) => (config.maxTokens = ModalConfigValidator.maxTokens(e.currentTarget.valueAsNumber)))}/>
        </config_item_1.default>

        <config_item_1.default title={locales_1.default.Memory.Title} subTitle={locales_1.default.Memory.Send}>
          <checkbox_1.Checkbox checked={props.modelConfig.sendMemory} onCheckedChange={(checked) => props.updateConfig((config) => (config.sendMemory = Boolean(checked)))}/>
        </config_item_1.default>
      </card_1.CardContent>
    </card_1.Card>);
}
exports.ModelConfigList = ModelConfigList;
