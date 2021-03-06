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
        // Set up Shadow DOM here
        this._shadow = this.attachShadow({
            mode: 'open'
        });
        // Add a stylesheet
        this._styles = document.createElement("style");
        this._styles.innerHTML =
            `:host {
                display: inline-block;
                position: relative;
                width: 500px;
                height: 100%;
                padding: 0.5em 2em 1.5em 2em;
            }
            :host > .title {
                display: block;
                text-align: center;
                font-size: 12px;
                padding: 4px;
                margin-bottom: 1em;
            }
            :host > .container {
                position: relative;
            }
            :host > .container > .chart {
                display: grid;
                grid-gap: 5px;
                grid-auto-flow: column;
                align-items: end;
                min-height: 100px;
                min-width: 100%;
                user-select: none;
                border: 1px solid #bbb;
                border-width: 0 0 2px 2px;
                padding: 6px 6px 0 6px;
            }
            :host .bar {
                /* min-height: 100%; */
                position: relative;
                background-color: firebrick;
                cursor: pointer;
            }
            :host .bar::after {
                content: attr(data-value);
                position: absolute;
                width: 100%;
                bottom: -1.5em;
                left: 0;
                text-align: center;
                font-size: 12px;
            }
            :host .bar:hover {
                background-color: #ccc !important;
            }
            /* failed to validate data */
            :host > .container.invalid {
                /* background-color: #ccc; */
            }
            :host > .container.invalid::before {
                position: absolute;
                top: 50%;
                left: 0;
                width: 100%;
                text-align: center;
                content: "Failed to validate chart data.";
                padding: 1em 0;
            }
            /* min and max values (y-axis) */
            :host .min,
            :host .max {
                display: block;
                position: absolute;
                text-align: right;
                font-size: 12px;
            }
            :host .min::after,
            :host .max::after, {
                content: "-";
            }
            :host .min {
                bottom: 0;
                left: -1em;
            }
            :host .max {
                top: 0;
                left: -1.5em;
            }
            `;
        // Create an element to hold the content
        this._title = document.createElement("div");
        this._title.classList.add("title");
        this._title.textContent = this.getAttribute("chart-title") || "";
        this._container = document.createElement("div");
        this._container.classList.add("container");
        this._chart = document.createElement("div");
        this._chart.classList.add("chart");
        this._container.appendChild(this._chart);
        // Append elements to the Shadow DOM
        this._shadow.appendChild(this._title);
        this._shadow.appendChild(this._container);
        this._shadow.appendChild(this._styles);

        // console.log(this.getAttribute("chart-data"));
        try {
            this._data = JSON.parse(this.getAttribute("chart-data"));
        } catch (ex) {
            console.error("Invalid chart data JSON.\n", ex.message, ex.stack);
            this._container.classList.add("invalid");
            return undefined;
        }
        // Calculate the maximum value
        this._maximum = this._calculateMax();
        // Add y-axis labels
        let min = document.createElement("div");
        min.classList.add("min");
        min.textContent = "0";
        this._maximumLabel = document.createElement("div");
        this._maximumLabel.classList.add("max");
        this._maximumLabel.textContent = this._maximum.toString();
        this._container.appendChild(min);
        this._container.appendChild(this._maximumLabel);
        // Create the data points
        for (const d of this.data) {
            this._add(d);
        }


        // Set up any event listeners here
        // ...
    }

    _add(data) {
        // console.log(data);
        let el = document.createElement("div");
        // simple value
        if (!isNaN(data)) {
            el.setAttribute("data-value", data);
            el.setAttribute("title", data);
            el.style.height = (data / this._maximum * 100).toFixed() + "%";
        }
        // object {name, value, color}
        else if (data.hasOwnProperty('value')) {
            // console.log('object: ', data);
            el.setAttribute("data-value", data.value);
            el.style.height = (data.value / this._maximum * 100).toFixed() + "%";
            // label
            if (data.hasOwnProperty('label')) {
                el.setAttribute("title", `${data.label} - ${data.value}`);
            }
            // color
            if (data.hasOwnProperty('color')) {
                el.style.backgroundColor = data.color;
            }
        } else {
            throw new Error("Invalid chart data JSON.\nValid data is:\n- an array of numbers,\n- or an array of objects ({label,value,color}).");
            return false;
        }
        // Append bar
        el.classList.add("bar");
        this._chart.appendChild(el);
        return el;
    }

    _calculateMax() {
        let max = 0;
        for (const d of this._data) {
            // console.log(d);
            if (d.hasOwnProperty('value')) {
                if (max < d.value) {
                    max = d.value;
                }
            } else if (!isNaN(d)) {
                if (max < d) {
                    max = d;
                }
            } else {
                this._container.classList.add("invalid");
                throw new Error("Invalid chart data JSON.\nValid data is:\n- an array of numbers,\n- or an array of objects ({label,value,color}).");
            }
        }
        // console.info("max is: ", max);
        return max;
    }

    // Getters and setters
    get title() {
        return this._title.textContent;
    }
    set title(value) {
        this._title.textContent = value;
    }
    get data() {
        return this._data;
    }
    set data(values) {
        this._data = values;
        this._chart.innerHTML = "";
        this._maximum = this._calculateMax();
        this._maximumLabel.textContent = this._maximum.toString();
        // Create the data points
        for (const d of values) {
            this._add(d);
        }
    }

    // Invoked when the custom element is first connected to the document's DOM.
    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // console.log(this.data);
    }

    // Invoked when one of the custom element's attributes is added, removed, or changed.
    attributeChangedCallback(name, oldValue, newValue) {}

    // Invoked when the custom element is disconnected from the document's DOM.
    disconnectedCallback() {}
}
// Register the custom element
window.customElements.define("bar-chart", BarChart);

// helpers
