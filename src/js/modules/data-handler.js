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

export function handlePlayerAction(newPlayerAction) {
    const playerActions = getData("playerActions"); // import the current playerActions
    if (
        // if the current playerActions don't contain the new playerAction
        !playerActions?.some(
            (playerAction) =>
                playerAction.playerActionId === newPlayerAction.playerActionId
        )
    ) {
        // then,
        delete newPlayerAction.eventType; // remove the unnecessary eventType key-value pair
        playerActions.push(newPlayerAction); // add the new and cleaned playerAction to the playerActions
        setData("playerActions", playerActions); // save the updated playerActions in localStorage
    }
}

export function handleEnding(newEnding) {
    const endings = getData("endings");

    if (
        // if the current endings don't contain the new ending
        !endings?.some((ending) => ending.endingId === newEnding.endingId)
    ) {
        delete newEnding.eventType; // remove the unnecessary eventType key-value pair
        endings.push(newEnding); // add the new and cleaned ending to the endings
        setData("endings", endings); // save the updated endings in localStorage
    }
}
