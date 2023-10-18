/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/renderer/character_modeling.js":
/*!*********************************************!*\
  !*** ./dist/renderer/character_modeling.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RACES: () => (/* binding */ RACES),\n/* harmony export */   findItemsInEquipments: () => (/* binding */ findItemsInEquipments),\n/* harmony export */   findRaceGenderOptions: () => (/* binding */ findRaceGenderOptions),\n/* harmony export */   getCharacterOptions: () => (/* binding */ getCharacterOptions),\n/* harmony export */   getDisplaySlot: () => (/* binding */ getDisplaySlot),\n/* harmony export */   optionsFromModel: () => (/* binding */ optionsFromModel)\n/* harmony export */ });\n/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setup.js */ \"./dist/renderer/setup.js\");\n\n\n\n\nconst NOT_DISPLAYED_SLOTS = [\n  2, // neck\n  11, // finger1\n  12, // finger1\n  13, // trinket1\n  14, // trinket2\n]\n\nconst RACES = {\n  1: `human`,\n  2: `orc`,\n  3: `dwarf`,\n  4: `nightelf`,\n  5: `scourge`,\n  6: `tauren`,\n  7: `gnome`,\n  8: `troll`,\n  10: `bloodelf`,\n  11: `draenei`\n}\n\nconst CHARACTER_PART = {\n  Face: `face`,\n  \"Skin Color\": `skin`,\n  \"Hair Style\": `hairStyle`,\n  \"Hair Color\": `hairColor`,\n  \"Facial Hair\": `facialStyle`,\n  Mustache: `facialStyle`,\n  Beard: `facialStyle`,\n  Sideburns: `facialStyle`,\n  \"Face Shape\": `facialStyle`,\n  Eyebrow: `facialStyle`,\n  \"Jaw Features\": undefined,\n  \"Face Features\": undefined,\n  \"Skin Type\": undefined,\n  Ears: undefined,\n  Horns: undefined,\n  Blindfold: undefined,\n  Tattoo: undefined,\n  \"Eye Color\": undefined,\n  \"Tattoo Color\": undefined,\n  Armbands: undefined,\n  \"Jewelry Color\": undefined,\n  Bracelets: undefined,\n  Necklace: undefined,\n  Earring: undefined\n}\n\n\n\nfunction optionalChaining(choice) {\n  //todo replace by `part.Choices[character[CHARACTER_PART[prop]]]?.Id` when it works on almost all frameworks\n  return choice ? choice.Id : undefined\n}\n\n\n\n/**\n *\n * @param {Object} character - The character object.\n * @param {number} character.face - Description for face.\n * @param {number} character.facialStyle - Description for facialStyle.\n * @param {number} character.gender - Description for gender.\n * @param {number} character.hairColor - Description for hairColor.\n * @param {number} character.hairStyle - Description for hairStyle.\n * @param {Array<Array<number>>} character.items - Description for items. (Optional)\n * @param {number} character.race - Description for race.\n * @param {number} character.skin - Description for skin.\n * @param {Object} fullOptions - Zaming API character options payload.\n * @return {[]}\n */\nfunction getCharacterOptions(character, fullOptions) {\n  const options = fullOptions.Options\n  const ret = []\n  for (const prop in CHARACTER_PART) {\n    const part = options.find(e => e.Name === prop)\n\n    if (!part) {\n      continue\n    }\n\n    const newOption = {\n      optionId: part.Id,\n      choiceId: (CHARACTER_PART[prop]) ? optionalChaining(part.Choices[character[CHARACTER_PART[prop]]]) : part.Choices[0].Id\n    }\n    ret.push(newOption)\n  }\n\n  return ret\n}\n\n/**\n * This function return the design choices for a character this does not work for NPC / Creature / Items\n * @param {Object} model - The model object to generate options from.\n * @param {{}} fullOptions - The type of the model.\n * @returns {{models: {id: string, type: number}, charCustomization: {options: []}, items: (*|*[])}|{models: {id, type}}\n */\nfunction optionsFromModel(model, fullOptions) {\n  const { race, gender } = model\n\n\n  // slot ids on model viewer\n  const characterItems = (model.items) ? model.items.filter(e => !NOT_DISPLAYED_SLOTS.includes(e[0])) : []\n  const options = getCharacterOptions(model, fullOptions)\n\n  const retGender = (gender === 1) ? `female` : `male`\n  const raceToModelId = RACES[race] + retGender\n\n  return {\n    items: characterItems,\n    charCustomization: {\n      options: options\n    },\n    models: {\n      id: raceToModelId,\n      type: 16\n    },\n  }\n}\n\n\n\n/**\n *\n * @param item{number}: Item id\n * @param slot{number}: Item slot number\n * @param displayId{number}: DisplayId of the item\n * @return {Promise<boolean|*>}\n */\nasync function getDisplaySlot(item, slot, displayId) {\n  if (typeof item !== `number`) {\n    throw new Error(`item must be a number`)\n  }\n\n  if (typeof slot !== `number`) {\n    throw new Error(`slot must be a number`)\n  }\n\n  if (typeof displayId !== `number`) {\n    throw new Error(`displayId must be a number`)\n  }\n\n  try {\n    await fetch(`${window.CONTENT_PATH}meta/armor/${slot}/${displayId}.json`)\n      .then(response => response.json())\n\n    return {\n      displaySlot: slot,\n      displayId: displayId\n    }\n  } catch (e) {\n    if (!window.WOTLK_TO_RETAIL_DISPLAY_ID_API) {\n      throw Error(`Item not found and window.WOTLK_TO_RETAIL_DISPLAY_ID_API not set`)\n    }\n    const resp = await fetch(`${window.WOTLK_TO_RETAIL_DISPLAY_ID_API}/${item}/${displayId}`)\n      .then((response) => response.json())\n    const res = resp.data || resp\n    if (res.newDisplayId !== displayId) {\n      return {\n        displaySlot: slot,\n        displayId: res.newDisplayId\n      }\n    }\n  }\n\n  // old slots to new slots\n  const retSlot = {\n    5: 20, // chest\n    16: 21, // main hand\n    18: 22 // off hand\n  }[slot]\n\n  if (!retSlot) {\n    console.warn(`Item: ${item} display: ${displayId} or slot: ${slot} not found for `)\n\n    return {\n      displaySlot: slot,\n      displayId: displayId\n    }\n  }\n\n  return {\n    displaySlot: retSlot,\n    displayId: displayId\n  }\n}\n\n\n\n/**\n * Returns a 2-dimensional list the inner list contains on first position the item slot, the second the item\n * display-id ex: [[1,1170],[3,4925]]\n * @param {*[{item: {entry: number, displayid: number}, transmog: {entry: number, displayid: number}, slot: number}]} equipments\n * @returns {Promise<number[]>}\n */\nasync function findItemsInEquipments(equipments) {\n  for (const equipment of equipments) {\n    if (NOT_DISPLAYED_SLOTS.includes(equipment.slot)) {\n      continue\n    }\n\n    const displayedItem = (Object.keys(equipment.transmog).length !== 0) ? equipment.transmog : equipment.item\n    const displaySlot = await getDisplaySlot(\n      displayedItem.entry,\n      equipment.slot,\n      displayedItem.displayid\n    )\n    equipment.displaySlot = displaySlot.displaySlot\n    equipment.displayId = displaySlot.displayId\n    Object.assign(displaySlot, equipment)\n  }\n  return equipments\n    .filter(e => e.displaySlot)\n    .map(e => [\n      e.displaySlot,\n      e.displayId\n    ]\n    )\n}\n\n\n/**\n *\n * @param {number} race\n * @param {number} gender\n * @returns {Promise<Object>}\n */\nasync function findRaceGenderOptions(race, gender) {\n  const options = await fetch(`${window.CONTENT_PATH}meta/charactercustomization2/${race}_${gender}.json`)\n    .then(\n      (response) => response.json()\n    )\n  if (options.data) {\n    return options.data\n  }\n\n  return options\n}\n\n\n\n\n//# sourceURL=webpack://backend/./dist/renderer/character_modeling.js?");

/***/ }),

/***/ "./dist/renderer/index.js":
/*!********************************!*\
  !*** ./dist/renderer/index.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   findItemsInEquipments: () => (/* reexport safe */ _character_modeling_js__WEBPACK_IMPORTED_MODULE_1__.findItemsInEquipments),\n/* harmony export */   findRaceGenderOptions: () => (/* reexport safe */ _character_modeling_js__WEBPACK_IMPORTED_MODULE_1__.findRaceGenderOptions),\n/* harmony export */   generateModels: () => (/* binding */ generateModels),\n/* harmony export */   getDisplaySlot: () => (/* reexport safe */ _character_modeling_js__WEBPACK_IMPORTED_MODULE_1__.getDisplaySlot)\n/* harmony export */ });\n/* harmony import */ var _wow_model_viewer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wow_model_viewer.js */ \"./dist/renderer/wow_model_viewer.js\");\n/* harmony import */ var _character_modeling_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./character_modeling.js */ \"./dist/renderer/character_modeling.js\");\n/* harmony import */ var _setup_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setup.js */ \"./dist/renderer/setup.js\");\n\n\n\n\n\n\n/**\n *\n * @param aspect {number}: Size of the character\n * @param containerSelector {string}: jQuery selector on the container\n * @param model {{}|{id: number, type: number}}: A json representation of a character\n * @returns {Promise<WowModelViewer>}\n */\nasync function generateModels(aspect, containerSelector, model) {\n  let modelOptions\n  let fullOptions\n  if (model.id && model.type) {\n    const { id, type } = model\n    modelOptions = { models: { id, type } }\n  } else {\n    const { race, gender } = model\n\n    // CHARACTER OPTIONS\n    // This is how we describe a character properties\n    fullOptions = await (0,_character_modeling_js__WEBPACK_IMPORTED_MODULE_1__.findRaceGenderOptions)(\n      race,\n      gender\n    )\n    modelOptions = (0,_character_modeling_js__WEBPACK_IMPORTED_MODULE_1__.optionsFromModel)(model, fullOptions)\n  }\n  const models = {\n    type: 2,\n    contentPath: window.CONTENT_PATH,\n    // eslint-disable-next-line no-undef\n    container: jQuery(containerSelector),\n    aspect: aspect,\n    hd: true,\n    ...modelOptions\n  }\n  window.models = models\n\n  // eslint-disable-next-line no-undef\n  const wowModelViewer = await new _wow_model_viewer_js__WEBPACK_IMPORTED_MODULE_0__.WowModelViewer(models)\n  if (fullOptions) {\n    wowModelViewer.currentCharacterOptions = fullOptions\n    wowModelViewer.characterGender = model.gender\n    wowModelViewer.characterRace = model.race\n\n  }\n  return wowModelViewer\n}\n\n\n\n\n//# sourceURL=webpack://backend/./dist/renderer/index.js?");

/***/ }),

/***/ "./dist/renderer/setup.js":
/*!********************************!*\
  !*** ./dist/renderer/setup.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WH: () => (/* binding */ WH)\n/* harmony export */ });\n\nwindow.CONTENT_PATH = `http://localhost:3001/modelviewer/live/`\nwindow.WOTLK_TO_RETAIL_DISPLAY_ID_API = undefined\n\n\nif (!window.WH) {\n  window.WH = {}\n  window.WH.debug = function(...args) { console.log(args) }\n  window.WH.defaultAnimation = `Stand`\n  window.WH.Wow = {\n    Item: {\n      INVENTORY_TYPE_HEAD: 1,\n      INVENTORY_TYPE_NECK: 2,\n      INVENTORY_TYPE_SHOULDERS: 3,\n      INVENTORY_TYPE_SHIRT: 4,\n      INVENTORY_TYPE_CHEST: 5,\n      INVENTORY_TYPE_WAIST: 6,\n      INVENTORY_TYPE_LEGS: 7,\n      INVENTORY_TYPE_FEET: 8,\n      INVENTORY_TYPE_WRISTS: 9,\n      INVENTORY_TYPE_HANDS: 10,\n      INVENTORY_TYPE_FINGER: 11,\n      INVENTORY_TYPE_TRINKET: 12,\n      INVENTORY_TYPE_ONE_HAND: 13,\n      INVENTORY_TYPE_SHIELD: 14,\n      INVENTORY_TYPE_RANGED: 15,\n      INVENTORY_TYPE_BACK: 16,\n      INVENTORY_TYPE_TWO_HAND: 17,\n      INVENTORY_TYPE_BAG: 18,\n      INVENTORY_TYPE_TABARD: 19,\n      INVENTORY_TYPE_ROBE: 20,\n      INVENTORY_TYPE_MAIN_HAND: 21,\n      INVENTORY_TYPE_OFF_HAND: 22,\n      INVENTORY_TYPE_HELD_IN_OFF_HAND: 23,\n      INVENTORY_TYPE_PROJECTILE: 24,\n      INVENTORY_TYPE_THROWN: 25,\n      INVENTORY_TYPE_RANGED_RIGHT: 26,\n      INVENTORY_TYPE_QUIVER: 27,\n      INVENTORY_TYPE_RELIC: 28,\n      INVENTORY_TYPE_PROFESSION_TOOL: 29,\n      INVENTORY_TYPE_PROFESSION_ACCESSORY: 30\n    }\n\n  }\n  // eslint-disable-next-line no-undef\n}\nconst WH = window.WH\n\n\n\n\n//# sourceURL=webpack://backend/./dist/renderer/setup.js?");

/***/ }),

/***/ "./dist/renderer/wow_model_viewer.js":
/*!*******************************************!*\
  !*** ./dist/renderer/wow_model_viewer.js ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   WowModelViewer: () => (/* binding */ WowModelViewer)\n/* harmony export */ });\n/* harmony import */ var _character_modeling_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./character_modeling.js */ \"./dist/renderer/character_modeling.js\");\n\n\n\n// eslint-disable-next-line no-undef\nclass WowModelViewer extends ZamModelViewer {\n  _currentCharacterOptions = 0 // Direct property initialization\n  _characterGender = null\n  _characterRace = null\n\n\n  // Getter for the attribute\n  get currentCharacterOptions() {\n    return this._currentCharacterOptions\n  }\n\n  // Setter for the attribute\n  set currentCharacterOptions(value) {\n    this._currentCharacterOptions = value\n  }\n\n\n\n  /**\n   *\n   * @return {number|null}\n   */\n  get characterGender() {\n    return this._characterGender\n  }\n\n\n  /**\n   *\n   * @param {number} value\n   */\n  set characterGender(value) {\n    this._characterGender = value\n  }\n\n\n\n  /**\n   *\n   * @return {number|null}\n   */\n  get characterRace() {\n    return this._characterRace\n  }\n\n  /**\n   *\n   * @param {number} value\n   */\n  set characterRace(value) {\n    this._characterRace = value\n  }\n\n  /**\n   * Returns the list of animation names\n   * @returns {Array.<string>}\n   */\n  getListAnimations() {\n    return [...new Set(this.renderer.models[0].ap.map(e => e.j))]\n  }\n\n  /**\n   * Change character distance\n   * @param {number} val\n   */\n  setDistance(val) {\n    this.renderer.distance = val\n  }\n\n  /**\n   * Change the animation\n   * @param {string} val\n   */\n  setAnimation(val) {\n    if (!this.getListAnimations().includes(val)) {\n      console.warn(`${this.constructor.name}: Animation ${val} not found`)\n    }\n    this.renderer.models[0].setAnimation(val)\n  }\n\n  /**\n   * Play / Pause the animation\n   * @param {boolean} val\n   */\n  setAnimPaused(val) {\n    this.renderer.models[0].setAnimPaused(val)\n  }\n\n  /**\n   * Set azimuth value this value is the angle to the azimuth based on PI\n   * @param {number} val\n   */\n  setAzimuth(val) {\n    this.renderer.azimuth = val\n  }\n\n  /**\n   * Set zenith value this value is the angle to the azimuth based on PI\n   * @param {number} val\n   */\n  setZenith(val) {\n    this.renderer.zenith = val\n  }\n\n  /**\n   * Returns azimuth value this value is the angle to the azimuth based on PI\n   * @return {number}\n   */\n  getAzimuth() {\n    return this.renderer.azimuth\n  }\n\n  /**\n   * Returns zenith value this value is the angle to the azimuth based on PI\n   * @return {number}\n   */\n  getZenith() {\n    return this.renderer.zenith\n  }\n\n  /**\n   * This methode is based on `updateViewer` from Paperdoll.js (https://wow.zamimg.com/js/Paperdoll.js?3ee7ec5121)\n   *\n   * @param slot {number}: Item slot number\n   * @param displayId {number}: Item display id\n   * @param enchant {number}: Enchant (experimental not tested)\n   */\n  updateItemViewer(slot, displayId, enchant) {\n    const s = window.WH.Wow.Item\n    if (slot === s.INVENTORY_TYPE_SHOULDERS) {\n      // this.method(`setShouldersOverride`, [this.getShouldersOverrideData()]);\n    }\n    const a = (slot === s.INVENTORY_TYPE_ROBE) ? s.INVENTORY_TYPE_CHEST : slot\n\n    window.WH.debug(`Clearing model viewer slot:`, a.toString())\n    this.method(`clearSlots`, slot.toString())\n    if (displayId) {\n      window.WH.debug(`Attaching to model viewer slot:`, slot.toString(), `Display ID:`, displayId, `Enchant Visual:`, enchant)\n      this.method(`setItems`, [[{\n        slot: slot,\n        display: displayId,\n        visual: enchant || 0\n      }]])\n    }\n  }\n\n  setNewAppearance(options) {\n    if (!this.currentCharacterOptions) {\n      throw Error(`Character options are not set`)\n    }\n    const characterOptions = (0,_character_modeling_js__WEBPACK_IMPORTED_MODULE_0__.getCharacterOptions)(options, this.currentCharacterOptions)\n    const race = this.characterRace\n    const gender = this.characterGender\n    this.method(`setAppearance`, { race: race, gender: gender, options: characterOptions })\n  }\n}\n\n\n\n\n//# sourceURL=webpack://backend/./dist/renderer/wow_model_viewer.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/renderer/index.js");
/******/ 	
/******/ })()
;