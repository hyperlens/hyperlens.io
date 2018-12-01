import 'intersection-observer';
import VideoControl from '../utils/video-control';

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
// collect bg flags from all nodes, and set corresponding class if any of nodes has active flag
// e.g. if first black node is active and second is inactive, second observer should not remove black class
const bgFlags = {
    gray: new Map(),
    black: new Map(),
};

export default function initObserver() {
    const observables = document.querySelectorAll('[data-observe-show], [data-observe-bg], [data-observe-play]');

    // init VideoControl on video observables
    observables.forEach((element) => {
       if (element.getAttribute('data-observe-play') !== null) {
           new VideoControl(element);
       }
    });

    // collect thresholds to observe from all observable elements
    let thresholdsToObserve = [0];
    observables.forEach((element) => {
        const elementThreshold = parseFloat(element.getAttribute('data-observe-threshold')) || 0;
        if (thresholdsToObserve.indexOf(elementThreshold) === -1) {
            thresholdsToObserve.push(elementThreshold);
        }
    });

    const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height') || '112px';

    // init observer
    const observer = new IntersectionObserver((entries) => {
        // console.log(entries)
        entries.forEach(handleIntersection);
    }, {
        threshold: thresholdsToObserve,
        rootMargin: `-${headerHeight} 0px 0px`,
    });
    observables.forEach((element) => observer.observe(element));


    /**
     * Handle entry intersection
     * @param {IntersectionObserverEntry} entry
     */
    function handleIntersection(entry) {
        const threshold = entry.target.getAttribute('data-observe-threshold') || 0;
        const showAttr = entry.target.getAttribute('data-observe-show');
        const bgAttr = entry.target.getAttribute('data-observe-bg');
        const playAttr = entry.target.getAttribute('data-observe-play');
        // data-observe-show
        if (showAttr !== null && entry.intersectionRatio > threshold) {
            entry.target.classList.add('is-showed');
            if (showAttr) {
                entry.target.classList.add(`is-showed--${showAttr}`);
            }
            // unobserve if no other observers
            if (bgAttr === null && playAttr === null) {
                observer.unobserve(entry.target);
            }
        }
        // data-observe-bg
        if (bgAttr !== null && entry.intersectionRatio > threshold) {
            bgFlags[bgAttr].set(entry.target, true);
            document.body.classList.add(BG_CLASSES[bgAttr]);
        }
        if (bgAttr !== null && entry.intersectionRatio <= threshold) {
            bgFlags[bgAttr].set(entry.target, false);
            let hasBgFlag = false;
            bgFlags[bgAttr].forEach((value) => {
                if (value) {
                    hasBgFlag = true;
                }
            });
            if (!hasBgFlag) {
                document.body.classList.remove(BG_CLASSES[bgAttr]);
            }
        }
        // data-observe-play
        if (playAttr !== null && entry.intersectionRatio > threshold) {
            if (playAttr === 'disabled') {
                entry.target.__videoControl.disable();
            }
            entry.target.__videoControl.play();
        }
        if (playAttr !== null && entry.intersectionRatio <= threshold) {
            entry.target.__videoControl.pause();
        }
    }
}

