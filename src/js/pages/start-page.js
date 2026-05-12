import { resizeApp, makeImagesUndraggable } from "../modules/utils";

import { container, app } from "../modules/dom";

import { initModalHandler } from "../modules/modal-handler";

import {
    handleOptionsMenuRangeValueDisplay,
    handleOptionsMenuLanguageSelection,
} from "../modules/menus-handler";

// from utils.js
window.addEventListener("resize", () => resizeApp(container, app)); // invokes resizeApp() everytime we resize the window
resizeApp(container, app); // invokes resizeApp() once at the loading of the page

makeImagesUndraggable();

initModalHandler();
handleOptionsMenuRangeValueDisplay();
handleOptionsMenuLanguageSelection();
