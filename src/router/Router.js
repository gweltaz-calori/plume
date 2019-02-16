import Component from "../component/Component";
import { Create } from "../ui/index";
import SuperWindow from "../window/SuperWindow";
import { WindowEventsTypes } from "../window/SuperWindow";
import SuperDom from "../component/Dom";
import TweenManager from "../tween/TweenManager";

export default class Router extends Component {
  constructor({ routes = [] }) {
    super({});
    SuperDom.router = this;
    this.query = {};
    this.routes = routes;
    this.fetchedRoute = null;

    for (let i = this.routes.length - 1; i >= 0; i--) {
      const route = this.routes[i];
      if (route.path !== "*") {
        route.paramsGroupNames = this._getParamsGroupNames(route.path);
        route.regex = new RegExp(
          route.path
            .replace(/\/(:([a-zA-Z0-9_\-]+))/g, "/([a-zA-Z0-9_-]+)")
            .replace(/\//g, "\\/") + "$"
        );
      }
    }
  }
  _initializeRoutes() {
    let foundRoute = true;

    for (let i = this.routes.length - 1; i >= 0; i--) {
      const route = this.routes[i];

      foundRoute = this._checkCurrentRouteState(
        route,
        window.location.pathname
      );
      if (foundRoute) {
        break;
      }
    }

    if (!foundRoute) {
      const notFoundComponent = this.routes.find(
        routeItem => routeItem.path === "*"
      );

      if (notFoundComponent) {
        this._changeRouteComponent(notFoundComponent, window.location.pathname);
      }
    }
  }

  get $route() {
    for (let i = this.routes.length - 1; i >= 0; i--) {
      const route = this.routes[i];

      if (route.regex && route.regex.test(window.location.pathname)) {
        return route;
      }
    }
  }

  _getParamsGroupNames(path) {
    const matches = [];
    const exp = new RegExp(":([a-zA-Z0-9_]+)", "g");
    let match;
    while ((match = exp.exec(path))) {
      matches.push(match[1]);
    }
    return matches;
  }

  _getParamsGroupValues(exp, urlToTest) {
    return urlToTest.match(exp).slice(1);
  }

  _getParams(route, path) {
    return route.paramsGroupNames.reduce((params, param, index) => {
      params[param] = this._getParamsGroupValues(route.regex, path)[index];

      return params;
    }, {});
  }

  _addEventListeners() {
    SuperWindow.on(WindowEventsTypes.POP_STATE, this._onPopState.bind(this));
  }

  _removeEventListeners() {
    SuperWindow.off(WindowEventsTypes.POP_STATE, this._onPopState.bind(this));
  }

  _onPopState(e) {
    const routeChild = this.routes.find(routeItem => {
      return routeItem.regex && routeItem.regex.test(window.location.pathname);
    });
    if (routeChild) {
      this._changeRouteComponent(routeChild, window.location.pathname);
    }
  }

  _checkCurrentRouteState(route, pathname, fetch = false) {
    //try to find a routes that match the path
    if (route.regex && route.regex.test(pathname)) {
      if (!fetch) {
        this._changeRouteComponent(route, pathname);
      } else {
        this._fetchRouteComponent(route, pathname);
      }

      return true;
    }

    return false;
  }

  _changeRouteComponent(route, pathname) {
    SuperDom.router.query = this._getParams(route, pathname);
    const componentInstance = new route.component();
    this.$el.replaceChild(componentInstance);
    TweenManager.set({
      el: componentInstance.__el__,
      position: "absolute",
      top: 0,
      left: 0
    });
  }

  _fetchRouteComponent(route, pathname) {
    if (this.fetchedRoute && this.fetchedRoute.route === route) return;
    SuperDom.router.query = this._getParams(route, pathname);
    const componentInstance = new route.component();
    componentInstance.isTransition = true;
    this.$el.add(componentInstance);
    TweenManager.set({
      el: componentInstance.__el__,
      position: "absolute",
      top: 0,
      left: 0,
      /* opacity: 0, */
      pointerEvents: "none"
    });

    this.fetchedRoute = {
      route,
      path: pathname,
      el: componentInstance.__el__
    };

    return componentInstance;
  }

  fetch(path) {
    if (path === window.location.pathname) return;
    let foundRoute = true;
    let fetchedEl = null;
    for (let i = this.routes.length - 1; i >= 0; i--) {
      const route = this.routes[i];

      if (route.regex && route.regex.test(path)) {
        fetchedEl = this._fetchRouteComponent(route, path);
        break;
      }
    }

    if (!foundRoute) {
      const notFoundComponent = this.routes.find(
        routeItem => routeItem.path === "*"
      );

      if (notFoundComponent) {
        this._fetchRouteComponent(notFoundComponent, path);
      }
    }

    return fetchedEl;
  }

  showFromFetch() {
    TweenManager.set({
      el: this.fetchedRoute.el,
      opacity: 1,
      pointerEvents: "all"
    });

    window.history.pushState({}, null, this.fetchedRoute.path);
    let i = 0;
    for (let child of this.$el._children) {
      if (child !== this.fetchedRoute.el) {
        child.__el__.remove();
        child.destroy();
        this.$el._children.splice(i, 1);
      }
      i++;
    }

    this.fetchedRoute = null;
  }

  push(path) {
    if (path === window.location.pathname) return;
    let foundRoute = true;

    for (let i = this.routes.length - 1; i >= 0; i--) {
      const route = this.routes[i];

      foundRoute = this._checkCurrentRouteState(route, path);
      if (foundRoute) {
        window.history.pushState({}, null, path);
        break;
      }
    }

    if (!foundRoute) {
      const notFoundComponent = this.routes.find(
        routeItem => routeItem.path === "*"
      );

      if (notFoundComponent) {
        window.history.pushState({}, null, path);
        this._changeRouteComponent(notFoundComponent, path);
      }
    }
  }

  onStart() {
    this._initializeRoutes();
    this._addEventListeners();
  }

  render() {
    return (this.$el = Create({
      position: "relative",
      width: "100%",
      height: "100%"
    }));
  }
}
