// Check for API support
if (!window.customElements || !HTMLElement.prototype.attachShadow) {
    console.error("The HTML5 Custom Elements API and/or Shadow DOM v1 NOT supported in this browser. Try the latest version of Chrome on desktop for full support as of May, 2018.");
    // Set up any kind of fallbacks here:
    // ...
}

// Fully custom elements
import "./customelements/autoresize-textarea.js";
import "./customelements/counter.js";
import "./customelements/date.js";
import "./customelements/digital-clock.js";
import "./customelements/input-switch.js";
import "./customelements/image-carousel.js";
import "./customelements/image-input-preview.js";
import "./customelements/image-placeholder.js";
import "./customelements/modal.js";
import "./customelements/text-placeholder.js";
import "./customelements/tooltip.js";

// Extending native elements
import "./customelements/confirm-link.js";
import "./customelements/input-history.js";

import "./customelements/bar-chart.js";

// modal.js test
let myModal = document.getElementsByTagName("modal-window")[0];
// Add callback functions to the buttons (accept, cancel)
myModal.defineCallbacks(
    function () {
        console.log("modal-window: 'OK'");
    },
    function () {
        console.log("modal-window: 'cancel'");
    }
);
// 'Open modal' button
document.getElementById("open-modal-window")
    .addEventListener("click", function () {
        myModal.showModal();
    });




// Site js

// jump to anchor on load
if (location.hash) {
    let e = document.querySelector(location.hash);
    if (!!e && e.scrollIntoView) {
        // scroll to top element
        e.scrollIntoView(true);
    }
}

let $sidebar = document.getElementsByTagName("nav")[0];
let $hamburger = document.getElementsByClassName("hamburger")[0];
let $fade = document.getElementsByClassName("fade")[0];
// hamburger sidebar toggle
$hamburger.addEventListener("click", e => {
    if ($sidebar.classList.contains("open")) {
        $sidebar.classList.remove("open");
    } else {
        $sidebar.classList.add("open");
    }
});
// slide back when clicking outside the sidebar
$fade.addEventListener("click", e => {
    $sidebar.classList.remove("open");
});
// slide back when clicking on a sidebar link
Array.prototype.map.call(
    $sidebar.getElementsByTagName("a"),
    el => {
        el.addEventListener("click", e => {
            $sidebar.classList.remove("open");
        })
    }
);