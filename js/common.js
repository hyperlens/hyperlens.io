import rootUnits from 'root-units';
import initObserver from './include/observer';
import HeaderMenu from './include/header-menu';
import inlineSvg from './include/inline-svg';
import initToggle from './include/toggle';
import clickBlur from './include/click-blur';
import iosForcePreload from './include/ios-force-preload';

document.body.classList.remove('no-js');
rootUnits.install({
    // disable RAF
    measure: measureTask => measureTask(),
});
initObserver();
new HeaderMenu();
inlineSvg();
initToggle();
clickBlur();
iosForcePreload();

setTimeout(() => {
    document.body.classList.remove('animate-content-initial');
}, 3000);
