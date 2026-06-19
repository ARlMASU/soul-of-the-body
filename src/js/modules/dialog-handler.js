//===============//
//  DATA IMPORT  //
//===============//

import data from "../../data/data";

//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import {
    backdrop,
    dialog,
    dialogCharacterImg,
    dialogName,
    dialogTextContent,
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
let skipdialog = false;
let clickCooldown = false;

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
    skipdialog = false;

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
        dialogTextContent.textContent = displayText;

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

        if (skipdialog === true) {
            clearTimeout(showNextCharacter);
            displayTextCount = completeText.length + 1;

            skipdialog = false;
            showNextCharacter = setTimeout(() => {
                displayText = completeText;
                dialogTextContent.textContent = displayText;
                typing = false;
            }, 0);
        }

        showNextCharacter;
    };

    handleDisplayText(); // initial invoke
}

function closedialog(transitionToChoice) {
    dialog.removeEventListener("click", ondialogClick);
    backdrop.removeEventListener("click", ondialogClick);
    window.removeEventListener("keydown", ondialogKeyPress);

    dialog.classList.add("dialog--hide");

    setTimeout(() => {
        if (!transitionToChoice) {
            backdrop.classList.remove("backdrop--show");
            menus.classList.remove("menus--overlay-showed");
        }

        dialog.classList.remove("dialog--right");
        dialog.classList.remove("dialog--left");

        dialog.classList.remove("dialog--show");
        dialog.classList.remove("dialog--hide");

        dialogTextContent.textContent = "";
        dialogName.textContent = "";
        dialogCharacterImg.src = "";

        textBoxIndex = 0;
    }, 300);
}

export function showdialog(textBox) {
    if (textBox?.eventType) {
        // if the textBox contains an eventType (which means it's not lines of the dialog)
        const eventInfo = {
            event: textBox,
            overlayMode: true,
        };

        if (textBox.eventType === "choice") {
            // if it's a choice,
            closedialog(true); // close the dialog without removing the backdrop (to transition smoothly into the choice selection screen)
        }

        handleEventType(eventInfo);
    } else {
        if (textBoxIndex > numberOfTextBoxes - 1) {
            // if we've reached the end of the dialog,
            closedialog(false);
        } else {
            dialogCharacterImg.src = ""; // reset character's image/sprite
            dialog.classList.remove("dialog--no-speaker");

            if (textBoxIndex === 0) {
                setTimeout(() => typeWriter(textBox.lines.join("\n")), 250); // wait for the end of the entry transition before showing the text
            } else {
                typeWriter(textBox.lines.join("\n")); // merge the different lines with a linebreak between them
            }

            const whichSpriteToShow = spritesForEachCharacter.find(
                (character) =>
                    character.name ===
                    currentCharacters[textBox.characterSpeaking], // return the name of the character speaking
            );

            if (whichSpriteToShow?.dialogVersion) {
                // if we found a match for the character AND this character has a sprite,
                dialogCharacterImg.src = `/assets/images/characters/dialog-versions/${whichSpriteToShow.dialogVersion}`; // show it

                dialogName.textContent =
                    currentCharacters[textBox.characterSpeaking]; // return the name of the character speaking

                // dialog direction
                if (isEven(textBox.characterSpeaking) === true) {
                    dialog.classList.remove("dialog--right");
                    dialog.classList.add("dialog--left");
                } else {
                    dialog.classList.remove("dialog--left");
                    dialog.classList.add("dialog--right");
                }
            } else {
                // change the dialog box to the no-speaker version
                dialog.classList.add("dialog--no-speaker");
            }

            textBoxIndex++;
        }
    }
}

const ondialogClick = () => {
    if (typing === true) {
        skipdialog = true;
    } else if (clickCooldown === false) {
        showdialog(currentTextBoxes[textBoxIndex]);
    }

    clickCooldown = true;

    setTimeout(() => {
        clickCooldown = false;
    }, 300);
};

const ondialogKeyPress = (event) => {
    if (event.code === "Enter" || event.code === "Space") {
        ondialogClick();
    }
};

export function handledialog(dialogId) {
    const selecteddialog = story[dialogId];

    textBoxIndex = 0;
    currentTextBoxes = selecteddialog.textBoxes;
    currentCharacters = selecteddialog.characters;
    numberOfTextBoxes = selecteddialog.textBoxes.length;

    showdialog(currentTextBoxes[textBoxIndex]);

    dialog.removeEventListener("click", ondialogClick);
    backdrop.removeEventListener("click", ondialogClick);
    window.removeEventListener("keydown", ondialogKeyPress);

    dialog.addEventListener("click", ondialogClick);
    backdrop.addEventListener("click", ondialogClick);
    window.addEventListener("keydown", ondialogKeyPress);

    if (!backdrop.classList.contains("backdrop--show")) {
        backdrop.classList.add("backdrop--show");
    }

    dialog.classList.add("dialog--show");
    menus.classList.add("menus--overlay-showed");
}
