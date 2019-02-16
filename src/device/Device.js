export default class Device {
  static get isMobile() {
    return Device.isTouchDevice;
  }

  static get orientation() {
    return window.innerWidth > window.innerHeight ? "landscape" : "portrait";
  }

  static get hasVRDisplay() {
    return void 0 !== navigator.getVRDisplays;
  }

  static get isWindowsPhone() {
    return /windows phone|iemobile|wpdesktop/.test(navigator.userAgent);
  }

  static get isIos() {
    return (
      !Device.isWindowsPhone &&
      /ip(hone|od|ad)/i.test(navigator.userAgent) &&
      !window.MSStream
    );
  }

  static get isAndroid() {
    return !Device.isWindowsPhone && /android/i.test(navigator.userAgent);
  }

  static get isFirefox() {
    return navigator.userAgent.indexOf("firefox") > -1;
  }

  static get isSafari() {
    return !!navigator.userAgent.match(/version\/[\d\.]+.*safari/);
  }

  static get isOpera() {
    return !!navigator.userAgent.indexOf("opr") > -1;
  }

  static get isIE11() {
    return !window.ActiveXObject && "ActiveXObject" in window;
  }

  static get isEdge() {
    return navigator.userAgent.indexOf("edge") > -1;
  }

  static get isChrome() {
    return (
      window.chrome !== null &&
      window.chrome !== undefined &&
      navigator.vendor.toLowerCase() == "google inc." &&
      !Device.isOpera &&
      !Device.isEdge
    );
  }

  static get isIE() {
    return (
      navigator.appVersion.indexOf("msie") > -1 ||
      Device.isIE11 ||
      navigator.appVersion.indexOf("edge") > -1
    );
  }

  static get platform() {
    return navigator.platform;
  }

  static get language() {
    return window.navigator.userLanguage || window.navigator.language;
  }

  static get isTouchDevice() {
    return (
      !!(
        typeof window !== "undefined" &&
        ("ontouchstart" in window ||
          (window.DocumentTouch &&
            typeof document !== "undefined" &&
            document instanceof window.DocumentTouch))
      ) ||
      !!(
        typeof navigator !== "undefined" &&
        (navigator.maxTouchPoints || navigator.msMaxTouchPoints)
      )
    );
  }
}
