// support
let support = {};
support.transition = (function() {
    let transitionEnd = (function() {
        let element = document.body || document.documentElement,
            transEndEventNames = {
                WebkitTransition : 'webkitTransitionEnd',
                MozTransition    : 'transitionend',
                OTransition      : 'oTransitionEnd otransitionend',
                transition       : 'transitionend'
            }, name;
        for (name in transEndEventNames) {
            if (element.style[name] !== undefined) return transEndEventNames[name];
        }
    }());

    return transitionEnd && { end: transitionEnd };
})();
support.passiveListener = (function () {
    let supportsPassive = false;
    try {
        let opts = Object.defineProperty({}, 'passive', {
            get: function() {
                supportsPassive = true;
            }
        });
        window.addEventListener('testPassiveListener', null, opts);
    } catch (e) {}
    return supportsPassive;
})();

export default support;