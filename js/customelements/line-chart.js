// @ts-check

export default class LineChart extends HTMLElement {
    // Specify observed attributes so that attributeChangedCallback will work
    static get observedAttributes() {
        return ['x'];
    }

    constructor() {
        // You must call super() first, since it extends the base HTMLElement class
        super();
        // Set and get any attributes here
        this._width = parseInt(this.getAttribute("data-width")) || 200;
        this._height = parseInt(this.getAttribute("data-height")) || 100;
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
                width: ${this._width + (30 * 2)}px;
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
                width: ${this._width}px;
                height: ${this._height}px;
            }
            :host > .container > svg.chart {
                display: block;
                height: 100%;
                width: 100%;
                user-select: none;
                border: 1px solid #bbb;
                border-width: 0 0 2px 2px;
            }
            :host > .container > svg.chart > .graph path {
                stroke: #aaa;
                stroke-width: 1px;
                stroke-linecap: butt;
                stroke-linejoin: miter;
                fill: none;
            }
            :host > .container > svg.chart > .points g {
                padding: 10px;
            }
            :host > .container > svg.chart > .points ellipse {
                cursor: pointer;
                /* fill: #666; */
                stroke: none;
            }
            :host > .container > svg.chart > .points ellipse:hover {
                fill: whitesmoke;
                stroke: #333;
                stroke-width: 1px;
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
        // chart
        this._chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this._chart.classList.add("chart");
        // this._chart.setAttributeNS(null, "xmlns", "http://www.w3.org/2000/svg");
        // this._chart.setAttributeNS(null, "xmlns:xlink", "http://www.w3.org/1999/xlink");
        this._chart.setAttributeNS(null, "viewbox", `0 0 ${this._width} ${this._height}`);
        this._chart.setAttributeNS(null, "x", "0px");
        this._chart.setAttributeNS(null, "y", "0px");
        this._chart.setAttributeNS(null, "width", `${this._width}`);
        this._chart.setAttributeNS(null, "height", `${this._height}`);
        this._container.appendChild(this._chart);
        // graph
        this._graph = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this._graph.classList.add("graph");
        this._chart.appendChild(this._graph);
        // points
        this._points = document.createElementNS("http://www.w3.org/2000/svg", "g");
        this._points.classList.add("points");
        this._chart.appendChild(this._points);
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

        // Calculate step size and starting position
        this._calculateStepSize();
        // Create the data points
        this._pointPositions = [];
        for (let i = 0; i < this._data.length; i++) {
            const dataPoint = this._data[i];
            this._pointPositions.push(this._add(dataPoint, i));

        }
        // Create path
        // console.log(this._pointPositions);
        this._drawPath();

        // Set up any event listeners here
        // ...
    }

    _drawPath() {
        let el = document.createElementNS("http://www.w3.org/2000/svg", "path");

        let d = "M " + this._pointPositions[0].join(" ");
        for (let i = 1; i < this._pointPositions.length; i++) {
            const p = this._pointPositions[i];
            d += " L " + this._pointPositions[i].join(" ");
        }
        // console.log(d);
        el.setAttributeNS(null, "d", `${d}`);
        this._graph.appendChild(el);
    }

    _add(data, idx) {
        const scalingFactor = (this._height / this._maximum) * 0.95;

        // Create group and add a hover title
        let group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        let title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        // Create ellipse
        let el = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        el.setAttributeNS(null, "rx", "6");
        el.setAttributeNS(null, "ry", "6");

        let x = this._startPos + (idx * this._stepSize);
        let y = this._height / 2;

        // simple value
        if (!isNaN(data)) {
            el.setAttributeNS(null, "data-value", data);
            el.setAttributeNS(null, "fill", `#666`);
            y = this._height - (data * scalingFactor);
            title.innerHTML = data;
        }
        // object {name, value, color}
        else if (data.hasOwnProperty('value')) {
            el.setAttributeNS(null, "data-value", data.value);
            y = this._height - (data.value * scalingFactor);
            if (data.hasOwnProperty('label')) {
                title.innerHTML = `${data.label} - ${data.value}`;
            }
            // color
            if (data.hasOwnProperty('color')) {
                el.setAttributeNS(null, "fill", `${data.color}`);
            } else {
                el.setAttributeNS(null, "fill", `#666`);
            }
        } else {
            throw new Error("Invalid chart data JSON.\nValid data is:\n- an array of numbers,\n- or an array of objects ({label,value,color}).");
        }

        el.setAttributeNS(null, "cx", `${x}`);
        el.setAttributeNS(null, "cy", `${y}`);

        // Append elements to group
        group.appendChild(title);
        group.appendChild(el);
        // Append group
        this._points.appendChild(group);
        // return el;
        return [x, y]
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

    _calculateStepSize() {
        this._stepSize = this._width / this._data.length;
        this._startPos = this._stepSize / 2;
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
    attributeChangedCallback(name, oldValue, newValue) { }

    // Invoked when the custom element is disconnected from the document's DOM.
    disconnectedCallback() { }
}
// Register the custom element
window.customElements.define("line-chart", LineChart);

// helpers
