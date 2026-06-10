//=============//
//  FUNCTIONS  //
//=============//

export function getData(name) {
    return JSON.parse(localStorage.getItem(name));
}

export function setData(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

export function setDefaultData(dataName, defaultData) {
    if (getData(dataName) === null) {
        setData(dataName, defaultData);
    }
}

export function clearDatas() {
    localStorage.clear();
    location.reload();
}

export function handlePlayerAction(event) {
    const playerActions = getData("playerActions"); // import the current playerActions
    if (
        // if the current playerActions don't contain the new playerAction
        !playerActions?.some(
            (playerAction) =>
                playerAction.playerActionId === event.playerActionId,
        )
    ) {
        // then,
        delete event.eventType; // remove the unnecessary eventType key-value pair
        playerActions.push(event); // add the new and cleaned playerAction to the playerActions
        setData("playerActions", playerActions); // save the updated playerActions in localStorage
    }
}
