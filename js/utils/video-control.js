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
    let isEnabled = true;

    this.play = function () {
        if (isEnabled && el.readyState === 4) {
            el.autoplay = true;
            el.play();
        } else {
            clearInterval(interval);
            interval = setInterval(() => {
                if (isEnabled && el.readyState === 4) {
                    el.autoplay = true;
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

    this.enable = function() {
        isEnabled = true;
    };

    this.disable = function() {
        isEnabled = false;
    };

    el.__videoControl = this;
}
