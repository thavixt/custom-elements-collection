// @ts-check



export default class ImageCarousel extends HTMLElement {
    constructor() {
        super();
        // Attributes
        this.backgroundColor = this.getAttribute("img-background") || "black";
        this.backgroundSize = this.getAttribute("img-size") || "contain";
        this.transitionMs = parseInt(this.getAttribute("img-transition")) || 300;
        // Set up Shadow DOM
        this.shadow = this.attachShadow({
            mode: 'open'
        });
        // Create an element to hold the content
        this.container = document.createElement("div");
        this.container.id = "container";
        // Append each image as a slide to the container
        this.currentSlide = 0;
        this.slidesCount = 0;
        Array.from(this.getElementsByTagName("img")).forEach((el, i) => {
            this.slidesCount++;
            // create slide
            let slide = document.createElement("div");
            slide.classList.add("slide");
            slide.style.backgroundImage = `url(${el.src})`;
            // slide.appendChild(el);
            // add slide caption
            let caption = document.createElement("div");
            caption.classList.add("caption");
            caption.title = el.getAttribute("img-caption");
            caption.innerText = el.getAttribute("img-caption");
            slide.appendChild(caption);
            this.container.appendChild(slide);
        });
        this.innerHTML = "";
        // Add a control grid
        let controls = document.createElement("div");
        controls.id = "controls";
        // left & right slide
        this.slideLeft = document.createElement("div");
        this.slideLeft.id = "left";
        this.slideLeft.title = "Previous slide";
        let leftArrow = document.createElement("span");
        leftArrow.innerText = "<";
        this.slideLeft.appendChild(leftArrow);
        this.slideRight = document.createElement("div");
        this.slideRight.id = "right";
        this.slideRight.title = "Next slide";
        let rightArrow = document.createElement("span");
        rightArrow.innerText = ">";
        this.slideRight.appendChild(rightArrow);
        // centerl
        this.description = document.createElement("div");
        this.description.id = "desc";
        controls.appendChild(this.slideLeft);
        controls.appendChild(this.description);
        controls.appendChild(this.slideRight);
        // Add a stylesheet
        let slideWidth = (100 / this.slidesCount);
        this.styles = document.createElement("style");
        this.styles.innerHTML =
            `:host {
                display: block;
                position: relative;
                width: 100%;
                height: auto;
                min-height: 20em;
                user-select: none;
                background-color: ${this.backgroundColor};
                overflow: hidden;
                direction: ltr;
            }
            :host > #container {
                position: absolute;
                height: 100%;
                display: flex;
                padding: 0em;
                transition: all ${this.transitionMs}ms ease-out;
                transform: translate3d(0px, 0px, 0px);
            }
            :host > #container > .slide {
                float: left;
                width: ${slideWidth.toFixed(5)}%;
                margin: 0 0px; /* to fix rounding errors */
                min-height: 100%;
                display: flex;
                justify-content: center;
                background-position: center;
                background-repeat: no-repeat;
                background-size: ${this.backgroundSize};
            }
            :host > #container > .slide > .caption {
                color: whitesmoke;
                /* background-color: rgba(0, 0, 0, 0.3); */
                font-weight: 400;
                font-size: 14px;
                text-shadow: 1px 2px 1px #000;
                text-align: center;
                height: 15%;
                width: 70%;
                transform: translateY(550%);
                /* truncate text */
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            :host > #controls {
                position: absolute;
                top: 0; left: 0;
                display: grid;
                grid-template-columns: 70px auto 70px;
                width: 100%;
                height: 100%;
            }
            :host > #controls > div {
                width: 100%;
                height: 100%;
            }
            :host > #controls > #left,
            :host > #controls > #right {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: whitesmoke;
            }
            :host > #controls > #left {
                justify-content: flex-start;
            }
            :host > #controls > #left > span,
            :host > #controls > #right > span {
                font-size: 30px;
                padding: 1em;
                text-shadow: 1px 1px 5px black;
            }
            :host > #controls > #left.last,
            :host > #controls > #right.last {
                opacity: 0;
            }
            :host > #controls > #left:not(.last):hover,
            :host > #controls > #right:not(.last):hover {
                background-color: rgba(0,0,0,0.5);
                cursor: pointer;
            }
            `;
        // Append elements to the Shadow DOM
        this.shadow.appendChild(this.container);
        this.shadow.appendChild(controls);
        this.shadow.appendChild(this.styles);
        // Set up any event listeners here
        window.addEventListener("resize", () => {
            this.slide(this.currentSlide);
        });
        this.slideLeft.addEventListener("click", () => {
            this.prev();
        })
        this.slideRight.addEventListener("click", () => {
            this.next();
        })
    }

    checkBounds() {
        if (this.currentSlide >= this.slidesCount - 1) {
            this.slideRight.classList.add("last");
        } else {
            this.slideRight.classList.remove("last");
        }
        if (this.currentSlide <= 0) {
            this.slideLeft.classList.add("last");
        } else {
            this.slideLeft.classList.remove("last");
        }
    }

    next() {
        if (this.currentSlide < this.slidesCount - 1) {
            this.currentSlide++;
            this.slide(this.currentSlide);
        }
        this.checkBounds();
        return this.currentSlide;
    }

    prev() {
        if (this.currentSlide > 0) {
            this.currentSlide--;
            this.slide(this.currentSlide);
        }
        this.checkBounds();
        return this.currentSlide;
    }

    slide(index) {
        // console.log("slide: ", this.currentSlide + 1 + "/" + this.slidesCount);
        let slide_width = this.recalc().slide_width;
        let adjusted = slide_width * -index;
        this.container.style['transform'] = `translate3d(${adjusted}px, 0, 0)`;
    }

    recalc() {
        let width = window.getComputedStyle(this).width;
        let width_px = parseInt(width.split("px")[0]);
        let width_calc = (width_px * this.slidesCount);
        this.container.style.width = width_calc + "px";
        return {
            width: width_calc,
            slides: this.slidesCount,
            slide_width: width_px
        };
    }

    // Invoked when the custom element is first connected to the document's DOM.
    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        this.recalc();
        this.checkBounds();
    }

    // Invoked when one of the custom element's attributes is added, removed, or changed.
    attributeChangedCallback(name, oldValue, newValue) {}

    // Invoked when the custom element is disconnected from the document's DOM.
    disconnectedCallback() {}
}
// Register the custom element
window.customElements.define("img-carousel", ImageCarousel);

// helpers