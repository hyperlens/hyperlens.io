// @TODO replace with web.dom-collections.for-each after core-js@3 release
// or it will be replaced with babel's `useBuiltIns: "usage"`
if (typeof HTMLCollection.prototype.forEach === 'undefined') {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
}
if (typeof NodeList.prototype.forEach === 'undefined') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

export default function initToggle() {
    document.querySelectorAll('[data-toggle-trigger]').forEach((element) => {
        element.addEventListener('click', () => {
            element.classList.add('is-toggled');
            element.nextElementSibling.classList.add('is-toggled');
        })
    })
}