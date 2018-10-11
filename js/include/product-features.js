import throttle from 'lodash-es/throttle';

export default function initFeatures() {
    const throttledCheckWidth = throttle(checkFeatureWidth, 100);
    const featuresGridEl = document.querySelector('[data-features-grid]');

    checkFeatureWidth();
    window.addEventListener('resize', throttledCheckWidth);
    window.addEventListener('orientationchange', throttledCheckWidth);


    function checkFeatureWidth() {
        const width = featuresGridEl.children[0].offsetWidth - 2;
        const height = featuresGridEl.offsetHeight - 2;
        document.documentElement.style.setProperty('--feature-width', width + 'px');
        document.documentElement.style.setProperty('--feature-width-full', width * 2 + 'px');
        document.documentElement.style.setProperty('--feature-height-full', height + 'px');
    }


    document.querySelectorAll('[data-features-item]').forEach((item) => {
        item.addEventListener('click', () => {
            const activeItem = document.querySelector('[data-features-item].is-active');
            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('is-active');
            }
            item.classList.toggle('is-active');
        })
    })
}
