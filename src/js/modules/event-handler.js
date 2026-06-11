//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//

import { handlePlayerAction } from "./data-handler";

import { handleDialogue } from "./dialogue-handler";

import { handleChoice } from "./choice-handler";

import { addToInv } from "./add-to-inv";

//=============//
//  FUNCTIONS  //
//=============//

export function handleEventType(eventInfo) {
    switch (eventInfo.event.eventType) {
        case "dialogue":
            handleDialogue(eventInfo.event.dialogueId);
            break;

        case "playerAction":
            handlePlayerAction(eventInfo.event);
            break;

        case "fight":
            break;

        case "choice":
            handleChoice(
                eventInfo.event.title,
                eventInfo.event.choices,
                eventInfo.overlayMode,
            );
            break;

        case "addToInv":
            addToInv(eventInfo.object, eventInfo.objectImg);
            break;

        default:
            console.log("Error, unvalid eventType");
            break;
    }
}
