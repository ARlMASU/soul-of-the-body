//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//
import {
    disableCheckingAbilityFromDiaryMenuCheckboxes,
    handleOptionsMenuRangeValueDisplay,
    handleOptionsMenuLanguageSelection,
    handleDiaryMenuTasksAndFindingsDisplay,
    handleInvMenuItemsDisplay,
    handleMenuToggle,
    handleMoveButtonClick,
} from "./modules/menus-handler.js";
import {
    resizeApp,
    makeImagesUndraggable,
    isEven,
    alertMessageShow,
    changeSceneObjectsClickability,
} from "./modules/utils.js";

//========================//
//  HTML ELEMENTS IMPORT  //
//========================//
const container = document.querySelector(".container"),
    app = document.querySelector(".app"),
    sceneBg = document.querySelector(".scene__bg"),
    sceneItems = document.querySelector(".scene__items"),
    sceneCharacters = document.querySelector(".scene__characters"),
    sceneMoveArrows = document.querySelector(".scene__move-arrows"),
    dialogue = document.querySelector(".dialogue"),
    dialogueName = document.querySelector(".dialogue__content__name"),
    dialogueTextContent = document.querySelector(
        ".dialogue__content__text-content",
    ),
    dialogueCharacterImg = document.querySelector(".dialogue__character-img"),
    menus = document.querySelector(".menus"),
    choicesWrapper = document.querySelector(".choices-wrapper");

//===============//
//  IMPORT DATA  //
//===============//

import data from "../data/data.json";

const dummyInv = [
    {
        name: "Owly's postcard",
        img: "owly-s-postcard.png",
    },
    {
        name: "Empty",
    },
    {
        name: "Empty",
    },
    {
        name: "Empty",
    },
    {
        name: "Empty",
    },
    {
        name: "Empty",
    },
    {
        name: "Empty",
    },
    {
        name: "Empty",
    },
];
const dummyTasks = [
    {
        name: "Beat Asriel",
        completed: false,
    },
    {
        name: "Beat Flowey",
        completed: false,
    },
    {
        name: "Beat Asgore",
        completed: false,
    },
    ,
    {
        name: "Beat Undyne",
        completed: false,
    },
    {
        name: "Beat Levil",
        completed: true,
    },
    {
        name: "Beat Sans",
        completed: false,
    },
];
const dummyFindings = [
    "You killed Mummy.",
    "You joined Levil.",
    "You are dead.",
];
const dummyScenes = [
    {
        id: 1,
        name: "The Front of the Desert Pyramid",
        biome: "desert",
        zone: "pyramid",
        position: "front",
        bg: "desert-pyramid-front.gif",
        items: [
            {
                name: "Bomb",
                img: "bomb.png",
                x: 24,
                y: 103,
                onClick: { eventType: "addToInv" },
                taken: false,
                require: 0,
            },
        ],
        characters: [
            {
                name: "Smiling guy",
                img: "smiling-guy.png",
                x: 200,
                y: 87,
                onClick: {
                    eventType: "dialogue",
                    dialogueId: 1,
                },
            },
        ],
        movementArrows: [
            {
                arrowType: "bottom",
                shape: "bottom",
                goToSceneId: 2,
            },
            {
                arrowType: "custom",
                shape: "top-right",
                x: 161,
                y: 111,
                goToSceneId: 1,
            },
        ],
    },
    {
        id: 2,
        name: "",
        biome: "desert",
        zone: "path",
        bg: "desert-path.png",
        items: [],
        characters: [
            {
                name: "Wally",
                img: "wally.png",
                x: 75,
                y: 55,
                onClick: {
                    eventType: "dialogue",
                    dialogueId: 0,
                },
            },
        ],
        movementArrows: [
            {
                arrowType: "custom",
                shape: "top-right",
                x: 161,
                y: 111,
                goToSceneId: 1,
            },
            {
                arrowType: "custom",
                shape: "top-left",
                x: 71,
                y: 111,
                goToSceneId: 3,
            },
        ],
    },
];
const story = [
    {
        dialogueId: 0,
        characters: ["You", "Wally"],
        textBoxes: [
            {
                characterSpeaking: 1,
                expression: "smiling",
                lines: [
                    "HIIII!!!!! I'M WALLYYYYYY.",
                    "i'm a wall HAHAHAHAHAAHHAHA.",
                ],
            },
            {
                characterSpeaking: 0,
                expression: "idle",
                lines: ["O-Okay??"],
            },
            {
                characterSpeaking: 1,
                expression: "smiling",
                lines: [
                    "WALLYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY!",
                ],
            },
            {
                characterSpeaking: 0,
                expression: "idle",
                lines: ["Yep, that's your name."],
            },
            {
                eventType: "choice",
                choices: [
                    {
                        name: '"That\'s super cool!"',
                        consequences: [
                            {
                                consequenceType: "playerAction",
                                id: 0,
                                name: "Told Wally that he was super cool.",
                            },
                            {
                                consequenceType: "dialogue",
                                dialogueId: 2,
                            },
                        ],
                    },
                    {
                        name: "Leave the conversation",
                        consequences: [],
                    },
                ],
            },
        ],
    },
    {
        dialogueId: 1,
        characters: ["You", "Smiling guy"],
        textBoxes: [
            {
                characterSpeaking: 1,
                expression: "smiling",
                lines: [
                    "Hi you.",
                    "Lorem ipsum etc man i don't even care at this point.",
                ],
            },
            {
                characterSpeaking: 0,
                expression: "idle",
                lines: ["Woah man, calm down."],
            },
            {
                characterSpeaking: 1,
                expression: "smiling",
                lines: [
                    "Yeah sorry, i'm just tired of being called the lorem ipsum guy, you know ?",
                    "Like, i'm not only defined by that, i like video-games, music and stuff!",
                    "i don't just say lorem ipsum blablabla all the time...",
                ],
            },
            {
                characterSpeaking: 0,
                expression: "idle",
                lines: ["Yeah man, I get you."],
            },
        ],
    },
    {
        dialogueId: 2,
        characters: ["You", "Wally"],
        textBoxes: [
            {
                characterSpeaking: 1,
                expression: "smiling",
                lines: ["REAALLYYYY????", "THANKS MAN!!!!!!!"],
            },
            {
                characterSpeaking: 0,
                expression: "idle",
                lines: ["No problem"],
            },
        ],
    },
];

//=============//
//  VARIABLES  //
//=============//
const spritesForEachCharacter = [
    {
        name: "You",
        dialogueVersion: "dark-smiling-guy.png",
    },
    {
        name: "Smiling guy",
        dialogueVersion: "smiling-guy.png",
    },
    {
        name: "Wally",
        dialogueVersion: "wally.png",
    },
];

const moveArrowImgPathBeginning = "./assets/images/icons/move-arrows/arrow-";

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

const playerActions = [];

//=============//
//  FUNCTIONS  //
//=============//

// from utils.js
window.addEventListener("resize", () => resizeApp(container, app)); // invokes resizeApp() everytime we resize the window
resizeApp(container, app); // invokes resizeApp() once at the loading of the page

makeImagesUndraggable();

//from menusHandler.js
handleOptionsMenuRangeValueDisplay();
handleOptionsMenuLanguageSelection();
disableCheckingAbilityFromDiaryMenuCheckboxes();
handleInvMenuItemsDisplay(dummyInv);
handleDiaryMenuTasksAndFindingsDisplay(dummyTasks, dummyFindings);
handleMenuToggle();
handleMoveButtonClick();

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
        default:
            console.log("Error, unvalid eventType");
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
                if (
                    !playerActions.some(
                        (playerAction) => playerAction.id === consequence.id,
                    )
                ) {
                    playerActions.push(consequence);
                }
                break;
            default:
                console.log("Error, unvalid consequences.");
        }
    });
}

function closeChoicesWrapper() {
    const choiceBoxes = document.querySelectorAll(".choices-wrapper > div");
    choiceBoxes.forEach((choiceBox) =>
        choiceBox.classList.remove("choice--show"),
    );
    changeSceneObjectsClickability(true);
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
            handleConsequences(choice.consequences);
        });

        choiceDiv.append(choiceText);
        choicesWrapper.append(choiceDiv);
    });
    if (isInsideOfDialogue) {
        closeDialogue();
        changeSceneObjectsClickability(false);
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

function closeDialogue() {
    dialogue.classList.add("dialogue--hide");
    setTimeout(() => {
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

function showDialogue() {
    const selectedTextBox = currentTextBoxes[textBoxIndex];
    if (selectedTextBox && selectedTextBox.eventType === "choice") {
        eventInfo.isInsideOfDialogue = true;
        eventInfo.event = selectedTextBox;
        handleEventType();
    } else {
        if (textBoxIndex > numberOfTextBoxes - 1) {
            closeDialogue();
        } else {
            dialogueCharacterImg.src = "";
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
            dialogueCharacterImg.src = `./assets/images/characters/dialogue-versions/${
                whichCharacterSpriteToShow.dialogueVersion
            }`;
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

    dialogue.classList.add("dialogue--show");
    menus.classList.add("menus--dialogue-showed");
}

function addItemToInv(item, itemImg) {
    if (
        !("require" in item) ||
        playerActions.some((playerAction) => playerAction.id === item.require)
    ) {
        const emptySlotIndex = dummyInv.findIndex(
            (slot) => slot.name === "Empty",
        );
        if (emptySlotIndex && dummyInv[7].name !== "Empty") {
            alertMessageShow("Too many items.");
        } else {
            dummyInv[emptySlotIndex] = item;
            item.taken = true;
            handleInvMenuItemsDisplay(dummyInv);
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
    objectImg.src = `./assets/images/${objectType}s/${object.img}`;
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
    if (objectType === "item" && object.taken === false) {
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
    moveArrowImg.src = `${moveArrowImgPathBeginning}${moveArrow.shape}.png`;
    switch (moveArrow.arrowType) {
        case "bottom":
            moveArrowImg.style.bottom = "3px";
            moveArrowImg.style.left = "117px";
            break;
        case "left":
            break;
        case "right":
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
    sceneItems.textContent = "";
    sceneCharacters.textContent = "";
    sceneMoveArrows.textContent = "";
    const selectedScene = dummyScenes.find((scene) => scene.id === sceneId);
    if (selectedScene) {
        sceneBg.src = `./assets/images/backgrounds/${selectedScene.bg}`;
        sceneBg.alt = selectedScene.name;
        selectedScene.items?.forEach((item) => handleSceneObject(item, "item"));
        selectedScene.characters?.forEach((character) =>
            handleSceneObject(character, "character"),
        );
        selectedScene.movementArrows?.forEach((moveArrow) =>
            handleMoveArrow(moveArrow),
        );
    } else {
        console.log("Error 404, unvalid scene id.");
    }
}

handleScene(1);
