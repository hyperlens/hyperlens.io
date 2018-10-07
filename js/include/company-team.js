import debounce from 'lodash-es/debounce'
import DragScroll from './dragscroll';

let dragScroll;

export default function initUseCases() {
    let isLastDesktop;

    // init depends on window size
    if (checkDesktop()) {
        isLastDesktop = true;
    } else {
        isLastDesktop = false;
        initDragScroll();
    }

    window.addEventListener('resize', debounce(() => {
        const isDesktop = checkDesktop();
        // change to desktop
        if (isDesktop && !isLastDesktop) {
            destroyDragScroll();
        }

        // change to mobile
        if (!isDesktop && isLastDesktop) {
            initDragScroll();
        }

        isLastDesktop = isDesktop;
    }, 100));

}

function checkDesktop() {
    return window.innerWidth >= 700;
}

function initDragScroll() {
    if (dragScroll) {
        dragScroll.refresh();
    } else {
        dragScroll = new DragScroll('[data-team-dragscroll]');
    }
}

function destroyDragScroll() {
    if (dragScroll) {
        dragScroll.destroy();
    }
}


