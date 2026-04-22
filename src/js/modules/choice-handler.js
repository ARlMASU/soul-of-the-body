import { handlePlayerAction } from "./data-handler";

import { backdrop, choicesWrapper } from "./dom";

import { handleDialogue, closeDialogue } from "./dialogue-handler";

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

export function handleChoice(choices, isInsideOfDialogue) {
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
        // to be determined
    }
}
