export function handleMenuToggle() {
  const menuToggleButton = document.querySelector(".menu__toggle-button"),
    menu = document.querySelector(".menu");

  menuToggleButton.addEventListener("click", () =>
    menu.classList.toggle("menu--open")
  );
}

export function disableCheckingAbilityFromDiaryMenuCheckboxes() {
  const diaryTasksCheckboxes = document.querySelectorAll(
    '.diary-tasks input[type="checkbox"]'
  );

  diaryTasksCheckboxes.forEach((diaryTasksCheckbox) => {
    diaryTasksCheckbox.checked = false;
  });
}

export function handleOptionsMenuRangeValueDisplay() {
  const ranges = document.querySelectorAll('input[type="range"]');
  const rangeValueTexts = document.querySelectorAll(
    'input[type="range"] + p.range-value'
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
      ".options-menu__content__language__left-arrow"
    ),
    languageRightArrow = document.querySelector(
      ".options-menu__content__language__right-arrow"
    ),
    languageChoicesWrapper = document.querySelector(
      ".options-menu__content__language__choices-wrapper__choices"
    );

  let choiceIndex = 0;

  function changeChoice(choiceIndex) {
    languageChoicesWrapper.style.transform = `translateX(-${
      choiceIndex * 32
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

export function handleInvMenuItemsDisplay() {
  const inventory = JSON.parse(localStorage.getItem("inventory"));
  const app = document.querySelector(".app"),
    boxes = document.querySelectorAll(".inv-menu__content__boxes__box"),
    descriptionBubble = document.querySelector(
      ".inv-menu__content__description-bubble"
    ),
    descriptionBubbleText = descriptionBubble.querySelector("p");

  function setDescriptionBubblePosition(event) {
    const appRect = app.getBoundingClientRect();
    const appWidth = appRect.width;
    const appHeight = appRect.height;

    const mouseX = event.clientX - appRect.left;
    const mouseY = event.clientY - appRect.top;

    const gameX = (mouseX / appWidth) * 256;
    const gameY = (mouseY / appHeight) * 192;

    const bubbleRect = descriptionBubble.getBoundingClientRect();
    const bubbleWidth = (bubbleRect.width / appWidth) * 256;

    const bubbleX = Math.floor(gameX - 16 - bubbleWidth / 2);
    const bubbleY = Math.floor(gameY - 8);

    descriptionBubble.style.left = `${bubbleX}px`;
    descriptionBubble.style.top = `${bubbleY}px`;
  }

  boxes.forEach((box, index) => {
    if (inventory[index].img) {
      const itemIcon = document.createElement("img");
      itemIcon.src = `./assets/images/items/${inventory[index].img}`;
      box.textContent = "";
      box.append(itemIcon);
    }

    box.addEventListener("click", (event) => {
      setDescriptionBubblePosition(event);
      descriptionBubbleText.textContent = `${inventory[index].name}`;
      descriptionBubble.classList.add(
        "inv-menu__content__description-bubble--display"
      );
      window.addEventListener("click", (event) => {
        if (event.target.contains(box) && event.target !== box) {
          descriptionBubble.classList.remove(
            "inv-menu__content__description-bubble--display"
          );
        }
      });
    });

    box.addEventListener("mouseenter", () => {
      document.addEventListener("mousemove", setDescriptionBubblePosition);
      descriptionBubbleText.textContent = `${inventory[index].name}`;
      descriptionBubble.classList.add(
        "inv-menu__content__description-bubble--display"
      );
    });

    box.addEventListener("mouseleave", () => {
      document.removeEventListener("mousemove", setDescriptionBubblePosition);
      descriptionBubble.classList.remove(
        "inv-menu__content__description-bubble--display"
      );
    });
  });
}

export function handleDiaryMenuTasksAndFindingsDisplay(tasks, findings) {
  const diaryTasks = document.querySelector(".diary-menu__content__tasks"),
    diaryFindings = document.querySelector(".diary-menu__content__findings ul");
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

export function handleMoveButtonClick() {
  const moveButton = document.querySelector(".move-button");

  moveButton.addEventListener("click", () => {
    const moveArrowImgs = document.querySelectorAll(".move-arrow");
    moveArrowImgs.forEach((moveArrowImg) =>
      moveArrowImg.classList.toggle("move-arrow--show")
    );
  });
}
