import initUseCases from './include/use-cases';
// import DragScroll from './include/dragscroll';
import initIntro from './include/intro';
import initHorizontal from './include/horizontal-scroll';


initUseCases();
// dragscroll replaced with horizontal scroll
// new DragScroll('[data-dragscroll]');
initIntro();
initHorizontal();


const $onePagerLink = $('[data-one-pager]');
$onePagerLink.on('click', function (e) {
    e.preventDefault();
    const $target = $($onePagerLink.attr('href'));
    const targetTop = $target.offset().top;

    $('html, body').animate({scrollTop: targetTop}, 600);
});
