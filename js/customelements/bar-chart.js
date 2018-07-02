// @ts-check

export default class BarChart extends HTMLElement {
    // Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() {
        return ['x'];
    }

    constructor() {
        // You must call super() first, since it extends the base HTMLElement class
        super();
        // Set and get any attributes here
        this.x = 0;
        this.chartData = JSON.parse(this.getAttribute("data-chart"));
        console.log(this.chartData);
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

    // Invoked when the custom element is disconnected from the document's DOM.
    disconnectedCallback() {}
}
// Register the custom element
window.customElements.define("bar-chart", BarChart);

// helpers