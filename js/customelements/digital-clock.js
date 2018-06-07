// digital clock
export default class Clock extends HTMLElement {
    constructor() {
        super();
        // shadow root
        this.shadow = this.attachShadow({
            mode: "open"
        });
        this.hideSeconds = this.getAttribute("clock-seconds") === "false";
        this.content = document.createElement("span");
        this.shadow.appendChild(this.content);
        this.content.textContent = getTime.call(this);
    }

    get value() {
        return this.content.textContent;
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        setInterval(() => {
            this.content.textContent = getTime.call(this);
        }, 500); // updates every 0.5 seconds so it won't miss a second
    }

}
window.customElements.define('digital-clock', Clock);

// helpers
function getTime() {
    let today = new Date();
    let h = today.getHours();
    let m = addZero(today.getMinutes());
    if (this.hideSeconds) {
        return h + ":" + m;
    } else {
        let s = addZero(today.getSeconds());
        return h + ":" + m + ":" + s;
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i
        }
        return i;
    }
}