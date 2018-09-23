import 'intersection-observer';

// @TODO replace with web.dom-collections.for-each after core-js@3 release
// or it will be replaced with babel's `useBuiltIns: "usage"`
if (typeof HTMLCollection.prototype.forEach === 'undefined') {
    HTMLCollection.prototype.forEach = Array.prototype.forEach;
}
if (typeof NodeList.prototype.forEach === 'undefined') {
    NodeList.prototype.forEach = Array.prototype.forEach;
}

// Ignoring DOM changes
IntersectionObserver.prototype.USE_MUTATION_OBSERVER = false;


const BG_CLASSES = {
    gray: 'u-bg--gray',
    black: 'u-bg--black',
};

export default function initObserver() {
    const observables = document.querySelectorAll('[data-observe-show], [data-observe-bg]');

    // collect thresholds to observe from all observable elements
    let thresholdsToObserve = [0];
    observables.forEach((element) => {
        const elementThreshold = parseFloat(element.getAttribute('data-observe-threshold')) || 0;
        if (thresholdsToObserve.indexOf(elementThreshold) === -1) {
            thresholdsToObserve.push(elementThreshold);
        }
    });

    // init observer
    const observer = new IntersectionObserver((entries) => {
        // console.log(entries)
        entries.forEach(handleIntersection);
    }, {
        threshold: thresholdsToObserve,
    });
    observables.forEach((element) => observer.observe(element));


    /**
     * Handle entry intersection
     * @param {IntersectionObserverEntry} entry
     */
    function handleIntersection(entry) {
        const threshold = entry.target.getAttribute('data-observe-threshold') || 0;
        // data-observe-show
        const showAttr = entry.target.getAttribute('data-observe-show');
        if (showAttr !== null && entry.intersectionRatio > threshold) {
            observer.unobserve(entry.target);
            entry.target.classList.add('is-showed');
            if (showAttr) {
                entry.target.classList.add(`is-showed--${showAttr}`);
            }
        }
        // data-observe-bg
        const bgAttr = entry.target.getAttribute('data-observe-bg');
        if (bgAttr !== null && entry.intersectionRatio > threshold) {
            document.body.classList.add(BG_CLASSES[bgAttr]);
        }
        if (bgAttr !== null && entry.intersectionRatio <= threshold) {
            document.body.classList.remove(BG_CLASSES[bgAttr]);
        }
    }
}

