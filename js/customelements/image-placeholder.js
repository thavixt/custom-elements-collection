// image placeholder
export default class ImagePlaceholder extends HTMLElement {
    constructor() {
        super();
        // Attributes
        this.url = this.getAttribute("data-src");
        this.preloadedImage = null;
        this.timeout = parseInt(this.getAttribute("data-delay")) || 500;
        this.transition = parseInt(this.getAttribute("data-transition")) || 500;
        this.style.setProperty('transition', `background-image ${(this.transition/1000).toFixed(1)}s ease-in-out`);
        // Set placeholder background if the attribute was set
        if (this.hasAttribute("data-placeholder")) {
            this.style.setProperty(
                'background-image',
                `url(${this.getAttribute("data-placeholder")})`
            );
        }
        // intersection observer
        this.observer = null;
        this.loaded = false;
        // preload the image when the page has loaded
        window.addEventListener("load", () => {
            this.preloadedImage = new Image();
            this.preloadedImage.src = this.url;
        })
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // Set up an IntersectionObserver to load data on demand
        this.observer = new IntersectionObserver((entries, observer) => {
            // Check for every entry when the intersection
            // is inside a treshold given
            // (only 1 was given, so this should fire only once)
            entries.forEach((entry) => {
                // console.log(entry.intersectionRatio);
                // If the element is fully in the viewport
                if (entry.intersectionRatio >= 1) {
                    // Change the image after the given delay
                    setTimeout(this.loadImage.bind(this), this.timeout);
                    // Stop observing
                    this.observer.disconnect();
                }
            });
        }, {
            threshold: [1]
        })
        // Start observing
        this.observer.observe(this);
    }
    loadImage(event) {
        this.style.setProperty('background-image', `url(${this.url})`);
        this.loaded = true;
    }
}
window.customElements.define('placeholder-img', ImagePlaceholder)