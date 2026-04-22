import { handleDialogue } from "./dialogue-handler";

import { handleChoice } from "./choice-handler";

import { addToInv } from "./add-to-inv";

export function handleEventType(eventInfo) {
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
            addToInv(eventInfo.object, eventInfo.objectImg);
            break;

        default:
            console.log("Error, unvalid eventType");
            break;
    }
}
