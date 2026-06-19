//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//

import { handlePlayerAction, handleEnding } from "./data-handler";

import { handleDialog } from "./dialog-handler";

import { handleChoice } from "./choice-handler";

import { addToInv } from "./add-to-inv";

//=============//
//  FUNCTIONS  //
//=============//

export function handleEventType(eventInfo) {
    switch (eventInfo.event.eventType) {
        case "dialog":
            handleDialog(eventInfo.event.dialogId);
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
                eventInfo.overlayMode
            );
            break;

        case "addToInv":
            addToInv(eventInfo.object, eventInfo.objectBox);
            break;

        case "ending":
            handleEnding(eventInfo.event);
            break;

        default:
            console.log("Error, unvalid eventType");
            break;
    }
}
