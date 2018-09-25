import inlineSVG from 'inline-svg';

export default function inlineSvg() {
    inlineSVG.init({
        svgSelector: '[data-inline-svg]',
    });
}