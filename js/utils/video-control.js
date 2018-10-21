/**
 *
 * @param {Element|HTMLMediaElement|string} el
 * @constructor
 */
export default function VideoControl(el) {
    if (typeof el === 'string') {
        el = document.querySelector(el);
    }
    if (!(el instanceof HTMLMediaElement)) {
        console.error('Error: element is not instance of HTMLMediaElement. el:', el)
    }

    if (el.__videoControl) {
        return el.__videoControl;
    }

    let interval;

    this.play = function () {
        el.autoplay = true;
        if (el.readyState === 4) {
            el.play();
        } else {
            clearInterval(interval);
            interval = setInterval(() => {
                if (el.readyState === 4) {
                    el.play();
                    clearInterval(interval);
                }
            })
        }
    };

    this.pause = function () {
        el.autoplay = false;
        el.pause();
        clearInterval(interval);
    };

    el.__videoControl = this;
}
