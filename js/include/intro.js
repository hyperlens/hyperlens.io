import support from '../utils/support';
import '../utils/tilt';

const INITIAL_ANIMATION_TIME = 3000;

export default function initIntro() {
    const videoInnerEl = document.querySelector('[data-intro-video-inner]');
    const videoEl = document.querySelector('[data-intro-video]');
    const videoPreviewEl = document.querySelector('[data-intro-video-preview]');
    const watchButtonEl = document.querySelector('[data-intro-watch]');
    // const closeButtonEl = document.querySelector('[data-intro-close]');
    setTimeout(() => {
        if (videoEl) {
            videoEl.volume = 0.5;
        }
        // enable play observer by removing `disabled` attr value
        videoPreviewEl.setAttribute('data-observe-play', '');
        if (videoPreviewEl.__videoControl) {
            videoPreviewEl.__videoControl.enable();
        }
    }, INITIAL_ANIMATION_TIME);

    if (watchButtonEl) {
        watchButtonEl.addEventListener('click', zoomIn);
        videoInnerEl.addEventListener('click', toggleZoom);
        // closeButtonEl.addEventListener('click', zoomOut);
    }

    const $videoTiltEl = $(videoInnerEl);
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
        if (isZoomed || isDelayed) {
            return;
        }
        setDelay();
        isZoomed = true;

        videoInnerEl.removeEventListener(support.transition.end, handleZoomOutEnd); // clear, in case of zoomIn before zoomOut end

        const {top, bottom, left, right} = videoInnerEl.parentNode.getBoundingClientRect(); // compute parent, bc. element itself can be transformed by tilt
        const width = right - left;
        const height = bottom - top;
        const viewportWidth  = document.documentElement.clientWidth;
        const viewportHeight  = document.documentElement.clientHeight;
        const scaleX = viewportWidth / width;
        const scaleY = viewportHeight / height;
        const scale = Math.min(scaleX, scaleY);
        const translateX = -left + (viewportWidth - width) / 2;
        const translateY = -top + (viewportHeight - height) / 2;
        document.body.classList.add('is-intro-zoom-in'); // add transition
        destroyTilt(); // remove tilt stiles
        videoInnerEl.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`; // add zoom styles

        videoPreviewEl.__videoControl.pause();
        videoEl.play();

        window.addEventListener('scroll', zoomOut, support.passiveListener ? {passive: true} : false);
        window.addEventListener('resize', zoomOut);
        document.addEventListener('click', handleOuterClick);
        document.addEventListener('keyup', handleEsc);
    }

    function zoomOut() {
        if (!isZoomed || isDelayed) {
            return;
        }
        setDelay();
        isZoomed = false;

        videoInnerEl.style.transform = '';
        document.body.classList.remove('is-intro-zoom-in');
        document.body.classList.add('is-intro-zoom-out');

        videoPreviewEl.__videoControl.play();
        videoEl.pause();

        window.removeEventListener('scroll', zoomOut);
        window.removeEventListener('resize', zoomOut);
        document.removeEventListener('click', handleOuterClick);
        document.removeEventListener('keyup', handleEsc);

        videoInnerEl.addEventListener(support.transition.end, handleZoomOutEnd);
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
        videoInnerEl.removeEventListener(support.transition.end, handleZoomOutEnd);
        initTilt();
    }


    function initTilt() {
        $videoTiltEl.tilt();
    }

    function destroyTilt() {
        $videoTiltEl.tilt.destroy.call($videoTiltEl);
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