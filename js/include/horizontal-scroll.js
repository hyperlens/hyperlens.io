import thorttle from 'lodash-es/throttle';
import support from '../utils/support';

export default function initHorizontal() {
    document.querySelectorAll('[data-horizontal-scroll-wrap]').forEach((wrapEl) => {
        // const wrapEl = document.querySelector('[data-horizontal-scroll-wrap]');
        const overflowEl = wrapEl.querySelector('[data-horizontal-scroll]');
        const heightElDefault = wrapEl.querySelector('[data-horizontal-scroll-height]');
        const heightElSmall = wrapEl.querySelector('[data-horizontal-scroll-height-small]');
        const headerEl = wrapEl.querySelector('[data-horizontal-scroll-header]');
        overflowEl.style.overflow = 'hidden';

        let windowHeight;
        let headerHeight;
        let heightEl;
        let scrollWidth;
        let heightRect;
        let height;

        let windowExtraPaddingTop;

        calculate();
        const throttledCalculate = thorttle(calculate, 100);
        window.addEventListener('resize', throttledCalculate);
        window.addEventListener('orientationchange', throttledCalculate);
        function calculate() {
            windowHeight = document.documentElement.clientHeight;
            headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height'), 10);
            // ширина широкого элемента, который требуется отображать при скролле
            scrollWidth = overflowEl.scrollWidth;
            // высота элемента, который должен быть виден во вьюпорте при кскролле
            heightEl = heightElSmall && (windowHeight - headerHeight < 600) ? heightElSmall : heightElDefault;
            heightRect = heightEl.getBoundingClientRect();
            height = heightRect.bottom - heightRect.top;
            // вычитаем высоту хедера из отступа
            const headerElHeight = heightRect.top - headerEl.getBoundingClientRect().top;
            // отступ от верха вьюпорта
            windowExtraPaddingTop = headerHeight - headerElHeight;
            if (headerElHeight) {
                wrapEl.children[0].style.top = `calc(var(--header-height) - ${headerElHeight}px)`;
            } else {
                wrapEl.children[0].style.top = '';
            }
            // устанавливаем высоту таким образом, чтобы скролл по вертикали можно было зеркально скопировать на горизонтальный скролл
            wrapEl.style.height = (scrollWidth + height + headerElHeight - document.documentElement.clientWidth) + 'px';
            setScroll();
        }

        window.addEventListener('scroll', setScroll, support.passiveListener ? {passive: true} : false);

        function setScroll() {
            const scrolled = (wrapEl.getBoundingClientRect().top - windowExtraPaddingTop) * -1;
            overflowEl.scrollLeft = scrolled;
        }
    })

}
