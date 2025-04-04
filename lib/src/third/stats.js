define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = void 0;
    var Stats = function () { var e = 0, t = document.createElement("div"); function l(e) { return t.appendChild(e.dom), e; } function n(l) { for (var n = 0; n < t.children.length; n++)
        t.children[n].style.display = n === l ? "block" : "none"; e = l; } t.style.cssText = "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000", t.addEventListener("click", function (l) { l.preventDefault(), n(++e % t.children.length); }, !1); var a = (performance || Date).now(), i = a, o = 0, r = l(new Stats.Panel("FPS", "#0ff", "#002")), f = l(new Stats.Panel("MS", "#0f0", "#020")); if (self.performance && self.performance.memory)
        var c = l(new Stats.Panel("MB", "#f08", "#201")); return n(0), { REVISION: 16, dom: t, addPanel: l, showPanel: n, begin: function () { a = (performance || Date).now(); }, end: function () { o++; var e = (performance || Date).now(); if (f.update(e - a, 200), e > i + 1e3 && (r.update(1e3 * o / (e - i), 100), i = e, o = 0, c)) {
            var t = performance.memory;
            c.update(t.usedJSHeapSize / 1048576, t.jsHeapSizeLimit / 1048576);
        } return e; }, update: function () { a = this.end(); }, domElement: t, setMode: n }; };
    exports.default = Stats;
    Stats.Panel = function (e, t, l) { var n = 1 / 0, a = 0, i = Math.round, o = i(window.devicePixelRatio || 1), r = 80 * o, f = 48 * o, c = 3 * o, d = 2 * o, s = 3 * o, p = 15 * o, u = 74 * o, m = 30 * o, h = document.createElement("canvas"); h.width = r, h.height = f, h.style.cssText = "width:80px;height:48px"; var S = h.getContext("2d"); return S.font = "bold " + 9 * o + "px Helvetica,Arial,sans-serif", S.textBaseline = "top", S.fillStyle = l, S.fillRect(0, 0, r, f), S.fillStyle = t, S.fillText(e, c, d), S.fillRect(s, p, u, m), S.fillStyle = l, S.globalAlpha = .9, S.fillRect(s, p, u, m), { dom: h, update: function (f, v) { n = Math.min(n, f), a = Math.max(a, f), S.fillStyle = l, S.globalAlpha = 1, S.fillRect(0, 0, r, p), S.fillStyle = t, S.fillText(i(f) + " " + e + " (" + i(n) + "-" + i(a) + ")", c, d), S.drawImage(h, s + o, p, u - o, m, s, p, u - o, m), S.fillRect(s + u - o, p, o, m), S.fillStyle = l, S.globalAlpha = .9, S.fillRect(s + u - o, p, o, i((1 - f / v) * m)); } }; };
});
//# sourceMappingURL=stats.js.map