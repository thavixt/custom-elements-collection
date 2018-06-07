// text placeholder / lazy loader
export default class TextPlaceholder extends HTMLElement {
    constructor() {
        super();
        // shadow root
        this.shadow = this.attachShadow({
            mode: "open"
        });
        this.shadow.innerHTML = `
        <style>
        :host > .placeholder {
            height: 12px;
            width: 100%;
            margin: 5px 0;
            background-color: #ccc;
            border-radius: 4px;
        }
        </style>`;
        this.url = this.getAttribute("data-url");
        this.timeout = parseInt(this.getAttribute("data-delay")) || 500;
        // placeholder elements
        this.lineMin = parseInt(this.getAttribute("data-line-min"));
        this.lineMax = parseInt(this.getAttribute("data-line-max"));
        this.paragraphs = parseInt(this.getAttribute("data-paragraphs"));
        this.placeholders = [];
        // intersection observer
        this.observer = null;
        this.loaded = false;
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // Create placeholder lines
        for (let j = 0; j < this.paragraphs; j++) {
            // Random number of lines for each paragraph
            let lineCount = getRandom(this.lineMin, this.lineMax + 1, true);
            for (let i = 0; i < lineCount; i++) {
                let el = document.createElement("div");
                el.classList.add("placeholder");
                // change the width of the last line of a paragraph
                if (i + 1 === lineCount) {
                    el.style.width = getRandom(5, 10) * 10 + "%";
                }
                this.placeholders.push(el);
                this.shadow.appendChild(el);
            }
            // Add a line break if it's not the last iteration
            if (j < this.paragraphs) {
                this.shadow.appendChild(document.createElement("br"));
            }
        }
        // Set up an IntersectionObserver to load data on demand
        this.observer = new IntersectionObserver((entries, observer) => {
            // Check for every entry when the intersection
            // is inside a treshold given
            // (only 1 was given, so this should fire only once)
            entries.forEach((entry) => {
                // console.log(entry.intersectionRatio);
                // If the element is fully in the viewport
                if (entry.intersectionRatio == 1) {
                    // Load the data after the given delay
                    setTimeout(this.loadData.bind(this), this.timeout);
                    // Stop observing
                    this.observer.disconnect();
                }
            });
        }, {
            threshold: [1]
        })
        // Start observing
        this.observer.observe(this);

        function getRandom(min, max, round) {
            if (round) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min;
            } else {
                return (Math.random() * (max - min) + min).toFixed(1);
            }
        }
    }

    loadData() {
        fetch(this.url)
            .then(response => response.text())
            .then(text => {
                this.shadow.innerHTML = text;
                this.loaded = true;
            });
    }
}
window.customElements.define('placeholder-div', TextPlaceholder);