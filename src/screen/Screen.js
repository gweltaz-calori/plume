export default class Screen {
    static enterFullScreen() {
        [
            "requestFullscreen",
            "webkitRequestFullscreen",
            "mozRequestFullScreen",
            "msRequestFullscreen"
        ].every(method => {
            if (void 0 === document.body[method]) return !0;
            document.body[method]();
        });
    }

    static leaveFullScreen() {
        [
            "exitFullscreen",
            "webkitExitFullscreen",
            "mozCancelFullScreen",
            "msExitFullscreen"
        ].every(method => {
            if (void 0 === document[method]) return !0;
            document[method]();
        });
    }
}
