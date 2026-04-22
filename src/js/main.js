//===============//
//  DATA IMPORT  //
//===============//

import data from "../data/data";

//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import { container, app, clearBtn } from "./modules/dom";

//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//

import { setDefaultData, clearDatas } from "./modules/data-handler";

import { resizeApp, makeImagesUndraggable } from "./modules/utils";

import { initMenusHandler } from "./modules/menus-handler";

import { handleScene } from "./modules/scene-handler";

//=============//
//  VARIABLES  //
//=============//

const defaultDatas = [
    ["inventory", data.default.inventory],
    ["tasks", data.default.tasks],
    ["findings", data.default.findings],
    ["playerActions", []],
    ["objectsToHide", []],
    ["currentSceneId", 1],
    ["username", null],
];

//===============//
//  INVOCATIONS  //
//===============//

// from utils
window.addEventListener("resize", () => resizeApp(container, app)); // invokes resizeApp() everytime we resize the window
resizeApp(container, app); // invokes resizeApp() once at the loading of the page

makeImagesUndraggable();

// from main (current file)
clearBtn.addEventListener("click", () => clearDatas());

defaultDatas.forEach((defaultData) => {
    setDefaultData(defaultData[0], defaultData[1]);
});

handleScene(getData("currentSceneId"));

// from menusHandler
initMenusHandler();
