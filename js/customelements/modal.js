// modal window
export default class Modal extends HTMLElement {
    constructor() {
        super();
        // shadow root
        this.shadow = this.attachShadow({
            mode: "open"
        });
        this.isVisible = this.getAttribute("modal-visible") === "true";
        this.cancelable = this.hasAttribute("modal-cancel");
        this.addBackground = this.getAttribute("modal-background") === "true";
        // Modal window styling
        this.shadow.innerHTML = `
        <style>
        :host {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.2);
            z-index: 1099;
        }
        #container {
            display: block;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 7px;
            box-shadow: 4px 3px 15px -5px grey;
            min-width: 10em;
            max-width: 500px;
        }
        @media screen and (max-width: 720px) {
            #container {
                width: 90%;
            }
        }
        :host([modal-visible=true]) {
            display: block;
        }
        :host([hidden]) {
            display: none;
        }
        #text-container {
            padding: 2em 2em 0em 2em;
        }
        #btn-container {
            padding: 1em 2em 1em 2em;
            border-top: 1px solid #ccc;
            margin-top: 2em;
            text-align: center;
        }
        button {
            margin: 5px;
        }
        // #background {
        //     display: none;
        //     position: fixed;
        //     top: 0; left: 0;
        //     width: 100%;
        //     height: 100%;
        //     background-color: rgba(0,0,0,0.2);
        // }
        // :host([modal - visible]) #background {
        //     display: block;
        // }
        </style>`;
        // Container element
        this.container = document.createElement("div");
        this.container.id = "container";
        // Add the modal text content
        this.modalText = document.createElement("div");
        this.modalText.id = "text-container";
        this.modalText.innerHTML = this.innerHTML;
        this.innerHTML = "";
        this.container.appendChild(this.modalText);
        // Add button container
        this.btnContainer = document.createElement("div");
        this.btnContainer.id = "btn-container";
        // Create buttons
        // accept
        this.acceptBtn = document.createElement("button");
        this.acceptBtn.textContent = this.getAttribute("modal-accept");
        this.acceptBtn.addEventListener("click", () => {
            this.hideModal();
        });
        this.btnContainer.appendChild(this.acceptBtn);
        // cancel
        if (this.cancelable) {
            this.cancelBtn = document.createElement("button");
            this.cancelBtn.textContent = this.getAttribute("modal-cancel");
            this.cancelBtn.addEventListener("click", () => {
                this.hideModal();
            });
            this.btnContainer.appendChild(this.cancelBtn);
        }
        // Append buttons to container
        this.container.appendChild(this.btnContainer);
        // Append everything to the Shadow DOM
        this.shadow.appendChild(this.container);
        //  Append background if enabled
        /* if (this.addBackground) {
            this.background = document.createElement("div");
            this.background.id = "background";
            this.background.style.display = "none";
            this.background.style.position = "fixed";
            this.background.style.top = "0";
            this.background.style.left = "0";
            this.background.style.minWidth = "100vw";
            this.background.style.minHeight = "100vh";
            this.background.style.backgroundColor = "rgba(0,0,0,0.2)";
            this.background.style.zIndex = "1098";
            // this.shadow.appendChild(this.background);
            // We can't use the Shadow DOM to hold the background fade div, because it could only cover the element itself, not the whole page.
            this.parentNode.appendChild(this.background);
        } */
        // FIXME: adjust z-index
        this.style.zIndex = "9999";
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        if (this.isVisible) {
            this.showModal();
        }
    }

    get visible() {
        return this.getAttribute("modal-visible") === "true";
    }

    defineCallbacks(acceptCallback, cancelCallback) {
        // accept button
        this.acceptBtn.addEventListener("click", () => {
            acceptCallback();
        });
        // cancel button
        if (this.cancelable) {
            this.cancelBtn.addEventListener("click", () => {
                cancelCallback();
            });
        } else {
            console.error('Modal-window: "cancel" action was not allowed.\nAdd the modal-cancel property with a custom string value to enable it.\n\nFor example: modal-cancel="I changed my mind".');
        }
    }


    showModal() {
        // document.getElementsByTagName("body")[0].style.overflow = "hidden";
        this.setAttribute("modal-visible", "true");
        /* if (this.addBackground) {
            this.background.style.display = "block";
        } */
    }

    hideModal() {
        // document.getElementsByTagName("body")[0].style.overflow = "initial";
        this.setAttribute("modal-visible", "false");
        /* if (this.addBackground) {
            this.background.style.display = "none";
        } */
    }
}
window.customElements.define('modal-window', Modal);