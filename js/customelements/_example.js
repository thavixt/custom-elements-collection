// @ts-check

/* 
The goal of this project is to create useful and/or interesting solutions for common poblems with the new HTML5 Custom Elements API.

Lifecycle methods - https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks

Useful links:
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement
https://github.com/tc39/proposal-class-fields

TODO:
Styling Custom Elements with ShadowDOM - https://www.html5rocks.com/en/tutorials/webcomponents/shadowdom-201/
*/

// Check for API support
if ('customElements' in window) {
    // console.log("Custom Elements API is supported.");
} else {
    console.error("The HTML5 Custom Elements API is NOT supported in this browser. Try the latest version of Chrome on desktop for full support as of May, 2018.");
    // Set up any kind of fallbacks here:
    // ...
}

if (!!HTMLElement.prototype.attachShadow) {
    // console.log("Shadow DOM v1 is supported.");
} else {
    console.error("The Shadow DOM v1 is NOT supported in this browser. Try the latest version of Chrome on desktop for full support as of May, 2018.");
    // Set up any kind of fallbacks here:
    // ...
}


//export default
class ExampleCustomElement extends HTMLElement {
    // Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() {
        return ['x'];
    }

    constructor() {
        // You must call super() first, since it extends the base HTMLElement class
        super();
        // Set and get any attributes here
        this.x = 0;
        this.importantData = this.getAttribute("data-important");
        // Set up Shadow DOM here
        this.shadow = this.attachShadow({
            mode: 'open'
        });
        // Add a stylesheet
        this.styles = document.createElement("style");
        this.styles.innerHTML =
            `:host {
                display: block;
                width: 10em;
                height: auto;
                user-select: none;
                cursor: pointer;
                color: whitesmoke;
                background-color: black;
                border: 1px solid black;
            }
            :host > div > p {
                padding: 0;
                margin: 0;
            }
            :host > div{
                padding: 1em;
            }
            :host > div:hover {
                color: grey;
            }`;
        // Create an element to hold the content
        this.innerContentDiv = document.createElement("div");
        this.titleParagraph = document.createElement("p");
        this.titleParagraph.textContent = "I'm in the Shadow DOM! Click on me.";
        this.counterParagraph = document.createElement("p");
        this.counterParagraph.textContent = `You clicked ${this.x} times.`;
        // Put the 2 paragraphs into the container div
        this.innerContentDiv.appendChild(this.titleParagraph);
        this.innerContentDiv.appendChild(this.counterParagraph);
        // Append elements to the Shadow DOM
        this.shadow.appendChild(this.innerContentDiv);
        this.shadow.appendChild(this.styles);
        // Set up any event listeners here
        this.innerContentDiv.addEventListener("click", () => {
            this.x++;
            this.counterParagraph.textContent = `You clicked ${this.x} times.`;
        });
    }

    // Getters and setters
    get value() {
        return this.x;
    }
    set value(val) {
        this.x = val;
        this.counterParagraph.textContent = `You clicked ${this.x} times.`;
    }

    // Invoked when the custom element is first connected to the document's DOM.
    connectedCallback() {
        console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
    }

    // Invoked when one of the custom element's attributes is added, removed, or changed.
    attributeChangedCallback(name, oldValue, newValue) {}

    // Invoked when the custom element is moved to a new document.
    adoptedCallback() {}

    // Invoked when the custom element is disconnected from the document's DOM.
    disconnectedCallback() {}
}
// Register the custom element
window.customElements.define("example-custom-element", ExampleCustomElement);

// helpers 
// ...
// put any helper functions here
// that shouldn't be part of the Element's API