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

export function handlePlayerAction(consequence) {
    const playerActions = getData("playerActions");
    if (
        !playerActions?.some(
            (playerAction) =>
                playerAction.playerActionId === consequence.playerActionId,
        )
    ) {
        delete consequence.consequenceType;
        playerActions.push(consequence);
        setData("playerActions", playerActions);
    }
}
