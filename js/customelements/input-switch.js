export default class InputSwitch extends HTMLElement {
    // Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() {
        // array of attribute names we want to observe
        return ['checked', 'disabled'];
    }

    constructor() {
        // You must call super() first, since it extends the base HTMLElement class
        super();
        // Accent color
        this.accentColor = window.getComputedStyle(this).color;
        // Set up Shadow DOM here
        this.shadow = this.attachShadow({
            mode: 'open'
        });
        // Add a stylesheet
        this.styles = document.createElement("style");
        this.styles.innerHTML =
            `:host {
                display: inline-block;
                cursor: pointer;
                margin: 5px;
            }
            :host > div {
                display: flex;
                align-items: center;
                width: 30px;
                height: 22px;
                background-color: #ccc;
                border-radius: 20px;
                padding: 0 2px;
            }
            :host > div > div {
                width: 18px;
                height: 18px;
                border-radius: 20px;
                background-color: #efefff;
                /* border: 1px solid #ccc; */
                transition: all 0.15s ease-in-out;
            }

            /* checked status */
            :host > div.checked {
                background-color: ${this.accentColor};
            }
            :host > div.checked > div {
                /* border: 1px solid ${this.accentColor}; */
                transform: translateX(66%);
            }

            /* disabled status */
            :host > div.disabled {
                opacity: 0.4;
                cursor: not-allowed;
            }`;
        // Create an elements
        this.container = document.createElement("div");
        this.container.appendChild(document.createElement("div"));
        // Append elements to the Shadow DOM
        this.shadow.appendChild(this.styles);
        this.shadow.appendChild(this.container);
        // Click event listener
        this.addEventListener("click", e => toggleCheck.call(this));
    }

    // Getters and setters
    get checked() {
        return this.isChecked;
    }
    set checked(val) {
        this.setAttribute("checked", val.toString());
    }

    get disabled() {
        return this.isDisabled;
    }

    set disabled(val) {
        this.setAttribute("disabled", val.toString());
    }

    // Invoked when the custom element is first connected to the document's DOM.
    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // Initial state
        this.isChecked = this.getAttribute("checked") === "true" ||
            this.getAttribute("checked") === "";
        this.isDisabled = this.getAttribute("disabled") === "true" ||
            this.getAttribute("disabled") === "";
    }

    // Invoked when one of the custom element's attributes is added, removed, or changed.
    attributeChangedCallback(name, oldValue, newValue) {
        // "checked" changed
        if (name === "checked") {
            // console.log(`Attr. "${name}" changed from '${oldValue}' to '${newValue}'.`);
            // console.log(val, this.isChecked);
            if (newValue === null || newValue === "false") {
                this.container.classList.remove("checked");
                this.isChecked = false;
            } else {
                this.container.classList.add("checked");
                this.isChecked = true;
            }
        }
        // "disabled" changed
        if (name === "disabled") {
            // console.log(`Attr. "${name}" changed from '${oldValue}' to '${newValue}'.`);
            // console.log(val, this.isDisabled);
            if (newValue === null || newValue === "false") {
                this.container.classList.remove("disabled");
                this.isDisabled = false;
            } else {
                this.container.classList.add("disabled");
                this.isDisabled = true;
            }
        }
    }

    // Invoked when the custom element is disconnected from the document's DOM.
    disconnectedCallback() {
        this.removeEventListener("click", toggleCheck.bind(this, null));
    }
}
// Register the custom element
window.customElements.define("input-switch", InputSwitch);



// helper
function toggleCheck() {
    if (this.isDisabled) return false;
    const checked = this.getAttribute("checked") === "true" ||
        this.getAttribute("checked") === "";
    if (checked) {
        this.removeAttribute("checked");
    } else {
        this.setAttribute("checked", "");
    }
}