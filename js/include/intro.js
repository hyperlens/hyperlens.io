import support from '../utils/support';
import '../utils/tilt';

const INITIAL_ANIMATION_TIME = 3000;

export default function initIntro() {
    const videoEl = document.querySelector('[data-intro-video]');
    const watchButtonEl = document.querySelector('[data-intro-watch]');
    setTimeout(() => {
        // enable play observer by removing `disabled` attr value
        videoEl.setAttribute('data-observe-play', '');
        videoEl.play();
    }, INITIAL_ANIMATION_TIME);

    watchButtonEl.addEventListener('click', toggleZoom);
    videoEl.addEventListener('click', toggleZoom);

    const $videoEl = $(videoEl);
    initTilt();


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

        videoEl.removeEventListener(support.transition.end, handleZoomOutEnd); // clear, in case of zoomIn before zoomOut end

        const {top, left, width, height} = videoEl.parentNode.getBoundingClientRect(); // compute parent, bc. element itself can be transformed by tilt
        const viewportWidth  = document.documentElement.clientWidth;
        const viewportHeight  = document.documentElement.clientHeight;
        const scaleX = viewportWidth / width;
        const scaleY = viewportHeight / height;
        const scale = Math.min(scaleX, scaleY);
        const translateX = -left + (viewportWidth - width) / 2;
        const translateY = -top + (viewportHeight - height) / 2;
        document.body.classList.add('is-intro-zoom-in'); // add transition
        destroyTilt(); // remove tilt stiles
        videoEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`; // add zoom styles

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
        document.body.classList.remove('is-intro-zoom-in');
        document.body.classList.add('is-intro-zoom-out');

        window.removeEventListener('scroll', zoomOut);
        window.removeEventListener('resize', zoomOut);
        document.removeEventListener('click', handleOuterClick);
        document.removeEventListener('keyup', handleEsc);

        videoEl.addEventListener(support.transition.end, handleZoomOutEnd);
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

    function handleZoomOutEnd() {
        document.body.classList.remove('is-intro-zoom-out');
        videoEl.removeEventListener(support.transition.end, handleZoomOutEnd);
        initTilt();
    }


    function initTilt() {
        $videoEl.tilt();
    }

    function destroyTilt() {
        $videoEl.tilt.destroy.call($videoEl);
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