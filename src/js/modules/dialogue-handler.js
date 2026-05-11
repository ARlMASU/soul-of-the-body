//===============//
//  DATA IMPORT  //
//===============//

import data from "../../data/data";

//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import {
    dialogue,
    dialogueName,
    dialogueTextContent,
    dialogueCharacterImg,
    backdrop,
    menus,
} from "./dom";

//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//

import { isEven } from "./utils";

import { handleEventType } from "./event-handler";

//=============//
//  VARIABLES  //
//=============//

const story = data.story;
const spritesForEachCharacter = data.spritesForEachCharacter;

let textBoxIndex = 0;
let currentTextBoxes = [];
let currentCharacters = [];
let numberOfTextBoxes;

let typing = false;
let skipDialogue = false;
let recentlyClicked = false;

const charactersToCompare = [".", ";", "!", "?"];

//=============//
//  FUNCTIONS  //
//=============//

function typeWriter(completeText) {
    let displayText = "";
    let currentCharacter;
    let displayTextCount = 0;
    let showNextCharacter;

    typing = false;
    skipDialogue = false;

    const handleDisplayText = () => {
        displayText += completeText.charAt(displayTextCount);
        currentCharacter = completeText.charAt(displayTextCount);
        displayTextCount++;
        dialogueTextContent.textContent = displayText;

        const nextCharacter = completeText.charAt(displayTextCount + 1);
        const previousCharacter = completeText.charAt(displayTextCount - 1);

        if (currentCharacter === ",") {
            showNextCharacter = setTimeout(handleDisplayText, 175);
        } else if (charactersToCompare.includes(currentCharacter)) {
            if (charactersToCompare.includes(nextCharacter)) {
                showNextCharacter = setTimeout(handleDisplayText, 75);
            } else {
                showNextCharacter = setTimeout(handleDisplayText, 200);
            }
        } else if (charactersToCompare.includes(previousCharacter)) {
            showNextCharacter = setTimeout(handleDisplayText, 250);
        } else {
            showNextCharacter = setTimeout(handleDisplayText, 27.5);
        }

        if (displayText.length >= completeText.length) {
            clearTimeout(showNextCharacter);
            typing = false;
        } else {
            typing = true;
        }

        if (skipDialogue === true) {
            clearTimeout(showNextCharacter);
            displayTextCount = completeText.length + 1;

            skipDialogue = false;
            showNextCharacter = setTimeout(() => {
                displayText = completeText;
                dialogueTextContent.textContent = displayText;
                typing = false;
            }, 0);
        }

        showNextCharacter;
    };

    handleDisplayText();
}

export function closeDialogue(transitionToChoice) {
    dialogue.removeEventListener("click", onDialogueClick);
    backdrop.removeEventListener("click", onDialogueClick);
    window.removeEventListener("keydown", onDialogueKeyPress);

    dialogue.classList.add("dialogue--hide");

    setTimeout(() => {
        if (!transitionToChoice) {
            backdrop.classList.remove("backdrop--show");
        }

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

export function showDialogue(textBox) {
    if (textBox && textBox.eventType === "choice") {
        const eventInfo = {
            event: textBox,
            isInsideOfDialogue: true,
        };

        handleEventType(eventInfo);
    } else {
        if (textBoxIndex > numberOfTextBoxes - 1) {
            closeDialogue(false);
        } else {
            dialogueCharacterImg.src = "";

            // dialogue direction
            if (isEven(textBox.characterSpeaking) === true) {
                dialogue.classList.remove("dialogue--right");
                dialogue.classList.add("dialogue--left");
            } else {
                dialogue.classList.remove("dialogue--left");
                dialogue.classList.add("dialogue--right");
            }

            typeWriter(textBox.lines.join("\n"));
            dialogueName.textContent =
                currentCharacters[textBox.characterSpeaking];

            const whichCharacterSpriteToShow = spritesForEachCharacter.find(
                (character) =>
                    character.name ===
                    currentCharacters[textBox.characterSpeaking],
            );
            dialogueCharacterImg.src = `/assets/images/characters/dialogue-versions/${whichCharacterSpriteToShow.dialogueVersion}`;

            textBoxIndex++;
        }
    }
}

const onDialogueClick = () => {
    if (typing === true) {
        skipDialogue = true;
    } else if (recentlyClicked === false) {
        showDialogue(currentTextBoxes[textBoxIndex]);
    }

    recentlyClicked = true;

    setTimeout(() => {
        recentlyClicked = false;
    }, 300);
};

const onDialogueKeyPress = (event) => {
    if (event.code === "Enter" || event.code === "Space") {
        onDialogueClick();
    }
};

export function handleDialogue(dialogueId) {
    const selectedDialogue = story[dialogueId];

    textBoxIndex = 0;
    currentTextBoxes = selectedDialogue.textBoxes;
    currentCharacters = selectedDialogue.characters;
    numberOfTextBoxes = selectedDialogue.textBoxes.length;

    showDialogue(currentTextBoxes[textBoxIndex]);

    dialogue.removeEventListener("click", onDialogueClick);
    backdrop.removeEventListener("click", onDialogueClick);
    window.removeEventListener("keydown", onDialogueKeyPress);

    dialogue.addEventListener("click", onDialogueClick);
    backdrop.addEventListener("click", onDialogueClick);
    window.addEventListener("keydown", onDialogueKeyPress);

    if (!backdrop.classList.contains("backdrop--show")) {
        backdrop.classList.add("backdrop--show");
    }

    dialogue.classList.add("dialogue--show");
    menus.classList.add("menus--dialogue-showed");
}
