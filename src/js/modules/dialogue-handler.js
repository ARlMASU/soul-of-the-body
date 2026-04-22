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

//=============//
//  FUNCTIONS  //
//=============//

export function closeDialogue(transitionToChoice) {
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

            dialogueTextContent.textContent = textBox.lines.join("\n");
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
    showDialogue(currentTextBoxes[textBoxIndex]);
};

export function handleDialogue(dialogueId) {
    const selectedDialogue = story[dialogueId];

    textBoxIndex = 0;
    currentTextBoxes = selectedDialogue.textBoxes;
    currentCharacters = selectedDialogue.characters;
    numberOfTextBoxes = selectedDialogue.textBoxes.length;

    showDialogue(currentTextBoxes[textBoxIndex]);

    dialogue.removeEventListener("click", onDialogueClick);
    dialogue.addEventListener("click", onDialogueClick);
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
