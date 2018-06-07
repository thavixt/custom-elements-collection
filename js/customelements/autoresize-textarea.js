// auto-resizing textarea that fits content
export default class AutosizeTextarea extends HTMLElement {
    constructor() {
        super();
        // Attributes
        this.width = this.getAttribute("autosize-width") || 300;
        this.minHeight = this.getAttribute("autosize-height") || 20;
        this.maxHeight = this.getAttribute("autosize-max-height") || 100;
        // Shadow DOM
        this.shadow = this.attachShadow({
            mode: 'open'
        });
        this.shadow.innerHTML = `
        <style>
        :host textarea {
            font-size: 14px;
            /* we have to specify a line height,
            'normal' is not the same across browsers (~1.14) */
            line-height: 1.14em;
            resize: none;
            width: ${this.width};
            min-height: ${this.minHeight};
            max-height: ${this.maxHeight};
            padding: 6px;
        }
        </style>`;
        // Append a native textarea element
        this.textarea = document.createElement("textarea");
        this.textarea.value = this.textContent.trim();
        this.innerHTML = "";
        this.shadow.appendChild(this.textarea);
        // event listener
        this.textarea.oninput = () => {
            // We can't access the native TextAreaHTMLElement's Shadow DOM :(
            // Let's just assign the inner scrollHeigth to the element's height
            let scrollHeight = this.textarea.scrollHeight;
            // Get computed CSS styles for the textarea element
            let styles = window.getComputedStyle(this.textarea);
            /* // Dimensions
            let height = getValueOf(styles.getPropertyValue("height"));
            let width = getValueOf(styles.getPropertyValue("width"));
            // Font & line sizes
            let fontSize = getValueOf(styles.getPropertyValue("font-size"));
            let lineHeight = styles.getPropertyValue("line-height");
            if (lineHeight === "normal") {
                lineHeight = fontSize;
            } else {
                lineHeight = getValueOf(lineHeight);
            } */
            // Padding
            let padding = {
                top: getValueOf(styles.getPropertyValue("padding-top")),
                bottom: getValueOf(styles.getPropertyValue("padding-bottom")),
            };
            let paddingX = padding.top + padding.bottom;
            this.textarea.style.height = scrollHeight - paddingX + "px";

            /* // console.log("padding-x: ", paddingX);
            let lineNums = (scrollHeight - paddingX) / lineHeight;
            console.log(scrollHeight, lineHeight, fontSize, lineNums);
            // console.log("lineNums: ", lineNums);
            return {
                num: lineNums,
                size: fontSize,
            };*/

            function getValueOf(string) {
                return parseInt(string.split("px")[0]);
            }
        };
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // console.log(`%cwidth:\t\t${this.width}
        // min-height:\t${this.minHeight}
        // max-height:\t${this.maxHeight}`, "padding: 1em; border: 2px solid #ccc;");
    }

    handleInput(e) {
        // calculate the character count
        // let charCount = this.textarea.value.length;
        // console.log("character count:", charCount);
        let newHeight = calculateInnerTextLineCount.bind(this);
        // console.log(newHeight);
        this.textarea.style.height = newHeight;
    }
}
window.customElements.define('textarea-autosize', AutosizeTextarea);