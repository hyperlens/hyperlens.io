import rootUnits from 'root-units';
import initObserver from './observer';
import dragScroll from './dragscroll';
import initToggle from './toggle';


rootUnits.install({
    // disable RAF
    measure: measureTask => measureTask(),
});
initObserver();
dragScroll();
initToggle();
