import support from '../utils/support';

const INITIAL_ANIMATION_TIME = 3000;

export default function initIntro() {
    const videoEl = document.querySelector('[data-intro-video]');
    const watchButtonEl = document.querySelector('[data-intro-watch]');
    setTimeout(() => {
        videoEl.play();
    }, INITIAL_ANIMATION_TIME);

    watchButtonEl.addEventListener('click', toggleZoom);
    videoEl.addEventListener('click', toggleZoom);


    let isZoomed = false;
    let isDelayed = false;
    function toggleZoom() {
        if (isZoomed) {
            zoomOut();
        } else {
            zoomIn();
        }
    }

    function setDelay() {
        isDelayed = true;
        setTimeout(() => {
            isDelayed = false;
        }, 300);
    }

    function zoomIn() {
        if (isDelayed) {
            return;
        }
        setDelay();
        isZoomed = true;

        const {top, left, width, height} = videoEl.getBoundingClientRect();
        const viewportWidth  = document.documentElement.clientWidth;
        const viewportHeight  = document.documentElement.clientHeight;
        const scaleX = viewportWidth / width;
        const scaleY = viewportHeight / height;
        const scale = Math.min(scaleX, scaleY);
        const translateX = -left + (viewportWidth - width) / 2;
        const translateY = -top + (viewportHeight - height) / 2;
        videoEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
        document.body.classList.add('is-intro-zoomed');

        window.addEventListener('scroll', zoomOut, support.passiveListener ? {passive: true} : false);
        window.addEventListener('resize', zoomOut);
        document.addEventListener('click', handleOuterClick);
        document.addEventListener('keyup', handleEsc);
    }

    function zoomOut() {
        if (isDelayed) {
            return;
        }
        setDelay();
        isZoomed = false;

        videoEl.style.transform = '';
        document.body.classList.remove('is-intro-zoomed');

        window.removeEventListener('scroll', zoomOut);
        window.removeEventListener('resize', zoomOut);
        document.removeEventListener('click', handleOuterClick);
        document.removeEventListener('keyup', handleEsc);
    }

    function handleOuterClick(e) {
        if (isZoomed && !getClosest(e.target, videoEl) && !getClosest(e.target, watchButtonEl)) {
            zoomOut();
        }
    }

    function handleEsc(e) {
        if (e.key === 'Escape' && isZoomed) {
            zoomOut();
        }
    }
}


function getClosest(node, closestEl) {
    while (node) {
        if (node === closestEl) {
            return node;
        } else {
            node = node.parentElement;
        }
    }
    return null;
}