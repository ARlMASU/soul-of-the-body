//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import { backdrop, choicesWrapper } from "./dom";

//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//

import { handleDialogue } from "./dialogue-handler";
import { handleEventType } from "./event-handler";

//=============//
//  FUNCTIONS  //
//=============//

function closeChoicesWrapper() {
    const choiceBoxes = document.querySelectorAll(".choices-wrapper > div"); // select every choiceBox
    choiceBoxes.forEach(
        (choiceBox) => choiceBox.classList.remove("choice--show"), // trigger hiding animation
    );
    setTimeout(() => {
        // after the hiding animation,
        choicesWrapper.classList.remove("choices-wrapper--show"); // remove choicesWrapper visibility
        choicesWrapper.textContent = ""; // remove every choiceBox
    }, 400);
}

export function handleChoice(choices, isInsideOfDialogue) {
    choices.forEach((choice) => {
        const choiceDiv = document.createElement("div"); // create a choiceBox
        choiceDiv.classList.add("choice");

        const choiceBg = document.createElement("img"); // create a background for the choiceBox
        choiceBg.src = "/assets/images/menus/choices/choice-box.webp";
        choiceBg.draggable = false;

        const choiceText = document.createElement("p"); // create and add choice's text
        choiceText.textContent = choice.name;

        choiceDiv.addEventListener("click", () => {
            // on choice selection,
            closeChoicesWrapper(); // hide the choices
            if (!choice.consequences || choice.consequences?.length === 0) {
                // if no consequences,

                backdrop.classList.remove("backdrop--show"); // simply remove the backdrop, which lets the player continue the game
            } else {
                choice.consequences.forEach((consequence) => {
                    const eventInfos = {
                        event: consequence,
                    };
                    handleEventType(eventInfos);
                });
            }
        });

        choiceDiv.append(choiceBg, choiceText);
        choicesWrapper.append(choiceDiv);
    });

    const showChoices = () => {
        choicesWrapper.classList.add("choices-wrapper--show");
        const choiceBoxes = document.querySelectorAll(".choices-wrapper > div");
        choiceBoxes.forEach((choiceBox) =>
            choiceBox.classList.add("choice--show"),
        );
    };

    if (isInsideOfDialogue) {
        // if in a dialogue (which already shows the backdrop), wait for the closing animation of the dialogue to finish before showing the choices
        setTimeout(showChoices, 300);
    } else {
        backdrop.classList.add("backdrop--show"); // show the backdrop (since it's not shown up yet)
        setTimeout(showChoices, 50);
    }
}
