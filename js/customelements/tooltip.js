// tooltip wrapper
export default class TooltipWrapper extends HTMLElement {
    constructor() {
        super();
        // shadow root
        this.shadow = this.attachShadow({
            mode: "open"
        });
        this.shadow.innerHTML = `
        <style>
            :host {
                position: relative;
                height: 100%;
            } 
            :host div {
                display: none;
                min-width: 12em;
                max-width: 30em;
                position: absolute;
                top: 0%;
                left: 0%;
                transform: translate(0%, -100%);
                color: rgba(0, 0, 0, 0.8);
                background-color: #fff;
                padding: 10px;
                border: 1px solid #aaa;
                border-radius: 8px;
                box-shadow: 2px 2px 5px 0px #41414141;
            }
            :host(:hover) div {
                display: block;
            }
        </style>`;
        // tooltip
        this.tooltipElement = document.createElement("div");
        this.tooltipElement.innerHTML = this.innerHTML;
        this.innerHTML = "";
        this.shadow.appendChild(this.tooltipElement);
        // original text
        this.content = document.createElement("span");
        this.content.innerHTML = this.getAttribute("original-text");
        this.shadow.appendChild(this.content);
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // console.log(this.childElements);
        this.addEventListener("mouseenter", () => {
            // this.tooltipElement.style.display = "block";
        });
        this.addEventListener("mouseleave", () => {
            // this.tooltipElement.style.display = "none";
        });
    }
}
window.customElements.define('tooltip-wrapper', TooltipWrapper);