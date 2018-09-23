import debounce from 'lodash-es/debounce'
import Rellax from 'rellax';
import DragScroll from './dragscroll';

let rellax;
let dragScroll;

export default function initUseCases() {
    let isLastDesktop;

    // init depends on window size
    if (checkDesktop()) {
        isLastDesktop = true;
        initRellax();

        window.addEventListener('load', () => {
            window.dispatchEvent(new Event('resize'));
        });
    } else {
        isLastDesktop = false;
        initDragScroll();
    }

    window.addEventListener('resize', () => {
        const isDesktop = checkDesktop();
        // change to desktop
        if (isDesktop && !isLastDesktop) {
            initRellax();
            destroyDragScroll();
        }

        // change to mobile
        if (!isDesktop && isLastDesktop) {
            initDragScroll();
            destroyRellax();
        }

        isLastDesktop = isDesktop;
    });

}

function checkDesktop() {
    return window.innerWidth >= 700;
}

function initRellax() {
    if (rellax) {
        rellax.refresh();
    } else {
        rellax = new Rellax('[data-rellax-speed]', {
            wrapper: '[data-use-case-list]',
            relativeToWrapper: true,
            round: false,
            vertical: true,
            horizontal: false,
        });
    }
}

function destroyRellax() {
    if (rellax) {
        rellax.destroy();
    }
}

function initDragScroll() {
    if (dragScroll) {
        dragScroll.refresh();
    } else {
        dragScroll = new DragScroll('[data-use-case-list]');
    }
}

function destroyDragScroll() {
    if (dragScroll) {
        dragScroll.destroy();
    }
}


