const menuButtons = document.querySelectorAll(".menu__button"),
    modal = document.querySelector(".modal"),
    modalBackdrop = document.querySelector(".modal__backdrop"),
    menus = document.querySelectorAll(".modal__content-container__menu"),
    menuCloseButtons = document.querySelectorAll(".menu-close-button");

let selectedModalMenu = null;

function openModal() {
    modal.classList.add("modal--display"); // displays the modal on its own
    selectedModalMenu?.classList.add("modal__content-container__menu--display"); // displays the selected menu inside the modal

    setTimeout(() => {
        // waits 15ms before showing the elements (otherwise, it wouldn't play the transitions)
        modalBackdrop.classList.add("modal__backdrop--show"); // shows the backdrop (after displaying it)
        selectedModalMenu?.classList.add(
            "modal__content-container__menu--show",
        ); // shows the selected menu (after displaying it)
    }, 15);
}

function closeModal() {
    modalBackdrop.classList.remove("modal__backdrop--show");
    selectedModalMenu?.classList.remove("modal__content-container__menu--show");
    selectedModalMenu?.classList.add("modal__content-container__menu--hide"); // hides the selected menu (with a transition)

    setTimeout(() => {
        // waits for the transition to play out before un-displaying it
        selectedModalMenu?.classList.remove(
            "modal__content-container__menu--display",
        ); // un-displays the selected menu
        modal.classList.remove("modal--display"); // un-displays the modal itself
        selectedModalMenu?.classList.remove(
            "modal__content-container__menu--hide",
        );
        selectedModalMenu = null;
    }, 300);
}

function displayModalMenu(menuName) {
    selectedModalMenu = Array.from(menus).find((menu) =>
        menu.classList.contains(`${menuName}-menu`),
    ); // transforms the Node menus to an Array, then tries to find the selected menu based on if it contains the corresponding className

    openModal(selectedModalMenu);
}

menuButtons.forEach((menuButton) => {
    const menuName = menuButton.className.slice(13).slice(0, -7);

    menuButton.addEventListener("click", () => displayModalMenu(menuName));
});

modalBackdrop.addEventListener("click", closeModal);

menuCloseButtons.forEach((menuCloseButton) => {
    menuCloseButton.addEventListener("click", closeModal);
});
