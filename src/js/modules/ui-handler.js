//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import {
    alertMessage,
    alertMessageText,
    locationNameWrapper,
    locationNameText,
} from "./dom";

//=============================//
//  EXTERNAL FUNCTIONS IMPORT  //
//=============================//

import { getData } from "./data-handler";

//=============//
//  FUNCTIONS  //
//=============//

function handleMenuBarToggle() {
    const menuBarToggleButton = document.querySelector(
            ".menu-bar__toggle-button",
        ),
        menuBar = document.querySelector(".menu-bar");

    menuBarToggleButton.addEventListener("click", () =>
        menuBar.classList.toggle("menu-bar--open"),
    );
}

function disableCheckingAbilityOfDiaryMenuCheckboxes() {
    const diaryTasksCheckboxes = document.querySelectorAll(
        '.diary-tasks input[type="checkbox"]',
    );

    diaryTasksCheckboxes.forEach((diaryTasksCheckbox) => {
        diaryTasksCheckbox.checked = false;
    });
}

export function handleOptionsMenuRangeValueDisplay() {
    const ranges = document.querySelectorAll('input[type="range"]'),
        rangeValueTexts = document.querySelectorAll(
            'input[type="range"] + p.range-value',
        );

    function displayRangeValue(index) {
        rangeValueTexts[index].textContent = ranges[index].value;
    }

    ranges.forEach((range, index) => {
        displayRangeValue(index);
        range.addEventListener("change", () => {
            displayRangeValue(index);
        });
    });
}

export function handleOptionsMenuLanguageSelection() {
    const languageLeftArrow = document.querySelector(
            ".options-menu__content__language__left-arrow",
        ),
        languageRightArrow = document.querySelector(
            ".options-menu__content__language__right-arrow",
        ),
        languageChoicesWrapper = document.querySelector(
            ".options-menu__content__language__choices-wrapper__choices",
        );

    let choiceIndex = 0;

    function changeChoice(choiceIndex) {
        languageChoicesWrapper.style.transform = `translateX(-${
            choiceIndex * 38
        }px)`;
    }

    languageLeftArrow.addEventListener("click", () => {
        choiceIndex--;

        if (choiceIndex < 0) {
            choiceIndex = 1;
        }

        changeChoice(choiceIndex);
    });

    languageRightArrow.addEventListener("click", () => {
        choiceIndex++;

        if (choiceIndex > 1) {
            choiceIndex = 0;
        }

        changeChoice(choiceIndex);
    });
}

function handleTasksAndFindingsDisplay(tasks, findings) {
    const diaryTasks = document.querySelector(".diary-menu__content__tasks"),
        diaryFindings = document.querySelector(
            ".diary-menu__content__findings ul",
        );
    tasks.forEach((task) => {
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("diary-menu__content__tasks__task");
        taskDiv.innerHTML = `
            <input
                type="checkbox"
                name="test"
                id="test"
                disabled
                ${task.completed && "checked"}
            />
            <label for="test">
                <p>${task.name}</p>
            </label>
        `;
        diaryTasks.append(taskDiv);
    });

    findings.forEach((finding) => {
        const findingDiv = document.createElement("li");
        findingDiv.textContent = `${finding}`;
        diaryFindings.append(findingDiv);
    });
}

function handleMoveButtonClick() {
    const moveButton = document.querySelector(".move-button"),
        menus = document.querySelector(".menus");

    const showArrows = () => {
        const moveArrowImgs = document.querySelectorAll(".move-arrow");
        moveArrowImgs.forEach((moveArrowImg) =>
            moveArrowImg.classList.toggle("move-arrow--show"),
        );
    };

    moveButton.addEventListener("click", showArrows);

    let clickCooldown = false;

    window.addEventListener("keydown", (event) => {
        if (
            !clickCooldown &&
            event.key === "Control" &&
            !menus.classList.contains("menus--overlay-showed")
        ) {
            showArrows();
            moveButton.classList.add("move-button--ctrl");
            clickCooldown = true;
            setTimeout(() => {
                moveButton.classList.remove("move-button--ctrl");
                clickCooldown = false;
            }, 450);
        }
    });
}

export function handleInvMenuItemsDisplay() {
    const inventory = getData("inventory"),
        app = document.querySelector(".app"),
        boxes = document.querySelectorAll(".inv-menu__content__boxes__box"),
        descriptionBubble = document.querySelector(
            ".inv-menu__content__description-bubble",
        ),
        descriptionBubbleText = descriptionBubble.querySelector("p");

    const setDescriptionBubblePosition = (box) => {
        const appRect = app.getBoundingClientRect();
        const appWidth = appRect.width;
        const appHeight = appRect.height;

        const boxRect = box.getBoundingClientRect();

        const boxWidth = (boxRect.width / appWidth) * 256;
        const boxHeight = (boxRect.height / appHeight) * 192;
        const boxX = ((boxRect.left - appRect.left) / appWidth) * 256;
        const boxY = ((boxRect.top - appRect.top) / appHeight) * 192;

        const bubbleRect = descriptionBubble.getBoundingClientRect();
        const bubbleWidth = (bubbleRect.width / appWidth) * 256;

        const bubbleX = Math.floor(boxX + boxWidth / 2 - bubbleWidth / 2 - 16);
        const bubbleY = Math.floor(boxY - 36);

        descriptionBubble.style.left = `${bubbleX}px`;
        descriptionBubble.style.top = `${bubbleY}px`;
    };

    boxes.forEach((box, index) => {
        if (inventory[index].img) {
            const itemIcon = document.createElement("img");
            itemIcon.src = `./assets/images/items/${inventory[index].img}`;
            box.textContent = "";
            box.append(itemIcon);
        }

        box.addEventListener("mouseenter", () => {
            setDescriptionBubblePosition(box);
            descriptionBubbleText.textContent = `${inventory[index].name}`;
            descriptionBubble.classList.add(
                "inv-menu__content__description-bubble--display",
            );
        });

        box.addEventListener("mouseleave", () => {
            descriptionBubble.classList.remove(
                "inv-menu__content__description-bubble--display",
            );
        });
    });
}

export function initMenusHandler() {
    handleMenuBarToggle();
    disableCheckingAbilityOfDiaryMenuCheckboxes();
    handleOptionsMenuRangeValueDisplay();
    handleOptionsMenuLanguageSelection();
    handleInvMenuItemsDisplay(getData("inventory"));
    handleTasksAndFindingsDisplay(getData("tasks"), getData("findings"));
    handleMoveButtonClick();
}

export function alertMessageShow(text) {
    alertMessageText.textContent = text;

    alertMessage.classList.remove("alert-message--hide");
    alertMessage.classList.add("alert-message--show");
    setTimeout(() => {
        alertMessage.classList.add("alert-message--hide");
        alertMessage.classList.remove("alert-message--show");
    }, 2000);
}

export function showLocationName(locationName) {
    locationNameWrapper.classList.remove("scene__location-name--show"); // removes the class before re-adding it to retriger the animation
    locationNameWrapper.offsetWidth; // forces reflow of DOM on the locationNameWrapper element, which forces the stop of the animation

    locationNameText.textContent = locationName;
    locationNameWrapper.classList.add("scene__location-name--show");
    locationNameWrapper.addEventListener(
        "animationend",
        () => {
            locationNameWrapper.classList.remove("scene__location-name--show");
        },
        { once: true }, // after the first trigger of the listener, removes the listener automatically
    );
}
