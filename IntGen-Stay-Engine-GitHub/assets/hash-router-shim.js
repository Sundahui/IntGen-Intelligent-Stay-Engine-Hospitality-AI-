/*
 * hash-router-shim.js
 * Lets the bundled React (react-router v6 BrowserRouter) app run from the
 * local file:// protocol by replacing its history backend with a hash-based
 * one. This changes ONLY how navigation is stored in the URL (path -> #/path);
 * it does not touch any rendering, layout, fonts or app logic.
 *
 * The bundle's call to its internal browser-history factory has been replaced
 * with a call to window.__mkHashHistory(window). This file defines that
 * factory, returning an object that matches react-router v6's History API.
 */
(function () {
  function genKey() {
    return Math.random().toString(36).substring(2, 10);
  }

  // Parse a "#/operations?x=1#frag" style hash into {pathname, search, hash}.
  function parseHash(rawHash) {
    var h = rawHash || "";
    if (h.charAt(0) === "#") h = h.slice(1);
    if (h === "" || h.charAt(0) !== "/") h = "/" + h; // ensure leading slash
    var pathname = h, search = "", hash = "";
    var hi = pathname.indexOf("#");
    if (hi >= 0) { hash = pathname.slice(hi); pathname = pathname.slice(0, hi); }
    var si = pathname.indexOf("?");
    if (si >= 0) { search = pathname.slice(si); pathname = pathname.slice(0, si); }
    if (pathname === "") pathname = "/";
    return { pathname: pathname, search: search, hash: hash };
  }

  // Build the "#/path?search#hash" string react-router will see in the address bar.
  function toHref(to) {
    var pathname = "/", search = "", hash = "";
    if (typeof to === "string") {
      var p = parseHash(to.charAt(0) === "#" ? to : "#" + to);
      pathname = p.pathname; search = p.search; hash = p.hash;
    } else if (to) {
      pathname = to.pathname || "/";
      search = to.search || "";
      hash = to.hash || "";
    }
    if (search && search !== "?") {
      search = search.charAt(0) === "?" ? search : "?" + search;
    } else { search = ""; }
    if (hash && hash !== "#") {
      hash = hash.charAt(0) === "#" ? hash : "#" + hash;
    } else { hash = ""; }
    return "#" + pathname + search + hash;
  }

  function makeLocation(win, key, state) {
    var p = parseHash(win.location.hash);
    return {
      pathname: p.pathname,
      search: p.search,
      hash: p.hash,
      state: state || null,
      key: key || "default"
    };
  }

  window.__mkHashHistory = function (win) {
    win = win || window;
    var action = "POP";
    var listener = null;
    var currentState = null;
    var currentKey = "default";
    var programmatic = false; // true while we change the hash ourselves

    // If there is no route in the hash yet, default to /operations so the
    // app boots into the Operations Overview just like the server build does.
    if (!win.location.hash || win.location.hash === "#" || win.location.hash === "#/") {
      win.location.replace(win.location.pathname + win.location.search + "#/operations");
    }

    function onHashChange() {
      // A programmatic push/replace already notified the listener; the
      // hashchange it caused must not fire a second (duplicate) update.
      if (programmatic) { programmatic = false; return; }
      action = "POP";
      currentState = null;
      currentKey = genKey();
      if (listener) {
        listener({ action: action, location: history.location, delta: null });
      }
    }

    var history = {
      get action() { return action; },
      get location() { return makeLocation(win, currentKey, currentState); },
      listen: function (fn) {
        if (listener) throw new Error("A history only accepts one active listener");
        win.addEventListener("hashchange", onHashChange);
        listener = fn;
        return function () {
          win.removeEventListener("hashchange", onHashChange);
          listener = null;
        };
      },
      createHref: function (to) { return toHref(to); },
      createURL: function (to) {
        var base = win.location.origin && win.location.origin !== "null"
          ? win.location.origin
          : "http://localhost";
        var p = (typeof to === "string") ? parseHash(to) : {
          pathname: to.pathname || "/", search: to.search || "", hash: to.hash || ""
        };
        return new URL(p.pathname + p.search + p.hash, base);
      },
      encodeLocation: function (to) {
        var u = history.createURL(to);
        return { pathname: u.pathname, search: u.search, hash: u.hash };
      },
      push: function (to, state) {
        action = "PUSH";
        currentState = state || null;
        currentKey = genKey();
        programmatic = true;
        win.location.hash = toHref(to); // updates the address bar (fires hashchange, swallowed)
        if (listener) listener({ action: action, location: history.location, delta: 1 });
      },
      replace: function (to, state) {
        action = "REPLACE";
        currentState = state || null;
        currentKey = genKey();
        programmatic = true;
        var base = win.location.pathname + win.location.search;
        win.location.replace(base + toHref(to));
        if (listener) listener({ action: action, location: history.location, delta: 0 });
      },
      go: function (n) { win.history.go(n); }
    };

    return history;
  };
})();
