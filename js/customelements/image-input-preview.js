// custom file input
export default class ImagePreview extends HTMLElement {
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
            padding: 1em;
            display: grid;
            // background-color: #fff;
        }
        :host([hidden]) {
            display: none;
        }
        label {
            width: 15em;
            background-color: white;
            border-radius: 8px;
            padding: 5px 10px;
            text-align: center;
            margin: auto;
            cursor: pointer;
            border: 1px solid #ddd;
            box-shadow: 3px 3px 10px whitesmoke;
        }
        input[type=file] {
            display: none;
        }
        canvas {
            padding: 1px 1px 2px 1px;
            border: 1px dashed #bbb;
            margin: 1em auto 0 auto;
            max-width: 100%;
            max-height: 300px;
            width: auto;
        }
        span {
            margin: auto;
            font-size: 12px;
        }
        span.error {
            font-weight: bold;
            color: firebrick;
        }
        </style>`;
        // store the input file
        this.file = {};
        // list of allowed file types
        // this.allowedTypes = ["png", "jpeg", "jpg", "bmp"];
        // label to replace the input element
        this.label = document.createElement("label");
        this.label.textContent = "Select an image file";
        this.label.htmlFor = "custom-file-input"
        this.shadow.appendChild(this.label);
        // input element
        this.input = document.createElement("input");
        this.input.type = "file";
        this.input.id = "custom-file-input";
        this.shadow.appendChild(this.input);
        // add event listener
        this.input.onchange = checkFile.bind(this);
        // canvas element
        this.canvas = document.createElement("canvas");
        this.shadow.appendChild(this.canvas);
        this.canvasContext = this.canvas.getContext('2d');
        // details text
        this.details = document.createElement("span");
        this.details.textContent = "No image selected";
        this.shadow.appendChild(this.details);
    }

    connectedCallback() {
        // console.log(`%c ${this.constructor.name} mounted `, "background: #555; color: #fff; padding: 2px");
        // Init
        clearCanvas.call(this);
    }

    get value() {
        return this.file;
    }

    set value(file) {
        this.file = file;
        checkFile.call(this);
    }

    get previewCanvas() {
        return this.canvas.getContext("2d").getImageData(
            0, 0,
            this.canvas.width,
            this.canvas.height
        );
    }


}
window.customElements.define('image-preview', ImagePreview);

// helpers
function clearCanvas() {
    this.canvas.width = 200;
    this.canvas.height = 150;
    this.canvasContext.clearRect(
        0, 0,
        this.canvasContext.canvas.width,
        this.canvasContext.canvas.height
    );
}

function updateDetails(file, size) {
    this.details.classList.remove("error");
    if (!file) {
        this.details.textContent = "No image selected";
    } else {
        let dimensions = `${size.width}x${size.height}`;
        let filesize = (file.size / 1000).toFixed(1) + "kb";
        this.details.textContent = `${file.name} - ${dimensions} - ${filesize}`;
    }
}

function updateError(message) {
    this.details.classList.add("error");
    this.details.textContent = message;
}

function checkFile() {
    this.file = this.input.files[0];
    // Object.assign(this.file, this.input.files[0]);

    // check if there is a file
    if (!this.file) {
        clearCanvas.call(this);
        updateDetails.call(this, false);
        return false;
    }

    // check if it's an image file
    // console.log(this.file);
    if (!/image/.test(this.file.type)) {
        updateError.call(this, "Preview failed - the selected file is not an image");
        return false;
    }

    // Draw image
    let reader = new FileReader();
    reader.onload = () => {
        let img = new Image;
        img.onload = () => {
            setTimeout(() => {
                this.canvas.width = img.width;
                this.canvas.height = img.height;
                this.canvasContext.drawImage(img, 0, 0);
            }, 250)
            updateDetails.call(this, this.file, {
                width: img.width,
                height: img.height
            });
        };
        img.src = reader.result;
    }
    reader.readAsDataURL(this.file);
}