//===============//
//  DATA IMPORT  //
//===============//

import data from "../../data/data";

//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import {
    sceneBg,
    sceneItems,
    sceneCharacters,
    sceneMoveArrows,
    sceneTransitionBlind,
} from "./dom";

//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//

import { getData, setData } from "./data-handler";

import { showLocationName } from "./utils";

import { handleEventType } from "./event-handler";

//=============//
//  VARIABLES  //
//=============//

const scenes = data.scenes;

//=============//
//  FUNCTIONS  //
//=============//

function handleSceneObject(object, objectType) {
    const objectImg = document.createElement("img");

    objectImg.classList.add(`${objectType}`);

    objectImg.draggable = false;
    objectImg.src = `/assets/images/${objectType}s/${object.img}`;
    objectImg.alt = object.name;
    objectImg.title = object.name;
    objectImg.style.top = `${object.y}px`;
    objectImg.style.left = `${object.x}px`;

    object.onClick &&
        objectImg.addEventListener("click", () => {
            const eventInfo = {
                event: object.onClick,
                object: object,
                objectImg: objectImg,
            };
            handleEventType(eventInfo);
        });

    if (getData("objectsToHide").includes(object.name)) {
        return;
    } else if (objectType === "item") {
        sceneItems.append(objectImg);
    } else if (objectType === "character") {
        sceneCharacters.append(objectImg);
    } else {
        console.log("Error, unvalid objectType.");
    }
}

function handleMoveArrow(moveArrow) {
    const moveArrowImg = document.createElement("img");
    moveArrowImg.classList.add("move-arrow");
    moveArrowImg.src = `${data.moveArrowImgPathBeginning}${moveArrow.shape}.png`;
    moveArrowImg.draggable = false;
    switch (moveArrow.arrowType) {
        case "bottom":
            moveArrowImg.style.bottom = "3px";
            moveArrowImg.style.left = "117px";
            break;
        case "left":
            // to be determined
            break;
        case "right":
            // to be determined
            break;
        case "custom":
            moveArrowImg.style.top = `${moveArrow.y}px`;
            moveArrowImg.style.left = `${moveArrow.x}px`;
            break;
        default:
            console.log("Error, unvalid arrowType.");
    }
    moveArrowImg.addEventListener("click", () =>
        handleScene(moveArrow.goToSceneId),
    );
    sceneMoveArrows.append(moveArrowImg);
}

export function handleScene(sceneId) {
    const selectedScene = scenes.find((scene) => scene.sceneId === sceneId);

    if (selectedScene) {
        sceneTransitionBlind.classList.add("scene-transition-blind--show");

        sceneTransitionBlind.addEventListener(
            "animationend",
            function handleSceneTransition(event) {
                if (event.animationName === "blindFadeIn") {
                    sceneBg.onload = () => {
                        sceneTransitionBlind.classList.remove(
                            "scene-transition-blind--show",
                        );
                        sceneTransitionBlind.classList.add(
                            "scene-transition-blind--hide",
                        );

                        showLocationName(selectedScene.name);
                    };
                    sceneBg.onerror = () =>
                        console.log("Error, can't load the image.");

                    sceneBg.src = `/assets/images/backgrounds/${selectedScene.bg}`;
                    sceneBg.alt = selectedScene.name;

                    sceneItems.textContent = "";
                    sceneCharacters.textContent = "";
                    sceneMoveArrows.textContent = "";

                    selectedScene.items?.forEach((item) =>
                        handleSceneObject(item, "item"),
                    );
                    selectedScene.characters?.forEach((character) =>
                        handleSceneObject(character, "character"),
                    );
                    selectedScene.movementArrows?.forEach((moveArrow) =>
                        handleMoveArrow(moveArrow),
                    );
                } else if (event.animationName === "blindFadeOut") {
                    sceneTransitionBlind.classList.remove(
                        "scene-transition-blind--hide",
                    );
                    sceneTransitionBlind.removeEventListener(
                        "animationend",
                        handleSceneTransition,
                    );
                }
            },
        );

        if (getData("currentSceneId") !== sceneId) {
            setData("currentSceneId", sceneId);
        }
    } else {
        console.log("Error 404, unvalid scene id.");
    }
}
