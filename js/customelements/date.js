// current date
export default class CurrentDate extends HTMLElement {
    constructor() {
        super();
        // shadow root
        this.shadow = this.attachShadow({
            mode: "open"
        });
        this.localeString = this.getAttribute("date-string") === "true";
        this.timestamp = parseInt(this.getAttribute("date-timestamp")) || 0;
        this.content = document.createElement("span");
        this.shadow.appendChild(this.content);
        this.content.textContent = getDate.call(this);
    }

    get value() {
        return this.content.textContent;
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // only update when a timestamp was not provided
        if (!this.timestamp) {
            setInterval(() => {
                this.content.textContent = getDate.call(this);
            }, 1000 * 60); // updates every minute
        }
    }
}
window.customElements.define('current-date', CurrentDate);

// helpers
function getDate() {
    let date;
    if (this.timestamp) {
        date = new Date(this.timestamp * 1000);
    } else {
        date = new Date();
    }
    if (this.localeString) {
        return date.toDateString();
    } else {
        return date.toLocaleDateString();
    }
}