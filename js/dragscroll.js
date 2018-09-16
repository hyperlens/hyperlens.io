
let newScrollX;

let dragged = [];
export default function reset() {
    for (let i = 0; i < dragged.length;) {
        const el = dragged[i++];
        el.removeEventListener('mousedown', el.mDown, 0);
        window.removeEventListener('mouseup', el.mUp, 0);
        window.removeEventListener('mousemove', el.mMove, 0);
    }

    // cloning into array since HTMLCollection is updated dynamically
    dragged = [].slice.call(document.querySelectorAll('[data-dragscroll]'));
    for (let i = 0; i < dragged.length;) {
        const el = dragged[i++];
        let lastClientX, isMouseDown;

        el.mDown = function(e) {
            if (!el.hasAttribute('nochilddrag') || document.elementFromPoint(e.pageX, e.pageY) === el) {
                isMouseDown = true;
                lastClientX = e.clientX;
                e.preventDefault();
                el.classList.add('is-grabbing');
            }
        };
        el.mUp = function() {
            isMouseDown = false;
            el.classList.remove('is-grabbing');
        };
        el.mMove = function(e) {
            if (isMouseDown) {
                el.scrollLeft -= newScrollX = (- lastClientX + (lastClientX=e.clientX));
                if (el === document.body) {
                    document.documentElement.scrollLeft -= newScrollX;
                }
            }
        };

        el.addEventListener('mousedown', el.mDown, 0);
        window.addEventListener('mouseup', el.mUp, 0);
        window.addEventListener('mousemove', el.mMove, 0);
    }
}


// if (document.readyState === 'complete') {
//     reset();
// } else {
//     window.addEventListener('load', reset, 0);
// }