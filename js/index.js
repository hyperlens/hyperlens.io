import initUseCases from './include/use-cases';
import DragScroll from './include/dragscroll';
import initIntro from './include/intro';


initUseCases();
new DragScroll('[data-dragscroll]');
initIntro();
