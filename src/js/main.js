//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//
import {
    getData,
    setData,
    setDefaultData,
    clearDatas,
    handlePlayerAction,
} from "./modules/data-handler";

import {
    handleMenuToggle,
    disableCheckingAbilityOfDiaryMenuCheckboxes,
    handleOptionsMenuRangeValueDisplay,
    handleOptionsMenuLanguageSelection,
    handleInvMenuItemsDisplay,
    handleTasksAndFindingsDisplay,
    handleMoveButtonClick,
} from "./modules/menus-handler";

import {
    resizeApp,
    makeImagesUndraggable,
    isEven,
    alertMessageShow,
    showLocationName,
    changeSceneObjectsClickability,
} from "./modules/utils";

//===============//
//  IMPORT DATA  //
//===============//

import data from "../data/data.json";

const scenes = data.scenes;
const story = data.story;
const spritesForEachCharacter = data.spritesForEachCharacter;

//========================//
//  HTML ELEMENTS IMPORT  //
//========================//
const container = document.querySelector(".container"),
    app = document.querySelector(".app"),
    sceneBg = document.querySelector(".scene__bg"),
    sceneItems = document.querySelector(".scene__items"),
    sceneCharacters = document.querySelector(".scene__characters"),
    sceneMoveArrows = document.querySelector(".scene__move-arrows"),
    backdrop = document.querySelector(".backdrop"),
    dialogue = document.querySelector(".dialogue"),
    dialogueName = document.querySelector(".dialogue__content__name"),
    dialogueTextContent = document.querySelector(
        ".dialogue__content__text-content",
    ),
    dialogueCharacterImg = document.querySelector(".dialogue__character-img"),
    menus = document.querySelector(".menus"),
    choicesWrapper = document.querySelector(".choices-wrapper"),
    clearBtn = document.querySelector(".clear"),
    sceneTransitionBlind = document.querySelector(".scene-transition-blind");

//=============//
//  VARIABLES  //
//=============//

let textBoxIndex = 0;
let currentTextBoxes = [];
let currentCharacters = [];
let numberOfTextBoxes;

let eventInfo = {
    event: null,
    isInsideOfDialogue: null,
    object: null,
    objectImg: null,
};

const defaultDatas = [
    ["inventory", data.default.inventory],
    ["tasks", data.default.tasks],
    ["findings", data.default.findings],
    ["playerActions", []],
    ["objectsToHide", []],
    ["currentSceneId", 1],
    ["username", null],
];

//=============//
//  FUNCTIONS  //
//=============//

function handleEventType() {
    switch (eventInfo.event.eventType) {
        case "dialogue":
            handleDialogue(eventInfo.event.dialogueId);
            break;
        case "fight":
            break;
        case "choice":
            handleChoice(eventInfo.event.choices, eventInfo.isInsideOfDialogue);
            break;
        case "addToInv":
            addItemToInv(eventInfo.object, eventInfo.objectImg);
            break;
        default:
            console.log("Error, unvalid eventType");
            break;
    }
    eventInfo = {
        event: null,
        isInsideOfDialogue: null,
        object: null,
        objectImg: null,
    };
}

function handleConsequences(consequences) {
    consequences.forEach((consequence) => {
        switch (consequence.consequenceType) {
            case "dialogue":
                handleDialogue(consequence.dialogueId);
                break;
            case "playerAction":
                handlePlayerAction(consequence);
                break;
            default:
                console.log("Error, unvalid consequence.");
                break;
        }
    });
}

function closeDialogue(transitionToChoice) {
    dialogue.classList.add("dialogue--hide");

    setTimeout(() => {
        if (!transitionToChoice) {
            backdrop.classList.remove("backdrop--show");
        }
        dialogue.removeEventListener("click", showDialogue);
        dialogue.classList.remove("dialogue--right");
        dialogue.classList.remove("dialogue--left");
        menus.classList.remove("menus--dialogue-showed");
        dialogue.classList.remove("dialogue--show");
        dialogue.classList.remove("dialogue--hide");
        dialogueTextContent.textContent = "";
        dialogueName.textContent = "";
        dialogueCharacterImg.src = "";
        textBoxIndex = 0;
    }, 300);
}

function closeChoicesWrapper(transitionToDialogue) {
    const choiceBoxes = document.querySelectorAll(".choices-wrapper > div");
    choiceBoxes.forEach((choiceBox) =>
        choiceBox.classList.remove("choice--show"),
    );
    // changeSceneObjectsClickability(true);
    setTimeout(() => {
        choicesWrapper.classList.remove("choices-wrapper--show");
        choicesWrapper.textContent = "";
    }, 400);
}

function handleChoice(choices, isInsideOfDialogue) {
    choices.forEach((choice) => {
        const choiceDiv = document.createElement("div");
        choiceDiv.classList.add("choice");
        const choiceText = document.createElement("p");
        choiceText.textContent = choice.name;

        choiceDiv.addEventListener("click", () => {
            closeChoicesWrapper();
            if (choice.consequences.length === 0) {
                backdrop.classList.remove("backdrop--show");
            } else {
                handleConsequences(choice.consequences);
            }
        });

        choiceDiv.append(choiceText);
        choicesWrapper.append(choiceDiv);
    });
    if (isInsideOfDialogue) {
        closeDialogue(true);
        // changeSceneObjectsClickability(false);
        setTimeout(() => {
            choicesWrapper.classList.add("choices-wrapper--show");
            const choiceBoxes = document.querySelectorAll(
                ".choices-wrapper > div",
            );
            choiceBoxes.forEach((choiceBox) =>
                choiceBox.classList.add("choice--show"),
            );
        }, 300);
    } else {
    }
}

function showDialogue() {
    const selectedTextBox = currentTextBoxes[textBoxIndex];

    if (selectedTextBox && selectedTextBox.eventType === "choice") {
        eventInfo.isInsideOfDialogue = true;
        eventInfo.event = selectedTextBox;
        handleEventType();
    } else {
        if (textBoxIndex > numberOfTextBoxes - 1) {
            closeDialogue(false);
        } else {
            dialogueCharacterImg.src = "";

            // dialogue direction
            if (isEven(selectedTextBox.characterSpeaking) === true) {
                dialogue.classList.remove("dialogue--right");
                dialogue.classList.add("dialogue--left");
            } else {
                dialogue.classList.remove("dialogue--left");
                dialogue.classList.add("dialogue--right");
            }

            dialogueTextContent.textContent = selectedTextBox.lines.join("\n");
            dialogueName.textContent =
                currentCharacters[selectedTextBox.characterSpeaking];
            const whichCharacterSpriteToShow = spritesForEachCharacter.find(
                (character) =>
                    character.name ===
                    currentCharacters[selectedTextBox.characterSpeaking],
            );
            dialogueCharacterImg.src = `/assets/images/characters/dialogue-versions/${whichCharacterSpriteToShow.dialogueVersion}`;
            textBoxIndex++;
        }
    }
}

function handleDialogue(dialogueId) {
    const selectedDialogue = story[dialogueId];
    currentTextBoxes = selectedDialogue.textBoxes;
    currentCharacters = selectedDialogue.characters;
    numberOfTextBoxes = selectedDialogue.textBoxes.length;

    showDialogue(currentTextBoxes[0]);
    dialogue.addEventListener("click", showDialogue);
    // window.onkeydown = (event) => {
    //     if (event.key === "Enter") {
    //         console.log("enter");

    //         showDialogue();
    //     }
    // };
    if (!backdrop.classList.contains("backdrop--show")) {
        backdrop.classList.add("backdrop--show");
    }
    dialogue.classList.add("dialogue--show");
    menus.classList.add("menus--dialogue-showed");
}

function addItemToInv(item, itemImg) {
    if (
        !("require" in item) ||
        getData("playerActions").some(
            (playerAction) => playerAction.playerActionId === item.require,
        )
    ) {
        let inventory = getData("inventory");
        const emptySlotIndex = inventory.findIndex(
            (slot) => slot.name === "Empty",
        );
        if (emptySlotIndex && inventory[7].name !== "Empty") {
            alertMessageShow("Too many items.");
        } else {
            inventory[emptySlotIndex] = item;
            setData("inventory", inventory);
            item.taken = true;
            let objectsToHide = getData("objectsToHide");
            objectsToHide.push(item.name);
            setData("objectsToHide", objectsToHide);
            handleInvMenuItemsDisplay(inventory);
            alertMessageShow(`Added ${item.name} to inventory.`);
            itemImg.classList.add("item--animate");
            itemImg.addEventListener("animationend", () => {
                sceneItems.removeChild(itemImg);
            });
        }
    } else {
        alertMessageShow(`You can't pick up this ${item.name}`);
    }
}

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
            eventInfo.event = object.onClick;
            eventInfo.object = object;
            eventInfo.objectImg = objectImg;
            handleEventType();
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

function handleScene(sceneId) {
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

// from utils.js
window.addEventListener("resize", () => resizeApp(container, app)); // invokes resizeApp() everytime we resize the window
resizeApp(container, app); // invokes resizeApp() once at the loading of the page

makeImagesUndraggable();

// from main.js
clearBtn.addEventListener("click", () => clearDatas());

defaultDatas.forEach((defaultData) => {
    setDefaultData(defaultData[0], defaultData[1]);
});

handleScene(getData("currentSceneId"));

// from menusHandler.js
handleMenuToggle();
disableCheckingAbilityOfDiaryMenuCheckboxes();
handleOptionsMenuRangeValueDisplay();
handleOptionsMenuLanguageSelection();
handleInvMenuItemsDisplay(getData("inventory"));
handleTasksAndFindingsDisplay(getData("tasks"), getData("findings"));
handleMoveButtonClick();
