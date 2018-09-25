import rootUnits from 'root-units';
import initObserver from './include/observer';
import initUseCases from './include/use-cases';
import HeaderMenu from './include/header-menu';
import DragScroll from './include/dragscroll';
import initToggle from './include/toggle';
import clickBlur from './include/click-blur';

document.body.classList.remove('no-js');
rootUnits.install({
    // disable RAF
    measure: measureTask => measureTask(),
});
initObserver();
initUseCases();
new HeaderMenu();
new DragScroll('[data-dragscroll]');
initToggle();
clickBlur();

setTimeout(() => {
    document.body.classList.remove('animate-content-initial');
}, 3000);
