// simple counter
export default class Counter extends HTMLElement {
    constructor() {
        super();
        // shadow root
        this.shadow = this.attachShadow({
            mode: "open"
        });
        // styling
        this.shadow.innerHTML = `
        <style>
        :host {
            display: inline-block;
            background-color: #eee;
            border: 1px solid #ccc;
            padding: 0.5em 1em;
            margin: 10px;
            cursor: pointer;
            user-select: none;
        }
        :host([hidden]) {
            display: none;
        }
        :host(:hover) {
            background-color: #f5f5f5;
        }
        </style>`;
        // content
        this.x = 0;
        this.content = document.createElement("span");
        // this.content.setAttribute("part", "counter");
        this.content.textContent = this.x.toString()
        this.shadow.appendChild(this.content);
        // event listener
        this.step = parseInt(this.getAttribute("counter-step")) || 1;
        this.onclick = this.click.bind(this);
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
    }

    click() {
        this.x += this.step;
        window.requestAnimationFrame(() => this.content.textContent = this.x.toString());
    }
}
window.customElements.define('num-counter', Counter);