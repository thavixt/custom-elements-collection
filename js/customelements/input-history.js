export default class HistoryInput extends HTMLInputElement {
    constructor() {
        super();
        this.history = [];
        this.cursor = 0;
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        this.addEventListener("keydown", e => {
            // console.log(e);
            // Up arrow
            if (e.keyCode === 38) {
                // Up arrow
                this.value = this.up();
            }
            // Down arrow
            if (e.keyCode === 40) {
                this.value = this.down();
            }
            // Enter - save history
            if (e.keyCode === 13 /*  && this.value */ ) {
                this._save();
                // Reset
                this.cursor = 0;
                this.value = "";
            }
        })
    }

    _save() {
        this.history.unshift(this.value);
        if (this.history.length > 5) {
            this.history.pop();
        }
        console.log(this.history);
    }

    down() {
        let val = this.history[this.cursor];
        if (this.cursor > 0) {
            this.cursor--;
        }
        return val || "";
    }

    up() {
        let val = this.history[this.cursor];
        if (this.cursor < this.history.length - 1) {
            this.cursor++;
        }
        return val || "";
    }
}

window.customElements.define("history-input", HistoryInput, {
    extends: "input"
});