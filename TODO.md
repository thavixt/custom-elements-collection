# Website todo list

- [ ] more/better example code
- [ ] provide an example of styling the elements
    - expose parts of the element with the :host::part(partname) syntax
    - for example:
        div part="preview"
        selector: :host::part(preview)
    - https://youtu.be/7CUO7PyD5zA?t=27m7s
- [ ] write a README.md about the using the Custom Elements API

Completed:
- [x] list default attributes
- [x] mobile layout & sidebar nav
- [x] make the site nicer



# Custom element/component ideas


- [ ] simple bar charts
    - hover effects
    - pass array of data through an attribute?
    - or only init with javascript?
- [ ] hamburger menu / sidebar
- [ ] progress bar
- [ ] loader / loading animations
    - cover whole page
    - or cover just an element/box
- [ ] alert/message box
- [ ] masked input
    - https://github.com/niksmr/vue-masked-input
    - https://github.com/insin/inputmask-core
    - this might be too complicated

Completed:
- [x] checkbox flip switch
- [x] image carousel
- [x] input history



# Further learning

- use the *slot* api
- use the *part* api
- figure out applying CSS from the outer scope



# References
- - [Google Developers article](https://developers.google.com/web/fundamentals/web-components/customelements)
- - [MDN docs](https://developer.mozilla.org/en-US/docs/Web/API/Window/customElements)