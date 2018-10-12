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

        const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10);
        const windowHeight = document.documentElement.clientHeight - headerHeight - 60;

        document.documentElement.style.setProperty('--feature-width', width + 'px');
        document.documentElement.style.setProperty('--feature-width-full', width * 2 + 'px');
        document.documentElement.style.setProperty('--feature-height-full', Math.min(height, windowHeight) + 'px');
    }

    const featureElList = document.querySelectorAll('[data-features-item]');
    featureElList.forEach((item) => {
        item.querySelector('[data-feature-open]').addEventListener('click', () => {
            const activeItem = document.querySelector('[data-features-item].is-active');
            if (activeItem && activeItem !== item) {
                activeItem.classList.remove('is-active');
                item.classList.remove('is-inactive');
            }
            item.classList.add('is-active');
            document.querySelectorAll('[data-features-item]:not(.is-active)').forEach((inactiveItem) => {
                inactiveItem.classList.add('is-inactive');
            });

        });
        item.querySelector('[data-feature-close]').addEventListener('click', () => {
            featureElList.forEach((outItem) => {
                outItem.classList.remove('is-active', 'is-inactive');
            });
        });
        // item.addEventListener('click', () => {
        //
        //     const activeItem = document.querySelector('[data-features-item].is-active');
        //     if (activeItem && activeItem !== item) {
        //         activeItem.classList.remove('is-active');
        //     }
        //     item.classList.toggle('is-active');
        // })
    })
}
