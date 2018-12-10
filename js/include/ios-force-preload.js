export default function iosForcePreload() {
    const iosSafari = /iP(ad|od|hone)/i.test(window.navigator.userAgent) && /WebKit/i.test(window.navigator.userAgent) && !(/(CriOS|FxiOS|OPiOS|mercury)/i.test(window.navigator.userAgent)) && !window.MSStream;

    if (iosSafari) {
        document.querySelectorAll('video[preload]').forEach((videoEl) => {
            let buffered;
            try {
                buffered = videoEl.buffered.end(0)
            } catch (e) {}
            if (videoEl.readyState < 2 && !buffered) {
                videoEl.load();
            }
        })
    }
}
