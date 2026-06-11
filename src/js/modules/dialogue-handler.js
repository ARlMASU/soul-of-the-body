//===============//
//  DATA IMPORT  //
//===============//

import data from "../../data/data";

//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import {
    backdrop,
    dialogue,
    dialogueCharacterImg,
    dialogueName,
    dialogueTextContent,
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

    let previousCharacter;
    let currentCharacter;
    let nextCharacter;

    let displayTextCount = 0;
    let showNextCharacter;

    typing = false;
    skipDialogue = false;

    const checkCharacter = (character) => {
        return charactersToCompare.includes(character);
    };

    const setShowNextCharacter = (duration) => {
        showNextCharacter = setTimeout(handleDisplayText, duration);
    };

    const handleDisplayText = () => {
        displayText += completeText.charAt(displayTextCount);

        previousCharacter = completeText.charAt(displayTextCount - 1);
        currentCharacter = completeText.charAt(displayTextCount);
        nextCharacter = completeText.charAt(displayTextCount + 1);

        displayTextCount++;
        dialogueTextContent.textContent = displayText;

        if (currentCharacter === ",") {
            setShowNextCharacter(175);
        } else if (currentCharacter === "." && nextCharacter === ".") {
            setShowNextCharacter(200);
        } else if (
            !checkCharacter(currentCharacter) &&
            checkCharacter(previousCharacter)
        ) {
            setShowNextCharacter(250);
        } else {
            setShowNextCharacter(27.5);
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

    handleDisplayText(); // initial invoke
}

function closeDialogue(transitionToChoice) {
    dialogue.removeEventListener("click", onDialogueClick);
    backdrop.removeEventListener("click", onDialogueClick);
    window.removeEventListener("keydown", onDialogueKeyPress);

    dialogue.classList.add("dialogue--hide");

    setTimeout(() => {
        if (!transitionToChoice) {
            backdrop.classList.remove("backdrop--show");
            menus.classList.remove("menus--overlay-showed");
        }

        dialogue.classList.remove("dialogue--right");
        dialogue.classList.remove("dialogue--left");

        dialogue.classList.remove("dialogue--show");
        dialogue.classList.remove("dialogue--hide");

        dialogueTextContent.textContent = "";
        dialogueName.textContent = "";
        dialogueCharacterImg.src = "";

        textBoxIndex = 0;
    }, 300);
}

export function showDialogue(textBox) {
    if (textBox && textBox?.eventType) {
        // if the textBox contains an eventType (which means it's not lines of the dialogue)
        const eventInfo = {
            event: textBox,
            overlayMode: true,
        };

        if (textBox.eventType === "choice") {
            // if it's a choice,
            closeDialogue(true); // close the dialogue without removing the backdrop (to transition smoothly into the choice selection screen)
        }

        handleEventType(eventInfo);
    } else {
        if (textBoxIndex > numberOfTextBoxes - 1) {
            // if we've reached the end of the dialogue,
            closeDialogue(false);
        } else {
            dialogueCharacterImg.src = ""; // reset character's image/sprite
            dialogue.classList.remove("dialogue--no-speaker");

            if (textBoxIndex === 0) {
                setTimeout(() => typeWriter(textBox.lines.join("")), 250); // wait for the end of the entry transition before showing the text
            } else {
                typeWriter(textBox.lines.join("")); // merge the different lines with a linebreak between them
            }

            const whichSpriteToShow = spritesForEachCharacter.find(
                (character) =>
                    character.name ===
                    currentCharacters[textBox.characterSpeaking], // return the name of the character speaking
            );

            if (whichSpriteToShow && whichSpriteToShow?.dialogueVersion) {
                // if we found a match for the character AND this character has a sprite,
                dialogueCharacterImg.src = `/assets/images/characters/dialogue-versions/${whichSpriteToShow.dialogueVersion}`; // show it

                dialogueName.textContent =
                    currentCharacters[textBox.characterSpeaking]; // return the name of the character speaking

                // dialogue direction
                if (isEven(textBox.characterSpeaking) === true) {
                    dialogue.classList.remove("dialogue--right");
                    dialogue.classList.add("dialogue--left");
                } else {
                    dialogue.classList.remove("dialogue--left");
                    dialogue.classList.add("dialogue--right");
                }
            } else {
                // change the dialogue box to the no-speaker version
                dialogue.classList.add("dialogue--no-speaker");
            }

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
    menus.classList.add("menus--overlay-showed");
}
