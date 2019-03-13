"use strict";

import $ from 'jquery';
import debounce from 'lodash-es/debounce';

export default function HeaderMenu() {
    const $win = $(window);
    const $html = $('html');
    const $body = $('body');

    let isAnimating = false;
    let isOpened = false;
    let menuHeight = 0;
    let scrollBarWidth = 0;
    let modalScrollPos;
    const animationDuration = 400;
    const breakpoint = 960;


    // init
    let $header = $('[data-header]');
    let $headerContainer = $('[data-header-container]');
    let $headerLogo = $('[data-header-logo]');
    let $headerMenu = $('[data-header-menu]');
    let $headerButton = $('[data-header-button]');

    $headerButton.on('click', () => {
        if (isOpened) {
            _hide();
        } else {
            _show();
        }
    });

    _recalculate();
    $win.on('resize', debounce(() => {
        if ($win.width() >= breakpoint) {
            _hide();
        }
        _recalculate();
    }, 50));


    // Public API

    this.$header = $header;

    this.hide = _hide;

    this.show = _show;

    this.getIsOpened = () => {
        return isOpened;
    };




    function _commonToggle() {
        isAnimating = true;
        setTimeout(() => {
            isAnimating = false;
        }, animationDuration);

        $headerButton.toggleClass('is-active');
        $headerMenu.toggleClass('is-active');
    }

    function _show() {
        if (isOpened || isAnimating) {
            return;
        }
        $header.trigger('headerOpenStart');
        _commonToggle();
        // фиксация положения экрана
        //@TODO переделать на html {overflow: hidden}, когда починят баг в сафари
        //@see https://bugs.webkit.org/show_bug.cgi?id=153856
        //@see https://bugs.webkit.org/show_bug.cgi?id=153852
        $headerMenu.css('min-height', menuHeight);
        modalScrollPos = {x: window.pageXOffset, y: window.pageYOffset};
        scrollBarWidth = window.innerWidth - $body.width();
        $html.css({'overflow-y': 'visible'});
        $body.css({width: window.innerWidth - scrollBarWidth, height: window.innerHeight, position: 'fixed', 'margin-top': modalScrollPos.y * -1});
        $header.trigger('headerOpenStartAnimation');
        $headerContainer.removeClass('header--menu-animate-out').addClass('header--menu-active header--menu-animate-in');
        if (scrollBarWidth > 0) {
            $header.css({position: 'fixed', height: '100%', 'overflow-y': 'scroll'});
        } else {
            $header.css({position: 'fixed', height: '100%', overflow: 'auto'});
        }
        setTimeout(() => {
            $header.trigger('headerOpened');
        }, animationDuration);
        isOpened = true;
    }

    function _hide() {
        if (!isOpened || isAnimating) {
            return;
        }
        $header.trigger('headerCloseStartAnimation');
        _commonToggle();
        //@TODO не учитывается ресайз
        $html.css({'overflow-y': ''});
        $body.css({width: '', height: '', position: '', 'margin-top': ''});
        $header.css({position: '', overflow: '', height: ''});
        window.scrollTo(modalScrollPos.x, modalScrollPos.y);
        $header.trigger('headerCloseStartAnimation');
        $headerContainer.removeClass('header--menu-animate-in').addClass('header--menu-animate-out');
        setTimeout(() => {
            $headerMenu.css({'min-height': ''});
            $headerContainer.removeClass('header--menu-active');
            $header.trigger('headerClosed');
        }, animationDuration);
        isOpened = false;
    }

    function _recalculate() {
        menuHeight = window.innerHeight - $headerLogo.outerHeight();
        if (isOpened) {
            $headerMenu.css('min-height', menuHeight);
            $body.css({width: window.innerWidth - scrollBarWidth, height: window.innerHeight});
        }
    }
}

