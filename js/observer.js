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

export default function initObserver() {
    const observables = document.querySelectorAll('[data-show]');

    // collect thresholds to observe from all observable elements
    let thresholdsToObserve = [0];
    observables.forEach((element) => {
        const elementThreshold = parseFloat(element.getAttribute('data-show-threshold')) || 0;
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
        if (entry.intersectionRatio > (entry.target.getAttribute('data-show-threshold') || 0)) {
            observer.unobserve(entry.target);
            entry.target.classList.add('is-showed');
            const entryName = entry.target.getAttribute('data-show');
            if (entryName) {
                entry.target.classList.add(`is-showed--${entryName}`);
            }

        }
    }
}

