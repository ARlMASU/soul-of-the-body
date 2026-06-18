//=============//
//  FUNCTIONS  //
//=============//

export function resizeApp(container, app) {
    // gets container width & height (variable)
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // gets app width & height (fixed)
    const appWidth = 256;
    const appHeight = 192;

    // gets the amount of scaling needed to get from the app's width & height to the container's width & height
    const scaleX = containerWidth / appWidth;
    const scaleY = containerHeight / appHeight;

    const scale = Math.min(scaleX, scaleY); // select the smallest of both to fill only the one needed (width or height scaling)

    // applies the select scaling
    app.style.transform = `scale(${scale})`;

    // centers the app
    const scaledWidth = appWidth * scale; //   gets the width  after scaling
    const scaledHeight = appHeight * scale; // gets the height after scaling

    const appMarginLeft = (containerWidth - scaledWidth) / 2; //  calculates the space needed at the left of the app for it to be horizontally centered
    const appMarginTop = (containerHeight - scaledHeight) / 2; // calculates the space needed at the top  of the app for it to be vertically   centered

    app.style.marginLeft = `${appMarginLeft}px`; // applies the margin left
    app.style.marginTop = `${appMarginTop}px`; // applies the margin top
}

export function makeImagesUndraggable() {
    const images = document.querySelectorAll("img"); // selects every <img> HTML elements and put them in an array

    images.forEach((image) => (image.draggable = false)); // for each image in images[], make image undraggable
}

export function isEven(number) {
    return number % 2 === 0; // if the rest of the number is 0, returns true, which means it's even, otherwise, returns false, which means it's odd
}

export function changeSceneObjectsClickability(state) {
    const styleState = state ? "auto" : "none";

    const everySceneItems = document.querySelectorAll(".scene__items > *");
    const everySceneCharacters = document.querySelectorAll(
        ".scene__characters > *",
    );
    const everySceneMoveArrows = document.querySelectorAll(
        ".scene__move-arrows > *",
    );

    const everySceneObjects = [
        ...everySceneItems,
        ...everySceneCharacters,
        ...everySceneMoveArrows,
    ];

    everySceneObjects.forEach(
        (object) => (object.style.pointerEvents = `${styleState}`),
    );
}
