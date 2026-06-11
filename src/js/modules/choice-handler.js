//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import { backdrop, choicesWrapper, menus } from "./dom";

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
    const titleElement = document.querySelector(".choices-wrapper__title");
    titleElement.classList.remove("choices-wrapper__title--show");
    setTimeout(() => {
        // after the hiding animation,
        choicesWrapper.classList.remove("choices-wrapper--show"); // remove choicesWrapper visibility
        choicesWrapper.textContent = ""; // remove every choiceBox
    }, 200);
}

export function handleChoice(title, choices, overlayMode) {
    const createChoices = () => {
        choices.forEach((choice) => {
            const choiceDiv = document.createElement("div"); // create a choiceBox
            choiceDiv.classList.add("choice");

            const choiceBg = document.createElement("img"); // create a background for the choiceBox
            choiceBg.src = "/assets/images/ui/choices/choice-box.webp";
            choiceBg.draggable = false;

            const choiceText = document.createElement("p"); // create and add choice's text
            choiceText.textContent = choice.name;

            choiceDiv.addEventListener("click", () => {
                // on choice selection,
                closeChoicesWrapper(); // hide the choices

                if (!choice.consequences || choice.consequences?.length === 0) {
                    console.log("no consequences");

                    // if no consequences,
                    backdrop.classList.remove("backdrop--show"); // simply remove the backdrop, which lets the player continue the game
                    menus.classList.remove("menus--overlay-showed");
                } else {
                    choice.consequences.forEach((consequence) => {
                        const eventInfos = {
                            event: consequence,
                        };

                        if (
                            consequence.eventType === "dialogue" ||
                            consequence.eventType === "choice"
                        ) {
                            eventInfos.overlayMode = true;
                            console.log(
                                "overlayMode = true, eventType = dialogue || choice",
                            );
                        } else {
                            backdrop.classList.remove("backdrop--show");
                            menus.classList.remove("menus--overlay-showed");
                        }

                        handleEventType(eventInfos);
                    });
                }
            });

            choiceDiv.append(choiceBg, choiceText);
            choicesWrapper.append(choiceDiv);
        });
    };

    const showChoices = () => {
        choicesWrapper.classList.add("choices-wrapper--show");
        const choiceBoxes = document.querySelectorAll(".choices-wrapper > div");
        choiceBoxes.forEach((choiceBox) =>
            choiceBox.classList.add("choice--show"),
        );
        const titleElement = document.querySelector(".choices-wrapper__title");
        titleElement.classList.add("choices-wrapper__title--show");
    };

    const titleElement = document.createElement("p");
    titleElement.classList.add("choices-wrapper__title");
    titleElement.textContent = title;

    if (overlayMode) {
        // if "in a dialogue" (which already shows the backdrop), wait for the closing animation of the dialogue to finish before showing the choices
        setTimeout(() => {
            createChoices();
            choicesWrapper.append(titleElement);
        }, 200);

        setTimeout(showChoices, 300);
    } else {
        createChoices();
        choicesWrapper.append(titleElement);

        backdrop.classList.add("backdrop--show"); // show the backdrop (since it's not shown up yet)
        menus.classList.add("menus--overlay-showed");
        setTimeout(showChoices, 50);
    }
}
