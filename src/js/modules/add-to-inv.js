import { getData, setData } from "./data-handler";

import { sceneItems } from "./dom";

import { alertMessageShow } from "./utils";

import { handleInvMenuItemsDisplay } from "./menus-handler";

export function addToInv(item, itemImg) {
    if (
        !("require" in item) ||
        getData("playerActions").some(
            (playerAction) => playerAction.playerActionId === item.require,
        )
    ) {
        let inventory = getData("inventory");
        const emptySlotIndex = inventory.findIndex(
            (slot) => slot.name === "Empty",
        );
        if (emptySlotIndex && inventory[7].name !== "Empty") {
            alertMessageShow("Too many items.");
        } else {
            item.taken = true;

            inventory[emptySlotIndex] = item;
            setData("inventory", inventory);

            let objectsToHide = getData("objectsToHide");
            objectsToHide.push(item.name);
            setData("objectsToHide", objectsToHide);

            handleInvMenuItemsDisplay(inventory);

            alertMessageShow(`Added ${item.name} to inventory.`);

            itemImg.classList.add("item--animate");
            itemImg.addEventListener("animationend", () => {
                sceneItems.removeChild(itemImg);
            });
        }
    } else {
        alertMessageShow(`You can't pick up this ${item.name}`);
    }
}
