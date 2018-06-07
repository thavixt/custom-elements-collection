class ConfirmLink extends HTMLAnchorElement {
    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        this.addEventListener("click", e => {
            const result = confirm(`Are you sure you want to go to '${this.href}'?`);
            if (!result) e.preventDefault();
        });
    }
}

window.customElements.define("confirm-link", ConfirmLink, {
    extends: "a"
});