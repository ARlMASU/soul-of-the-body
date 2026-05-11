//============================//
//  HTML DOM ELEMENTS IMPORT  //
//============================//

import {
  menuButtons,
  modal,
  modalBackdrop,
  modalMenus,
  menuCloseButtons,
} from "./dom";

//=============//
//  VARIABLES  //
//=============//

let selectedModalMenu = null;

//=============//
//  FUNCTIONS  //
//=============//

function openModal() {
  modal.classList.add("modal--display"); // displays the modal on its own
  selectedModalMenu?.classList.add("modal__content-container__menu--display"); // displays the selected menu inside the modal

  setTimeout(() => {
    // waits 15ms before showing the elements (otherwise, it wouldn't play the transitions)
    modalBackdrop.classList.add("modal__backdrop--show"); // shows the backdrop (after displaying it)
    selectedModalMenu?.classList.add("modal__content-container__menu--show"); // shows the selected menu (after displaying it)
  }, 15);
}

function closeModal() {
  modalBackdrop.classList.remove("modal__backdrop--show");
  selectedModalMenu?.classList.remove("modal__content-container__menu--show");
  selectedModalMenu?.classList.add("modal__content-container__menu--hide"); // hides the selected menu (with a transition)

  setTimeout(() => {
    // waits for the transition to play out before un-displaying it
    selectedModalMenu?.classList.remove(
      "modal__content-container__menu--display"
    ); // un-displays the selected menu
    modal.classList.remove("modal--display"); // un-displays the modal itself
    selectedModalMenu?.classList.remove("modal__content-container__menu--hide");
    selectedModalMenu = null;
  }, 300);
}

function displayModalMenu(menuName) {
  selectedModalMenu = Array.from(modalMenus).find((menu) =>
    menu.classList.contains(`${menuName}-menu`)
  ); // transforms the Node modalMenus to an Array, then tries to find the selected menu based on if it contains the corresponding className

  openModal();
}

export function handleModal() {
  menuButtons.forEach((menuButton) => {
    const menuName = menuButton.className
      .replace("menu__button", "")
      .replace(" ", "")
      .replace("button-", "");

    menuButton.addEventListener("click", () => displayModalMenu(menuName));
  });

  modalBackdrop.addEventListener("click", closeModal);

  menuCloseButtons.forEach((menuCloseButton) => {
    menuCloseButton.addEventListener("click", closeModal);
  });
}
