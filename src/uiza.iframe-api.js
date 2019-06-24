Array.from || (Array.from = function () {
        var a, b, c, d, e;
        return e = Object.prototype.toString, a = function (a) {
                return "function" == typeof a || "[object Function]" === e.call(a)
            }, c = function (a) {
                var b;
                return b = Number(a), isNaN(b) ? 0 : 0 !== b && isFinite(b) ? (b > 0 ? 1 : -1) * Math.floor(Math.abs(b)) : b
            }, b = Math.pow(2, 53) - 1, d = function (a) {
                var d;
                return d = c(a), Math.min(Math.max(d, 0), b)
            },
            function (b) {
                var c, e, f, g, h, i, j, k;
                if (e = this, g = Object(b), null === b) throw new TypeError("Array.from requires an array-like object - not null or undefined");
                if (k = arguments.length > 1 ? arguments[1] : void 0, f = void 0, "undefined" != typeof k) {
                    if (!a(k)) throw new TypeError("Array.from: when provided, the second argument must be a function");
                    arguments.length > 2 && (f = arguments[2])
                }
                for (j = d(g.length), c = a(e) ? Object(new e(j)) : new Array(j), h = 0, i = void 0; h < j;) i = g[h], k ? c[h] = "undefined" == typeof f ? k(i, h) : k.call(f, i, h) : c[h] = i, h += 1;
                return c.length = j, c
            }
    }()),
    function (a) {
        var b, c;
        if ("undefined" == typeof a.UZ) a.UZ = {
            loaded: !1
        };
        else if (a.UZ.loaded) return;
        return c = {}, a.UZ.ERROR = {
            RESTRICTED: "RESTRICTED",
            MEDIA_INFO_IS_INCORRECT: "MEDIA_INFO_IS_INCORRECT",
            LIVE_INFO_IS_INCORRECT: "LIVE_INFO_IS_INCORRECT",
            FEED_OVER_BITRATE: "FEED_OVER_BITRATE",
            ABORTED_THE_MEDIA_PLAYBACK: "ABORTED_THE_MEDIA_PLAYBACK",
            THE_MEDIA_DOWNLOAD_TO_FAIL_PART_WAY: "THE_MEDIA_DOWNLOAD_TO_FAIL_PART_WAY",
            THE_MEDIA_COUND_NOT_BE_LOADED: "THE_MEDIA_COUND_NOT_BE_LOADED",
            THE_MEDIA_PLAYBACK_WAS_ABORTED: "THE_MEDIA_PLAYBACK_WAS_ABORTED",
            NO_COMPATIBLE_SOURCE: "NO_COMPATIBLE_SOURCE",
            THE_MEDIA_IS_ENCRYPTED: "THE_MEDIA_IS_ENCRYPTED",
            REQUESTED_KEY_SYSTEM_CONFIG_UNAVAILABLE: "REQUESTED_KEY_SYSTEM_CONFIG_UNAVAILABLE",
            RESTRICTIONS_CANNOT_BE_MET: "RESTRICTIONS_CANNOT_BE_MET"
        }, a.UZ.Player = function (a) {
            return c[a]
        }, b = function (b) {
            var d, e, f, g, h, i, j, k;
            if (b.data)
                if (b.data.onEvent) {
                    if ("onCreate" === b.data.onEvent) {
                        if (e = b.data.id, c[e] && c[e].iframe && c[e].iframe.contentWindow) return;
                        if (c[e] = {}, c[e].iframe = document.getElementById(e), c[e]._callOriginFunc = function (a, b, d) {
                                var f;
                                return f = null, "function" == typeof d && (f = a + "_" + (new Date).getTime(), c[e]._callback[f] = d), c[e].iframe.contentWindow.postMessage({
                                    action: "callOriginFunc",
                                    options: {
                                        func: a,
                                        args: Array.from(b),
                                        callback: f
                                    }
                                }, "*")
                            }, c[e]._attr = {}, c[e]._callback = {}, c[e]._listener = {}, c[e]._getAttr = function (a) {
                                return c[e]._attr[a.toLowerCase()]
                            }, c[e]._setAttr = function (a, b) {
                                return c[e]._attr[a.toLowerCase()] = b
                            }, c[e].addRemoteTextTrack = function () {
                                return this._callOriginFunc("addRemoteTextTrack", arguments)
                            }, c[e].aspectRatio = function () {
                                return arguments.length ? this._callOriginFunc("aspectRatio", arguments) : c[e]._getAttr("aspectRatio")
                            }, c[e].append = function () {
                                return this._callOriginFunc("append", arguments)
                            }, c[e].autoplay = function () {
                                return this._callOriginFunc("autoplay", arguments)
                            }, c[e].bufferedPercent = function () {
                                return c[e]._getAttr("bufferedPercent")
                            }, c[e].canPlayType = function () {
                                return this._callOriginFunc("canPlayType", arguments)
                            }, c[e].controls = function () {
                                return this._callOriginFunc("controls", arguments)
                            }, c[e].currentLevel = function () {
                                return arguments.length ? this._callOriginFunc("currentLevel", arguments) : c[e]._getAttr("currentLevel")
                            }, c[e].currentTime = function () {
                                if (arguments.length) {
                                    if (c[e].options && c[e].options.disable && c[e].options.disable.indexOf("timeshift") !== -1) return;
                                    return this._callOriginFunc("currentTime", arguments)
                                }
                                return c[e]._getAttr("currentTime")
                            }, c[e].dispose = function () {
                                return c[e].iframe.contentWindow.postMessage({
                                    action: "reload"
                                }, "*"), delete c[e]
                            }, c[e].duration = function () {
                                return arguments.length ? this._callOriginFunc("duration", arguments) : c[e]._getAttr("duration")
                            }, c[e].ended = function () {
                                return arguments.length ? this._callOriginFunc("ended", arguments) : c[e]._getAttr("ended")
                            }, c[e].error = function () {
                                return c[e]._getAttr("error") ? JSON.parse(c[e]._getAttr("error")) : null
                            }, c[e].enterFullWindow = function () {
                                return c[e].requestFullscreen()
                            }, c[e].exitFullscreen = function () {
                                var b, d;
                                if (!c[e].options || !c[e].options.disable || c[e].options.disable.indexOf("fullscreen") === -1) return this._callOriginFunc("exitFullscreen", arguments), "undefined" != typeof c[e].advanceCode && c[e].options && !c[e].options.controls && (b = a.document, d = b.exitFullscreen || b.webkitExitFullscreen || b.webkitCancelFullScreen || b.mozCancelFullScreen || b.msExitFullscreen) ? d.apply(b) : void 0
                            }, c[e].exitFullWindow = function () {
                                return c[e].exitFullscreen()
                            }, c[e].height = function () {
                                return arguments.length ? this._callOriginFunc("height", arguments) : c[e]._getAttr("height")
                            }, c[e].ima3 = function () {
                                return this._callOriginFunc("ima3", arguments)
                            }, c[e].isFullscreen = function () {
                                var a;
                                return "undefined" != typeof c[e].advanceCode && c[e].options && !c[e].options.controls ? (a = document.fullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || document.webkitFullscreenElement, !!a) : arguments.length ? this._callOriginFunc("isFullscreen", arguments) : c[e]._getAttr("isFullscreen")
                            }, c[e].language = function () {
                                return this._callOriginFunc("language", arguments)
                            }, c[e].load = function () {
                                return this._callOriginFunc("load", arguments)
                            }, c[e].loop = function () {
                                return this._callOriginFunc("loop", arguments)
                            }, c[e].muted = function () {
                                return arguments.length ? this._callOriginFunc("muted", arguments) : c[e]._getAttr("muted")
                            }, c[e].off = function (a, b) {
                                var d, f, g, h;
                                if (a in c[e]._listener) {
                                    for (h = [], d = f = 0, g = c[e]._listener[a].length; 0 <= g ? f < g : f > g; d = 0 <= g ? ++f : --f) c[e]._listener[a][d] === b ? h.push(c[e]._listener[a].splice(d, 1)) : h.push(void 0);
                                    return h
                                }
                            }, c[e].on = function (a, b) {
                                return a in c[e]._listener ? c[e]._listener[a].push(b) : c[e]._listener[a] = [b]
                            }, c[e].pause = function () {
                                return this._callOriginFunc("pause", arguments)
                            }, c[e].paused = function () {
                                return c[e]._getAttr("paused")
                            }, c[e].play = function () {
                                return this._callOriginFunc("play", arguments)
                            }, c[e].playbackRate = function () {
                                return arguments.length ? this._callOriginFunc("playbackRate", arguments) : c[e]._getAttr("playbackRate")
                            }, c[e].playsinline = function () {
                                if (arguments.length) return this._callOriginFunc("playsinline", arguments)
                            }, c[e].poster = function () {
                                return arguments.length ? this._callOriginFunc("poster", arguments) : c[e]._getAttr("poster")
                            }, c[e].preload = function () {
                                return this._callOriginFunc("preload", arguments)
                            }, c[e].qualities = function () {
                                return JSON.parse(c[e]._getAttr("qualities"))
                            }, c[e].remainingTime = function () {
                                return c[e]._getAttr("remainingTime")
                            }, c[e].requestFullscreen = function () {
                                var a, b, d;
                                if (!c[e].options || !c[e].options.disable || c[e].options.disable.indexOf("fullscreen") === -1) return this._callOriginFunc("requestFullscreen", arguments), "undefined" != typeof c[e].advanceCode && c[e].options && !c[e].options.controls ? (b = c[e].iframe.parentElement, d = b.requestFullscreen || b.webkitRequestFullscreen || b.webkitRequestFullScreen || b.mozRequestFullScreen || b.msRequestFullscreen, d && d.apply(b), a = function (b) {
                                    if (!c[e].isFullscreen()) return document.removeEventListener("fullscreenchange", a), document.removeEventListener("webkitfullscreenchange", a), document.removeEventListener("mozfullscreenchange", a), document.removeEventListener("MSFullscreenChange", a), setTimeout(function () {
                                        if (c[e]._getAttr("isFullscreen") !== c[e].isFullscreen()) return c[e]._callOriginFunc("exitFullscreen", [])
                                    }, 100)
                                }, document.addEventListener("fullscreenchange", a), document.addEventListener("webkitfullscreenchange", a), document.addEventListener("mozfullscreenchange", a), document.addEventListener("MSFullscreenChange", a)) : void 0
                            }, c[e].reset = function () {
                                return this._callOriginFunc("reset", arguments)
                            }, c[e].restricted = function () {
                                return this._callOriginFunc("restricted", arguments)
                            }, c[e].seeking = function () {
                                return c[e]._getAttr("seeking")
                            }, c[e].snapshot = function (a) {
                                return this._callOriginFunc("snapshot.snap", [], function (b) {
                                    if ("function" == typeof a) return a(b)
                                })
                            }, c[e].src = function () {
                                return this._callOriginFunc("src", arguments)
                            }, c[e].title = function (a) {
                                return c[e].iframe.contentWindow.postMessage({
                                    action: "setTitle",
                                    title: a
                                }, "*")
                            }, c[e].volume = function () {
                                return arguments.length ? this._callOriginFunc("volume", arguments) : c[e]._getAttr("volume")
                            }, c[e].width = function () {
                                return arguments.length ? this._callOriginFunc("width", arguments) : c[e]._getAttr("width")
                            }, "function" == typeof a.onUizaIframeAPIReady && onUizaIframeAPIReady(e, c[e]), "function" == typeof a.onUizaIframeAPIReady_) return onUizaIframeAPIReady_(e, c[e])
                    }
                } else {
                    if (b.data.onAttr) return c[b.data.id]._setAttr(b.data.onAttr, b.data.value);
                    if (b.data.onCallback) {
                        if ("function" == typeof c[b.data.id]._callback[b.data.onCallback]) return c[b.data.id]._callback[b.data.onCallback](b.data.response)
                    } else if (b.data.onGetVar) {
                        if ("location.href" === b.data.onGetVar) try {
                            return b.source.postMessage({
                                action: "onCallbackVar",
                                "var": "location.href",
                                value: location.href
                            }, "*")
                        } catch (l) {} else if ("document.referrer" === b.data.onGetVar) try {
                            return b.source.postMessage({
                                action: "onCallbackVar",
                                "var": "document.referrer",
                                value: document.referrer
                            }, "*")
                        } catch (m) {}
                    } else if (b.data.onListener) {
                        if (e = b.data.id, "click" === b.data.onListener && "undefined" != typeof c[e].advanceCode) {
                            if (c[e].options && c[e].options.disable && c[e].options.disable.indexOf("fullscreen") !== -1) return;
                            c[e].iframe.style.pointerEvents = "none", g = c[e].iframe.parentElement, a.timeoutUizaPlayerClick && (g.onclick = null, clearTimeout(a.timeoutUizaPlayerClick)), a.timeoutUizaPlayerClick = setTimeout(function () {
                                return c[e].iframe.style.pointerEvents = "auto", g.onclick = null
                            }, 500), setTimeout(function () {
                                return g.onclick = function (a) {
                                    if (a.isTrusted !== !1) return c[e].isFullscreen() ? c[e].exitFullscreen() : c[e].requestFullscreen(), g.onclick = null, c[e].paused() ? c[e].play() : c[e].pause(), c[e]._callOriginFunc("trigger", ["dblclick"])
                                }
                            }, 10)
                        }
                        if (b.data.onListener in c[e]._listener) {
                            for (k = b.data.value, j = b.data.typeValue, "undefined" != typeof j && ("object" === j ? k = JSON.parse(k) : "int" === j ? k = parseInt(k, 10) : "float" === j && (k = parseFloat(k))), i = [], d = f = 0, h = c[e]._listener[b.data.onListener].length; 0 <= h ? f < h : f > h; d = 0 <= h ? ++f : --f) try {
                                "undefined" != typeof k ? i.push(c[e]._listener[b.data.onListener][d]({
                                    player: c[e],
                                    value: k
                                })) : i.push(c[e]._listener[b.data.onListener][d]({
                                    player: c[e]
                                }))
                            } catch (n) {}
                            return i
                        }
                    }
                }
        }, a.addEventListener ? a.addEventListener("message", b, !1) : a.attachEvent("onmessage", b), a.UZ.loaded = !0
    }(window);