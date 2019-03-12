import debounce from 'lodash-es/debounce'
import Rellax from 'rellax';
import DragScroll from './dragscroll';
import VideoControl from '../utils/video-control';

let rellax;
let dragScroll;

export default function initUseCases() {
    let isLastDesktop;
    // document.querySelectorAll('[data-use-case-video]').forEach((videoEl) => {
    //     new VideoControl(videoEl);
    // });

    document.querySelectorAll('[data-use-case-item]').forEach((itemEl) => {
        const videoEl = itemEl.querySelector('[data-use-case-video]');
        if (videoEl) {
            const videoControl = new VideoControl(videoEl);
            itemEl.addEventListener('mouseenter', () => {
                videoControl.play();
            });
            itemEl.addEventListener('mouseleave', () => {
                videoControl.pause();
            });
        }
    });

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

    window.addEventListener('resize', debounce(() => {
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
    }, 100));

}

function checkDesktop() {
    return window.innerWidth >= 700;
}

function initRellax() {
    if (rellax) {
        rellax.refresh();
    } else {
        // document.querySelector('[data-use-case-list]').style.overflow = 'hidden';
        rellax = new Rellax('[data-rellax-speed]', {
            wrapper: '[data-use-case-list]',
            relativeToWrapper: true,
            round: false,
            vertical: true,
            horizontal: false,
            max: 1000,
        });
        // setTimeout(() => {
        //     document.querySelector('[data-use-case-list]').style.overflow = '';
        // }, 60000);
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


