/*
 Copyright 2011-2016 Adobe Systems Incorporated. All Rights Reserved.
*/
(function (c) {
    "function" === typeof define && define.amd && define.amd.jQuery ? define(["jquery", "webpro", "museutils"], c) : c(jQuery)
})(function (c) {
    Muse.Plugins.SlideShowCaptions = {
        defaultOptions: {
            captionClassName: "SSSlideCaption"
        },
        initialize: function (b, d) {
            var a = this;
            c.extend(d, c.extend({}, a.defaultOptions, d));
            b.bind("attach-behavior", function () {
                a._attachBehavior(b)
            })
        },
        _attachBehavior: function (b) {
            var c = b._sscpCaptions ? b._sscpCaptions : b._findWidgetElements("." + b.options.captionClassName);
            if (c.length) b._sscpCaptions =
                c, c.css("display", "none"), b.slides.bind("wp-panel-show", function (a, b) {
                    c.eq(b.panelIndex).css("display", "block")
                }), b.slides.bind("wp-panel-hide", function (a, b) {
                    c.eq(b.panelIndex).css("display", "none")
                }), b.bind("ready", function () {
                    -1 != b.slides.activeIndex && c.eq(b.slides.activeIndex).css("display", "block")
                })
        }
    };
    Muse.Plugins.SlideShowLabel = {
        defaultOptions: {
            labelClassName: "SlideShowLabel"
        },
        initialize: function (b, d) {
            var a = this;
            c.extend(d, c.extend({}, a.defaultOptions, d));
            b.bind("attach-behavior", function () {
                a._attachBehavior(b)
            })
        },
        _attachBehavior: function (b) {
            var c = this,
                a = b._$sslpLabels ? b._$sslpLabels : b._findWidgetElements("." + b.options.labelClassName);
            if (a.length) b._$sslpLabels = a, b.slides.bind("wp-panel-show", function () {
                c._updateLabels(b)
            }), b.bind("ready", function () {
                c._updateLabels(b)
            })
        },
        _findAllTextNodes: function (b, c) {
            c = c || [];
            switch (b.nodeType) {
                case 3:
                    c.push(b);
                    break;
                case 1:
                    if (b.nodeName.toLowerCase() !== "script")
                        for (var a = b.firstChild; a;) this._findAllTextNodes(a, c), a = a.nextSibling
            }
            b.nextSibling && this._findAllTextNodes(b.nextSibling,
                c);
            return c
        },
        _updateLabels: function (b) {
            var c = this,
                a = b.slides,
                f = a.activeIndex + 1,
                h = a.$element.length;
            b._$sslpLabels.each(function () {
                for (var a = c._findAllTextNodes(this), b = a.length, k = 0, l = function (a) {
                        return ++k === 1 ? f : k === 2 ? h : a
                    }, j = 0; j < b; j++) {
                    var m = a[j],
                        n = m.nodeValue,
                        q = n.replace(/\d+/g, l);
                    if (q !== n) m.nodeValue = q
                }
            })
        }
    };
    Muse.Plugins.Lightbox = {
        defaultOptions: {
            lightboxPartsSelector: ".PamphletLightboxPart",
            closeBtnClassName: "PamphletCloseButton"
        },
        initialize: function (b, d) {
            var a = this;
            c.extend(d, c.extend({}, a.defaultOptions,
                d));
            b._sslbpAutoPlay = d.autoPlay;
            d.autoPlay = !1;
            b.bind("before-transform-markup", function () {
                a._beforeTransformMarkup(b)
            });
            b.bind("attach-behavior", function () {
                a._attachBehavior(b)
            });
            d.autoActivate_runtime && b.bind("ready", function () {
                a._openLightbox(b)
            })
        },
        _beforeTransformMarkup: function (b) {
            b._sslbpShownInitially = !0;
            var c = b._findWidgetElements("." + b.options.slideClassName);
            if (c.filter(":hidden").length == 0) b._sslbpSlideOffset = c.offset();
            else {
                b._sslbpShownInitially = !1;
                var a = b._findWidgetElements("." + b.options.viewClassName);
                b._sslbpSlideOffset = {
                    top: Muse.Utils.getCSSIntValue(a, "top") + Muse.Utils.getCSSIntValue(c, "top"),
                    left: Muse.Utils.getCSSIntValue(a, "left") + Muse.Utils.getCSSIntValue(c, "left")
                }
            }
        },
        _attachBehavior: function (b) {
            var c = this,
                a = b.options;
            b.tabs.$element.unbind(a.event).bind(a.event, function () {
                c._openLightbox(b)
            });
            b.slides.unbind("wp-panel-before-show").bind("wp-panel-before-show", function () {
                c._openLightbox(b)
            });
            if (Muse.Browser.Features.Touch && a.elastic === "fullScreen") b.slides.$element.not("a[href]").off("click").on("click",
                function () {
                    c._closeLightbox(b)
                });
            b._$sslbpCloseBtn = b._findWidgetElements("." + a.closeBtnClassName).unbind("click").bind("click", function () {
                c._closeLightbox(b)
            });
            c._initializeMarkup(b)
        },
        _initializeMarkup: function (b) {
            function d(a, b, c, d) {
                var f = b.width() / a.width(),
                    g = b.height(),
                    h = (b.offset().left - a.offset().left) * 100 / a.width() + "%",
                    i = 0;
                if (d && c) switch (d) {
                    case "page_fixedLeft":
                        c = b.offset().left - a.offset().left;
                        c >= 0 && (h = c + "px");
                        break;
                    case "page_fixedRight":
                        i = b.offset().left - a.offset().left;
                        b = 1;
                        a = a.width();
                        if (c === "fluidWidth" || c === "fluidWidthHeight") b = 1 - f;
                        h = b * 100 + "%";
                        i = i - b * a + "px";
                        break;
                    case "page_fixedCenter":
                        i = b.offset().left - a.offset().left;
                        b = 0.5;
                        a = a.width();
                        if (c === "fluidWidth" || c === "fluidWidthHeight") b = 0.5 - f / 2;
                        h = b * 100 + "%";
                        i = i - b * a + "px"
                }
                return {
                    width: f * 100 + "%",
                    height: g,
                    "margin-left": h,
                    left: i
                }
            }
            var a;
            if (document.body) a = document.body.scrollTop;
            var f = b.options,
                h = f.elastic !== "off",
                g = b._findWidgetElements("." + f.viewClassName),
                i = b.slides.$element,
                k = g,
                l = b._sslbpSlideOffset,
                j = i.outerWidth(),
                m = f.slideClassName ==
                "Container",
                n = f.contentLayout_runtime == "lightbox",
                q = !h && n && f.isResponsive;
            i.parent().outerWidth();
            f.isResponsive = f.isResponsive && !h;
            Muse.Utils.moveElementsOutsideViewport(b.$element.parents());
            Muse.Utils.moveElementsOutsideViewport(g.children());
            Muse.Utils.resizeImages(b.$element, b.$element.attr("id"));
            Muse.Utils.moveElementsInsideViewport(g.children());
            Muse.Utils.moveElementsInsideViewport(b.$element.parents());
            var p = i.outerHeight(),
                o = b._findWidgetElements(f.lightboxPartsSelector);
            f.isResponsive &&
                (o = o.map(function () {
                    var a = c(this).parent();
                    return a.hasClass("popup_anchor") ? a[0] : this
                }));
            if (0 == g.length) {
                if (!b._$sslbpOverlay) b._$sslbpOverlay = c(".LightboxContent"), b._$sslbpOverlay.museOverlay("reuseAcrossBPs")
            } else {
                k = c(g[0].parentNode).filter("." + f.clipClassName);
                k.length === 0 && (k = g);
                o.each(function (a, d) {
                    var i = c(d);
                    if (i.css("position") !== "fixed")
                        if (f.isResponsive) q || i.css({
                            top: 0
                        });
                        else {
                            var k = b._sslbpShownInitially ? i.offset() : {
                                    top: Muse.Utils.getCSSIntValue(i, "top"),
                                    left: Muse.Utils.getCSSIntValue(i,
                                        "left")
                                },
                                j = {
                                    top: k.top - l.top
                                };
                            h ? j.top += Muse.Utils.getCSSIntValue(g, "padding-top") : j.left = k.left - l.left;
                            i.css(j)
                        }
                }).addClass("popup_element");
                var r = c("<div/>").attr("id", g.attr("id") || "").css({
                        left: 0,
                        top: 0,
                        width: "auto",
                        height: "auto",
                        padding: 0,
                        margin: 0,
                        zIndex: "auto"
                    }),
                    s;
                h && (s = c("<div/>"), f.elastic === "fullScreen" ? s.addClass("fullscreen") : f.elastic === "fullWidth" && s.addClass("fullwidth"), s.css({
                    borderColor: g.css("border-left-color"),
                    borderStyle: g.css("border-left-style"),
                    borderLeftWidth: g.css("border-left-width"),
                    borderRightWidth: g.css("border-right-width"),
                    borderTopWidth: g.css("border-top-width"),
                    borderBottomWidth: g.css("border-bottom-width")
                }), f.elastic !== "fullScreen" && s.css({
                    paddingLeft: g.css("padding-left"),
                    paddingRight: g.css("padding-right"),
                    paddingTop: g.css("padding-top"),
                    paddingBottom: g.css("padding-bottom")
                }), s.append(Muse.Utils.includeMEditableTags(k)), s.append(Muse.Utils.includeMEditableTags(o)), r.css({
                    border: "none"
                }));
                var w = c("<div/>").addClass("overlayWedge").insertBefore(Muse.Utils.includeMEditableTags(i)[0]);
                r.append(Muse.Utils.includeMEditableTags(g.children().not("." + f.slideClassName)));
                Muse.Utils.appendChildren(g, Muse.Utils.includeMEditableTags(i));
                r.css({
                    visibility: "hidden"
                }).appendTo(document.body);
                r.detach().css({
                    visibility: ""
                });
                Muse.Utils.moveElementsOutsideViewport(k.parents());
                k.css({
                    position: f.elastic === "fullScreen" ? "relative" : "absolute",
                    padding: q ? k.css("padding") : 0,
                    left: f.elastic === "fullWidth" ? "" : q ? k.css("left") : 0,
                    top: q ? k.css("top") : 0,
                    borderWidth: 0,
                    background: "none",
                    width: q ? k.width() * 100 / k.parent().width() +
                        "%" : f.elastic === "fullScreen" ? "100%" : k.css("width"),
                    height: !q && f.elastic === "fullScreen" ? "100%" : k.css("height")
                });
                Muse.Utils.moveElementsInsideViewport(k.parents());
                g.removeAttr("id");
                !q && f.elastic !== "fullScreen" && k.css({
                    width: j + "px",
                    height: p
                });
                (!n || !m || !f.isResponsive) && f.transitionStyle === "fading" && i.css({
                    position: "absolute",
                    left: 0,
                    top: 0
                });
                var y;
                if (b._fstpPositionSlides || b._csspResizeFullScreenImages) y = function (a, c) {
                    b._fstpPositionSlides && b._fstpPositionSlides(a, c);
                    b._csspResizeFullScreenImages &&
                        b._csspResizeFullScreenImages(b, b.slides.$element, f.heroFitting)
                };
                j = c("<div/>").addClass("LightboxContent").css({
                    position: "absolute"
                });
                if (!q || h) j.append(h ? s : k);
                !q && !h && j.append(Muse.Utils.includeMEditableTags(o));
                if (q) {
                    var k = b.$element,
                        o = k.attr("data-sizePolicy"),
                        n = k.attr("data-pintopage"),
                        u;
                    m ? (m = b._findWidgetElements("." + f.slideLinksClassName), p = m.attr("data-sizePolicy"), u = m.attr("data-pintopage")) : (u = b.$element.find("." + f.slideLinksClassName), m = u.closest(".popup_anchor"), p = u.attr("data-sizePolicy"),
                        u = u.attr("data-pintopage"));
                    var t;
                    p === void 0 && u === void 0 ? (p = o, u = n) : p === "fixed" && u === "page_fluidx" && (u = n);
                    m && m.length > 0 && (Muse.Utils.moveElementsOutsideViewport(m.parents()), t = d(k, m, p, u), Muse.Utils.moveElementsInsideViewport(m.parents()));
                    h ? s.append(k.children()) : Muse.Utils.appendChildren(j, k.children());
                    m.parent();
                    k.append(m);
                    m && m.length > 0 && m.css(t)
                }
                j.museOverlay({
                    autoOpen: !1,
                    $slides: i,
                    $overlaySlice: r,
                    $overlayWedge: w,
                    slideshow: b,
                    onNext: function () {
                        b.next()
                    },
                    onPrevious: function () {
                        b.previous()
                    },
                    onClose: function () {
                        b.stop();
                        b.slides.hidePanel(b.slides.activeElement);
                        b.tabs.activeElement && b.tabs.activeElement.focus()
                    },
                    $elasticContent: s,
                    resizeSlidesFn: y
                });
                if (c.browser.msie && c.browser.version < 9) {
                    Muse.Assert.assert(!Muse.Utils.isIBE(), "IBE doesn't support <IE10, so how did we get here?");
                    var x = r[0];
                    Muse.Utils.needPIE(function () {
                        PIE.detach(x);
                        PIE.attach(x)
                    })
                }
                b._$sslbpOverlay = j;
                if (document.body) document.body.scrollTop = a
            }
        },
        _openLightbox: function (b) {
            var c = b._$sslbpOverlay;
            c.data("museOverlay").isOpen || (c.museOverlay("open"),
                b._sslbpAutoPlay && b.play())
        },
        _closeLightbox: function (b) {
            b = b._$sslbpOverlay;
            b.data("museOverlay").isOpen && b.museOverlay("close")
        }
    };
    Muse.Plugins.ContentSlideShow = {
        defaultOptions: {
            displayInterval: 3E3,
            transitionDuration: 500,
            transitionStyle: "fading",
            contentLayout_runtime: "stack",
            event: "click",
            deactivationEvent: "none",
            hideAllContentsFirst: !1,
            shuffle: !1,
            resumeAutoplay: !1,
            resumeAutoplayInterval: 3E3,
            elastic: "off",
            autoActivate_runtime: !1
        },
        slideShowOverrides: {
            slideshowClassName: "SlideShowWidget",
            viewClassName: "SlideShowContentPanel",
            slideClassName: "SSSlide",
            slideLinksClassName: "SSSlideLinks",
            slideLinkClassName: "SSSlideLink",
            slideLinkActiveClassName: "SSSlideLinkSelected",
            slideCountClassName: "SSSlideCount",
            firstBtnClassName: "SSFirstButton",
            lastBtnClassName: "SSLastButton",
            prevBtnClassName: "SSPreviousButton",
            nextBtnClassName: "SSNextButton",
            playBtnClassName: "SSPlayButton",
            stopBtnClassName: "SSStopButton",
            closeBtnClassName: "SSCloseButton",
            heroFitting: "fitContentProportionally",
            thumbFitting: "fillFrameProportionally",
            slideShowCaptionPanel: "SlideShowCaptionPanel",
            lightboxPartsSelector: ".SlideShowCaptionPanel, .SSFirstButton, .SSPreviousButton, .SSNextButton, .SSLastButton, .SlideShowLabel, .SSCloseButton",
            lightboxEnabled_runtime: !1
        },
        compositionOverrides: {
            slideshowClassName: "PamphletWidget",
            viewClassName: "ContainerGroup",
            slideClassName: "Container",
            slideLinksClassName: "ThumbGroup",
            slideLinkClassName: "Thumb",
            slideLinkActiveClassName: "PamphletThumbSelected",
            prevBtnClassName: "PamphletPrevButton",
            nextBtnClassName: "PamphletNextButton",
            closeBtnClassName: "PamphletCloseButton",
            lightboxPartsSelector: ".PamphletLightboxPart"
        },
        initialize: function (b, d) {
            var a = this,
                f = b.$element.hasClass("SlideShowWidget"),
                h = f ? a.slideShowOverrides : a.compositionOverrides;
            b._csspIsImageSlideShow = f;
            b._restartTimer = 0;
            c.extend(d, c.extend({}, a.defaultOptions, h, d));
            if (b.$element.hasClass("HeroFillFrame")) d.heroFitting = "fillFrameProportionally";
            if (d.lightboxEnabled_runtime) d.contentLayout_runtime = "lightbox";
            if (d.contentLayout_runtime == "lightbox" && !d.autoActivate_runtime) d.hideAllContentsFirst = !0;
            if (d.hideAllContentsFirst) d.defaultIndex = -1;
            if (d.elastic !== "off") b._csspPositionImage = a._positionImage;
            f && (WebPro.Widget.ContentSlideShow.slideImageIncludePlugin.initialize(b, d), Muse.Plugins.SlideShowLabel.initialize(b, d), Muse.Plugins.SlideShowCaptions.initialize(b, d));
            d.transitionStyle == "fading" ? WebPro.Widget.ContentSlideShow.fadingTransitionPlugin.initialize(b, d) : WebPro.Widget.ContentSlideShow.filmstripTransitionPlugin.initialize(b, d);
            WebPro.Widget.ContentSlideShow.alignPartsToPagePlugin.initialize(b, d);
            if (d.contentLayout_runtime === "lightbox") {
                if (d.elastic !==
                    "off") b._csspResizeFullScreenImages = a._resizeFullScreenImages;
                if (0 < c(".LightboxContent").length) d.autoActivate_runtime = !1;
                Muse.Plugins.Lightbox.initialize(b, d)
            }
            d.shuffle === !0 && WebPro.Widget.ContentSlideShow.shufflePlayPlugin.initialize(b, d);
            b.bind("transform-markup", function () {
                a._transformMarkup(b)
            });
            c("body").on("muse_bp_activate", function (c, f, h) {
                h.is(b.$bp) && a._onBPActivate(a, b, d)
            }).on("muse_bp_deactivate", function (c, f, h) {
                h.is(b.$bp) && a._onBPDeactivate(a, b, d)
            });
            b.bind("attach-behavior", function () {
                a._attachBehavior(b)
            })
        },
        _onBPActivate: function (b, c, a) {
            a.transitionStyle !== "fading" && this._updateClipElement(c);
            c._attachBehavior();
            c.trigger("attach-behavior");
            "lightbox" !== a.contentLayout_runtime && (a = c.slides.$element.eq(c.slides.activeIndex)[0], a = {
                panel: a,
                panelIndex: c.slides._getElementIndex(a)
            }, c.options.hideAllContentsFirst || c.slides.trigger("wp-panel-show", a), (c.options.autoPlay || c._sslbpAutoPlay) && c.options.resumeAutoplay && 0 < c.options.resumeAutoplayInterval ? b._startRestartTimer(c) : c._wasPlaying && c.play(!0))
        },
        _onBPDeactivate: function (b,
            d) {
            c(window).off("orientationchange resize", b._onResize);
            c(window).off("pageWidthChanged", b._onResize);
            (d.$element.attr("data-inside-lightbox") === "true" || Muse.Utils.widgetInsideLightbox(d.$element.parents(".PamphletWidget"))) && c(window).off("lightboxresize", b._onResize);
            d._wasPlaying = d.isPlaying();
            d._wasPlaying && d.stop();
            b._stopRestartTimer(d)
        },
        _updateClipElement: function (b, d) {
            function a(a) {
                var b = a.css("left");
                if (a.attr("data-pintopage") === "page_fixedRight" || a.attr("data-pintopage") === "page_fixedCenter") b =
                    (parseFloat(a.css("left")) + parseFloat(a.css("margin-left"))).toString() + "px";
                return b
            }
            var f = b.options,
                h = b._findWidgetElements("." + f.viewClassName),
                g = b.$clipElement ? b.$clipElement : c("<div/>").addClass(f.clipClassName),
                i = b._findWidgetElements("." + f.slideClassName);
            d === !0 && f.contentLayout_runtime !== "lightbox" && f.isResponsive && (g.css("width", ""), h.css("width", ""), h.children().each(function () {
                c(this).css("width", "")
            }));
            f.contentLayout_runtime === "lightbox" || f.elastic === "fullScreen" || (g.addClass("has_updated_clip_width"),
                h.addClass("has_updated_clip_width"), h.children().addClass("has_updated_clip_width"));
            var k = i.outerWidth(),
                i = i.outerHeight();
            if (f.elastic === "fullScreen") g.addClass("fullscreen");
            else {
                var l = {
                        position: "relative",
                        width: k + "px",
                        height: i + "px",
                        overflow: "hidden"
                    },
                    j = h.css("position");
                if (j === "absolute") l.position = j, l.left = a(h), l.top = h.css("top");
                else if (j === "fixed") {
                    var m = Muse.Utils.getStyleSheetRulesById(Muse.Utils.getPageStyleSheets(), h.get(0).id);
                    l.position = j;
                    l.left = Muse.Utils.getRuleProperty(m, "left");
                    l.top = Muse.Utils.getRuleProperty(m, "top");
                    l.bottom = Muse.Utils.getRuleProperty(m, "bottom");
                    l.right = Muse.Utils.getRuleProperty(m, "right")
                }
                g.css(l);
                !f.isResponsive && f.transitionStyle === "fading" && j !== "fixed" && (i = k = 0);
                h.css({
                    width: k + "px",
                    height: i + "px"
                });
                i = !1;
                f.isResponsive && f.contentLayout_runtime === "lightbox" && h.length > 0 && (i = !Muse.Utils.isPropertyInPercent(h.closest(".popup_anchor"), "width"));
                !i && f.isResponsive && h.children().each(function () {
                    if (f.contentLayout_runtime === "lightbox" || f.elastic === "fullWidth") c(this).hasClass("borderbox") ||
                        c(this).addClass("borderbox"), c(this).css("width", "100%");
                    else if (c(this).hasClass("borderbox")) c(this).css("width", k + "px");
                    else {
                        var a = c(this).outerWidth() - c(this).innerWidth();
                        c(this).css("width", k - a + "px")
                    }
                })
            }
            f.isResponsive && f.contentLayout_runtime != "lightbox" && f.elastic != "fullScreen" && (h = h.closest(".popup_anchor"), i = h.children(), l = c(i[0]), (l.css("position") !== "fixed" || i.length > 1) && h.height(l.outerHeight()));
            b.$element && g && b.$element.hasClass("PamphletWidget") && b.$element.hasClass("allow_click_through") &&
                g.css("pointer-events", "none");
            b._fstpPositionSlides && b._fstpPositionSlides();
            return g
        },
        _syncTargetHeights: function (b) {
            var d = b.options,
                a = b._findWidgetElements("." + d.viewClassName),
                f = b._findWidgetElements("." + d.clipClassName),
                h = b._findWidgetElements("." + d.slideClassName);
            d.transitionStyle !== "fading" && d.isResponsive && (a.css("width", ""), f.css("width", ""), a.children().css("width", ""));
            d.contentLayout_runtime === "lightbox" || d.elastic === "fullScreen" || (f = b.$element.parents().filter(".has_updated_clip_width"),
                f.css("width", ""), f.removeClass("has_updated_clip_width"));
            d.viewClassName === "ContainerGroup" ? Muse.Utils.moveElementsOutsideViewport(h) : Muse.Utils.moveElementsOutsideViewport(a.children());
            Muse.Utils.resizeImages(b.$element, b.$element.attr("id"));
            Muse.Utils.adjustTargetAndSlideHeights(a, d.contentLayout_runtime);
            if (d.contentLayout_runtime != "lightbox" && d.elastic != "fullScreen") {
                var b = a.closest(".popup_anchor"),
                    f = b.children(),
                    g = c(f[0]);
                (g.css("position") !== "fixed" || f.length > 1) && b.height(g.outerHeight())
            }
            d.viewClassName ===
                "ContainerGroup" ? Muse.Utils.moveElementsInsideViewport(h) : Muse.Utils.moveElementsInsideViewport(a.children())
        },
        _syncSlideShowTriggerHeights: function (b) {
            var d = b._findWidgetElements("." + b.options.slideLinkClassName),
                b = b._findWidgetElements("." + b.options.slideLinksClassName),
                a, f, h;
            d.each(function () {
                a = c(this);
                a.css("height", "");
                a.css("height", parseInt(window.getComputedStyle(this).getPropertyValue("height")))
            });
            b.each(function () {
                a = c(this);
                a.css("height", "");
                var b = parseInt(window.getComputedStyle(this).getPropertyValue("padding-top")),
                    d = parseInt(window.getComputedStyle(this).getPropertyValue("padding-bottom")),
                    k = a.innerHeight(),
                    l = a.innerWidth(),
                    j = 0;
                a.attr("data-height-width-ratio") !== void 0 && (j = a.attr("data-height-width-ratio"));
                a.css("height", Math.max(l * j, k) - (b + d));
                f = a.closest(".popup_anchor");
                h = c(f.children()[0]);
                h.css("position") != "fixed" && f.height(h.outerHeight())
            })
        },
        _syncCompositionTriggerHeights: function (b) {
            var d = b._findWidgetElements("." + b.options.slideLinkClassName),
                b = b._findWidgetElements("." + b.options.slideLinksClassName),
                a, f, h;
            d.each(function () {
                a = c(this);
                a.css("height", "");
                a.css("height", parseInt(window.getComputedStyle(this).getPropertyValue("height")));
                f = a.closest(".popup_anchor");
                a.attr("data-iscompressed") ? (h = c("#" + c(this).attr("id").substr(1))) && f.height(h.innerHeight()) : (h = c(f.children()[0]), h.css("position") !== "fixed" && f.height(h.outerHeight()))
            });
            b.each(function () {
                a = c(this);
                a.css("height", "");
                a.css("height", parseInt(window.getComputedStyle(this).getPropertyValue("height")))
            })
        },
        _syncLightBoxPartHeights: function (b) {
            var d =
                b._findWidgetElements("." + b.options.captionClassName),
                b = b._findWidgetElements(b.options.lightboxPartsSelector),
                a = 0,
                f, h;
            d.length && (d.each(function () {
                c(this).css("height", "");
                a = Math.max(a, c(this).outerHeight())
            }), d.parent().css("height", a + "px"));
            b.each(function () {
                f = c(this).closest(".popup_anchor");
                h = c(f.children()[0]);
                h.css("position") != "fixed" && f.height(h.outerHeight())
            })
        },
        _transformMarkup: function (b) {
            var d = b.options,
                a = b._findWidgetElements("." + d.viewClassName),
                f = b._findWidgetElements("." + d.slideLinkClassName),
                h = b._findWidgetElements(d.lightboxPartsSelector);
            $element = a;
            isLightbox = d.contentLayout_runtime === "lightbox";
            if (b.$element && b.$element.hasClass("PamphletWidget") && b.$element.hasClass("allow_click_through")) {
                if (!isLightbox)
                    for (; $element && $element.length && !$element.hasClass("PamphletWidget");) $element.css("pointer-events", "none"), $element = $element.parent();
                if (f)
                    for (var g = 0; g < f.length; g++)
                        for ($element = c(f[g]).parent(); $element && $element.length && !$element.hasClass("PamphletWidget");) $element.css("pointer-events",
                            "none"), $element = $element.parent();
                if (!isLightbox && h)
                    for (g = 0; g < h.length; g++)
                        for ($element = c(h[g]).parent(); $element && $element.length && !$element.hasClass("PamphletWidget");) $element.css("pointer-events", "none"), $element = $element.parent()
            }
            Muse.Utils.addWidgetIDToImages(b.$element, b.$element.attr("id"));
            d.transitionStyle !== "fading" ? (d.isResponsive && (Muse.Utils.moveElementsOutsideViewport(b.$element.parents()), Muse.Utils.moveElementsOutsideViewport(a.children()), Muse.Utils.resizeImages(b.$element, b.$element.attr("id")),
                Muse.Utils.moveElementsInsideViewport(a.children()), Muse.Utils.moveElementsInsideViewport(b.$element.parents())), f = !d.elastic && d.isResponsive && d.contentLayout_runtime == "lightbox", h = this._updateClipElement(b), a.css({
                position: "relative",
                top: f ? "" : "0",
                left: f ? "" : "0",
                margin: f ? "" : "0",
                overflow: "hidden"
            }), a.has("form").find("[data-type=recaptcha2]").length ? (h.insertBefore(a), h[0].appendChild(a[0])) : a.wrap(h), b.$clipElement = a.parent(), this._updateClipElement(b)) : d.isResponsive || (b = a.css("position"), d.elastic !==
                "fullScreen" && b !== "fixed" && a.css({
                    width: "0",
                    height: "0"
                }));
            d && d.elastic === "fullWidth" && (a && a.parent().hasClass("popup_anchor") && a.parent().css("width", "0px"), d.transitionStyle !== "fading" && a && (d = a.closest(".popup_anchor")) && d.css("width", "0px"))
        },
        _scopedFind: function (b, c) {
            return WebPro.findInWidgetScope(b, c)
        },
        _setMinWidthForComposition: function (b, d) {
            function a(a) {
                a > 0 && (q = Math.max(q, a))
            }

            function f(a, b) {
                a > 0 && b.css("min-width", a)
            }
            var h = b.attr("data-contentlayout"),
                g = h ? h === "lightbox" : b.attr("data-islightbox") ===
                "true",
                i = g ? c(".LightboxContent") : b,
                k = g ? "LightboxContent" : "PamphletWidget",
                l = b.attr("data-showWidgetPartsEnabled") === void 0 ? !0 : !1;
            this._scopedFind(i, ".ContainerGroup", k);
            this._scopedFind(b, ".ThumbGroup", "PamphletWidget");
            var j = this._scopedFind(i, ".PamphletPrevButton", k),
                m = this._scopedFind(i, ".PamphletNextButton", k),
                n = this._scopedFind(i, ".PamphletCloseButton", k),
                q = -1,
                p = h === "loose";
            if (!(d && Muse.Utils.getMinWidthOfElem(b) > 0)) {
                this._scopedFind(b, ".Thumb", "PamphletWidget").forEach(function (c) {
                    var g = -1;
                    d ? (g = Muse.Utils.getMinWidthOfParts(c, b), a(g, c)) : (g = Muse.Utils.getMinWidthForElement(c, d), f(g, c))
                });
                if ((!g || !d) && l) {
                    var o = -1,
                        r = -1,
                        s = [];
                    this._scopedFind(i, ".Container", k).forEach(function (c) {
                        s.push(c);
                        d ? (r = Muse.Utils.getMinWidthOfParts(c, b, !0), r > 0 && a(r, c)) : (r = Muse.Utils.getMinWidthForElement(c, d), p && r > 0 ? f(r, c) : r > 0 && (o = Math.max(o, r)))
                    });
                    !d && !p && s.forEach(function (a) {
                        o > 0 && f(o, a)
                    });
                    j && (h = -1, j = j[0], d ? (h = Muse.Utils.getMinWidthOfParts(j, b), a(h, j)) : (h = Muse.Utils.getMinWidthForElement(j, d), f(h, j)));
                    m && (j = -1,
                        m = m[0], d ? (j = Muse.Utils.getMinWidthOfParts(m, b), a(j, m)) : (j = Muse.Utils.getMinWidthForElement(m, d), f(j, m)));
                    n && (m = -1, n = n[0], d ? (m = Muse.Utils.getMinWidthOfParts(n, b), a(m, n)) : (m = Muse.Utils.getMinWidthForElement(n, d), f(m, n)))
                }
                d && q > 0 && b.css("min-width", q)
            }
        },
        _setMinWidthForSlideShow: function (b, d) {
            function a(a) {
                s = Math.max(s, a)
            }

            function f(a, b) {
                a > 0 && b.css("min-width", a)
            }
            var h = b.attr("data-contentlayout") === "lightbox",
                g = h ? c(".LightboxContent") : b,
                i = h ? "LightboxContent" : "SlideShowWidget",
                k = this._scopedFind(g, ".SlideShowContentPanel",
                    i),
                l = this._scopedFind(b, ".SSSlideLinks", "SlideShowWidget"),
                j = ".SSSlideLink",
                m = this._scopedFind(g, ".SlideShowCaptionPanel", i),
                n = this._scopedFind(g, ".SSPreviousButton", i),
                q = this._scopedFind(g, ".SSNextButton", i),
                p = this._scopedFind(g, ".SSSlideCount", i),
                o = this._scopedFind(g, ".SSFirstButton", i),
                r = this._scopedFind(g, ".SSLastButton", i),
                j = ".SSSlideLink",
                s = -1;
            if (!(d && Muse.Utils.getMinWidthOfElem(b) > 0)) {
                var w = -1;
                Muse.Utils.isElementFixedSize(l[0]) ? (l = l[0], d ? (w = Muse.Utils.getMinWidthOfParts(l, b), a(w, l)) : (w = Muse.Utils.getMinWidthForElement(l,
                    d), f(w, l))) : d && this._scopedFind(b, j, "SlideShowWidget").forEach(function (c) {
                    var d = -1,
                        d = Muse.Utils.getMinWidthOfParts(c, b);
                    a(d, c)
                });
                if (!h || !d) {
                    var y = 0,
                        u = 0;
                    this._scopedFind(g, ".SSSlide", i).forEach(function (c) {
                        d ? (y = Muse.Utils.getMinWidthOfParts(c, b, !0), y > 0 && a(y, c)) : (y = Muse.Utils.getMinWidthForElement(c, d), y > 0 && (u = Math.max(u, y)))
                    });
                    d || f(u, k[0]);
                    m && (h = -1, m = m[0], d ? (h = Muse.Utils.getMinWidthOfParts(m, b), a(h, m)) : (h = Muse.Utils.getMinWidthForElement(m, d), f(h, m)));
                    n && (m = -1, n = n[0], d ? (m = Muse.Utils.getMinWidthOfParts(n,
                        b), a(m, n)) : (m = Muse.Utils.getMinWidthForElement(n, d), f(m, n)));
                    q && (n = -1, q = q[0], d ? (n = Muse.Utils.getMinWidthOfParts(q, b), a(n, q)) : (n = Muse.Utils.getMinWidthForElement(q, d), f(n, q)));
                    p && (q = -1, p = p[0], d ? (q = Muse.Utils.getMinWidthOfParts(p, b), a(q, p)) : (q = Muse.Utils.getMinWidthForElement(p, d), f(q, p)));
                    o && (p = -1, o = o[0], d ? (p = Muse.Utils.getMinWidthOfParts(o, b), a(p, o)) : (p = Muse.Utils.getMinWidthForElement(o, d), f(p, o)));
                    r && (o = -1, r = r[0], d ? (o = Muse.Utils.getMinWidthOfParts(r, b), a(o, r)) : (o = Muse.Utils.getMinWidthForElement(r,
                        d), f(o, r)))
                }
                d && s > 0 && b.css("min-width", s)
            }
        },
        _setMinWidth: function (b, c) {
            var a = b.attr("data-sizePolicy"),
                f = b.hasClass("SlideShowWidget"),
                h = b.hasClass("PamphletWidget");
            if (c || a !== "fixed") h ? this._setMinWidthForComposition(b, c) : f && this._setMinWidthForSlideShow(b, c)
        },
        _onResize: function (b) {
            function d(a, b) {
                for (var c = 1; c < b.length; ++c) {
                    b[c].style.display = "block";
                    var d = b[c].getBoundingClientRect();
                    if (d.left < a.left) a.left = d.left;
                    if (d.right > a.right) a.right = d.right;
                    if (d.top < a.top) a.top = d.top;
                    if (d.bottom > a.bottom) a.bottom =
                        d.bottom
                }
            }
            var a = b.data.plugin,
                f = b.data.slideshow,
                b = b.data.isLightbox,
                h = f.options;
            Muse.Utils.moveElementsOutsideViewport(f.$element.parents());
            h.isResponsive && (a._syncTargetHeights(f), f.$element.hasClass("PamphletWidget") ? a._syncCompositionTriggerHeights(f) : a._syncSlideShowTriggerHeights(f), a._syncLightBoxPartHeights(f));
            h.transitionStyle !== "fading" && a._updateClipElement(f, !0);
            var g = f.tabs,
                i = f.slides.$element;
            if (g && i) {
                g.$element[0].style.display = "block";
                var k = g.$element[0].getBoundingClientRect(),
                    l = {};
                l.left = k.left;
                l.right = k.right;
                l.top = k.top;
                l.bottom = k.bottom;
                d(l, g.$element);
                var j = [];
                for (index = 0; index < i.length; index++) j[index] = i[index].style.display;
                c(i[0]).css("display", "block");
                var k = i[0].getBoundingClientRect(),
                    m = {};
                m.left = k.left;
                m.right = k.right;
                m.top = k.top;
                m.bottom = k.bottom;
                d(m, i);
                f.overlap = !(m.right < l.left || m.left > l.right || m.bottom < l.top || m.top > l.bottom);
                for (index = 0; index < g.$element.length; ++index) g.$element[index].style.display = "";
                for (index = 0; index < i.length; ++index) c(i[index]).css("display",
                    ""), j[index] != c(i[index]).css("display") && c(i[index]).css("display", j[index])
            }
            Muse.Utils.moveElementsInsideViewport(f.$element.parents());
            !b && h.elastic !== "off" && a._resizeFullScreenImages(f, f.slides.$element, h.heroFitting);
            Muse.Utils.updateSlideshow_fstpOffsetSize(f);
            if ((h.elastic === "fullScreen" || h.elastic === "fullWidth") && h.transitionStyle !== "fading") a = function () {
                f._fstpPositionSlides()
            }, window.requestIdleCallback && window.requestIdleCallback(a, {
                timeout: 1E3
            }), window.setTimeout(a, 50)
        },
        _attachBehavior: function (b) {
            var d =
                this,
                a = b.options,
                f = b.tabs,
                h = b.slides.$element,
                g = a.slideLinkActiveClassName,
                i = a.contentLayout_runtime === "lightbox";
            a.elastic !== "off" && d._resizeFullScreenImages(b, b.slides.$element, a.heroFitting);
            var k = {
                plugin: d,
                slideshow: b,
                isLightbox: i
            };
            c(window).on("pageWidthChanged", k, d._onResize);
            b.$element.attr("data-contentlayout", a.contentLayout_runtime);
            b.$element.attr("data-transitionStyle", a.transitionStyle);
            a.isResponsive && (Muse.Utils.setPageToMaxWidth(), d._setMinWidth(b.$element, !1), Muse.Utils.resetPageWidth());
            c(window).on("orientationchange resize", k, d._onResize);
            d._onResize({
                data: k
            });
            if (b.$element.attr("data-inside-lightbox") === "true" || Muse.Utils.widgetInsideLightbox(b.$element.parents(".PamphletWidget"))) b.$element.attr("data-inside-lightbox", "true"), c(window).on("lightboxresize", k, d._onResize);
            b.$element.attr("data-visibility") == "changed" && (b.$element.css("visibility", ""), b.$element.removeAttr("data-visibility"));
            if (i && !a.autoActivate_runtime) a.hideAllContentsFirst = !0;
            if (f) {
                var l = f.$element;
                a.event ===
                    "mouseover" && l.bind("mouseenter", function () {
                        var a = c(this);
                        a.data("enter", !0);
                        f.selectTab(l.index(a))
                    });
                var j = function () {
                        var a = c(this),
                            d = h.index(a),
                            f = l.eq(d);
                        a.data("enter", !1);
                        f.data("setTimeout") || (f.data("setTimeout", !0), setTimeout(function () {
                            !a.data("enter") && !f.data("enter") && b.slides.hidePanel(d);
                            f.data("setTimeout", !1)
                        }, 300))
                    },
                    k = function () {
                        var a = c(this),
                            d = l.index(a),
                            f = h.eq(d);
                        a.data("enter", !1);
                        a.data("setTimeout") || (a.data("setTimeout", !0), setTimeout(function () {
                            !f.data("enter") && !a.data("enter") &&
                                b.slides.hidePanel(d);
                            a.data("setTimeout", !1)
                        }, 300))
                    };
                a.deactivationEvent === "mouseout_trigger" ? (l.bind("mouseleave", function () {
                    if (a.triggersOnTop === !0 || b.overlap === !1) {
                        var d = c(this);
                        d.data("enter", !1);
                        b.slides.hidePanel(l.index(d))
                    } else if (b.overlap === !0) {
                        var d = c(this),
                            f = l.index(d),
                            g = h.eq(f);
                        d.data("enter", !1);
                        d.data("setTimeout") || (d.data("setTimeout", !0), setTimeout(function () {
                            !g.data("enter") && !d.data("enter") && b.slides.hidePanel(f);
                            d.data("setTimeout", !1)
                        }, 300));
                        h.bind("mouseenter", function () {
                            c(this).data("enter",
                                !0)
                        });
                        l.bind("mouseenter", function () {
                            c(this).data("enter", !0)
                        });
                        h.bind("mouseleave", j)
                    }
                }), b.overlap === !0 && a.triggersOnTop === !1 && h.bind("mouseleave", j)) : a.deactivationEvent === "mouseout_both" && (l.bind("mouseleave", k), h.bind("mouseenter", function () {
                    c(this).data("enter", !0)
                }), l.bind("mouseenter", function () {
                    c(this).data("enter", !0)
                }), h.bind("mouseleave", j))
            }
            f && g && (a.hideAllContentsFirst || f.$element.each(function (a) {
                a == b.slides.activeIndex ? c(this).addClass(g) : c(this).removeClass(g)
            }), b._findWidgetElements("a." +
                g).each(function () {
                c(this).data("default-active", !0)
            }), b.slides.bind("wp-panel-show", function (a, b) {
                f.$element.eq(b.panelIndex).addClass(g)
            }).bind("wp-panel-hide", function (a, b) {
                var c = f.$element.eq(b.panelIndex);
                c.data("default-active") || c.removeClass(g)
            }));
            d._attachStopOnClickHandler(b, b.$firstBtn);
            d._attachStopOnClickHandler(b, b.$lastBtn);
            d._attachStopOnClickHandler(b, b.$previousBtn);
            d._attachStopOnClickHandler(b, b.$nextBtn);
            d._attachStopOnClickHandler(b, b.$playBtn);
            d._attachStopOnClickHandler(b,
                b.$stopBtn);
            d._attachStopOnClickHandler(b, b.$closeBtn);
            f && !i && d._attachStopOnClickHandler(b, f.$element);
            b._csspIsImageSlideShow || (b.slides.bind("wp-panel-hide", function (a, b) {
                Muse.Utils.detachIframesAndObjectsToPauseMedia(c(b.panel))
            }).bind("wp-panel-show", function (a, d) {
                setTimeout(function () {
                    Muse.Utils.attachIframesAndObjectsToResumeMedia(c(d.panel))
                }, b.options.transitionDuration)
            }), h.each(function () {
                this != b.slides.activeElement || a.hideAllContentsFirst ? Muse.Utils.detachIframesAndObjectsToPauseMedia(c(this)) :
                    Muse.Utils.attachIframesAndObjectsToResumeMedia(c(this))
            }));
            b.bind("wp-swiped", function () {
                (b.options.autoPlay || b._sslbpAutoPlay) && b.options.resumeAutoplay && 0 < b.options.resumeAutoplayInterval && d._startRestartTimer(b)
            })
        },
        _startRestartTimer: function (b) {
            this._stopRestartTimer(b);
            b._restartTimer = setTimeout(function () {
                b.play(!0)
            }, b.options.resumeAutoplayInterval + b.options.transitionDuration)
        },
        _stopRestartTimer: function (b) {
            b._restartTimer && clearTimeout(b._restartTimer);
            b._restartTimer = 0
        },
        _attachStopOnClickHandler: function (b,
            d) {
            var a = this;
            d.bind(b.options.event === "click" ? "click" : "mouseover", function () {
                b.stop();
                if ((b.options.autoPlay || b._sslbpAutoPlay) && b.options.resumeAutoplay && 0 < b.options.resumeAutoplayInterval) c(this).hasClass(b.options.closeBtnClassName) ? a._stopRestartTimer(b) : a._startRestartTimer(b)
            })
        },
        _closeLightbox: function (b) {
            b = b._$sslbpOverlay;
            b.data("museOverlay").isOpen && b.museOverlay("close")
        },
        _hitTest: function (b, c) {
            c.outerWidth() === 0 && (c = c.children(".popup_anchor").children(".popup_element").eq(0));
            var a =
                c.offset(),
                a = {
                    x: a.left,
                    y: a.top,
                    width: c.outerWidth(),
                    height: c.outerHeight()
                };
            return b.pageX >= a.x && b.pageX <= a.x + a.width && b.pageY >= a.y && b.pageY <= a.y + a.height
        },
        _layoutThumbs: function (b) {
            var d = b.options,
                a = Muse.Utils.getStyleValue;
            b._findWidgetElements("." + d.slideLinksClassName).each(function () {
                var b = c(this).find("." + d.slideLinkClassName);
                firstThumb = b[0];
                tWidth = a(firstThumb, "width");
                tHeight = a(firstThumb, "height");
                gapH = a(firstThumb, "margin-right");
                gapV = a(firstThumb, "margin-bottom");
                borderL = a(firstThumb,
                    "border-left-width");
                borderR = a(firstThumb, "border-right-width");
                borderT = a(firstThumb, "border-top-width");
                borderB = a(firstThumb, "border-bottom-width");
                gWidth = a(this, "width");
                paddingL = a(this, "padding-left");
                paddingT = a(this, "padding-top");
                maxNumThumb = Math.floor((gWidth + gapH) / (tWidth + borderL + borderR + gapH));
                gStyle = this.runtimeStyle ? this.runtimeStyle : this.style;
                numRow = Math.ceil(b.length / maxNumThumb);
                firstRowNum = b.length < maxNumThumb ? b.length : maxNumThumb;
                leftPos = leftMostPos = Muse.Utils.pixelRound((gWidth - (tWidth +
                    borderL + borderR) * firstRowNum - gapH * (firstRowNum - 1)) / 2) + paddingL;
                topPos = paddingT;
                numInRow = 1;
                gStyle.height = (tHeight + borderT + borderB) * numRow + gapV * (numRow - 1) + "px";
                b.each(function () {
                    numInRow > firstRowNum && (numInRow = 1, leftPos = leftMostPos, topPos += tHeight + borderT + borderB + gapV);
                    numInRow++ > 1 && (leftPos += tWidth + borderL + borderR + gapH);
                    var a = this.runtimeStyle ? this.runtimeStyle : this.style;
                    a.marginRight = "0px";
                    a.marginBottom = "0px";
                    a.left = leftPos + "px";
                    a.top = topPos + "px"
                })
            })
        },
        _resizeFullScreenImages: function (b, d, a) {
            d.each(function () {
                c(this).find("img").each(function () {
                    this.complete &&
                        !c(this).hasClass(b.options.imageIncludeClassName) && b._csspPositionImage(this, a, b.options.elastic)
                })
            })
        },
        _setupImagePositioning: function (b, d, a, f) {
            var h = this;
            d.each(function () {
                c(this).find("img").each(function () {
                    var b = this;
                    b.complete ? h._positionImage(b, a, f) : c(b).load(function () {
                        h._positionImage(b, a, f)
                    })
                })
            })
        },
        _positionImage: function (b, d, a, f, h) {
            var g = c(window),
                i = b.runtimeStyle ? b.runtimeStyle : b.style,
                k = a === "fullWidth" || a === "fullScreen",
                l = a === "fullHeight" || a === "fullScreen",
                j = d == "fitContentProportionally";
            $img = c(b);
            k = k ? window.innerWidth ? window.innerWidth : g.width() : j ? $img.data("width") : $img.parent().parent().hasClass("rounded-corners") && $img.parent().parent().hasClass("SSSlide") && $img.parent().hasClass("clip_frame") ? $img.parent().parent().closest(":not(.bc_ch_wrapper)").width() : $img.parent().closest(":not(.bc_ch_wrapper)").width();
            g = l ? window.innerHeight ? window.innerHeight : g.height() : j ? $img.data("height") : $img.parent().parent().hasClass("rounded-corners") && $img.parent().parent().hasClass("SSSlide") &&
                $img.parent().hasClass("clip_frame") ? $img.parent().parent().closest(":not(.bc_ch_wrapper)").height() : $img.parent().closest(":not(.bc_ch_wrapper)").height();
            f = f !== void 0 ? f : Muse.Utils.getNaturalWidth(b);
            b = h !== void 0 ? h : Muse.Utils.getNaturalHeight(b);
            a !== "off" && (f === 0 && (f = $img.data("imageWidth")), b === 0 && (b = $img.data("imageHeight")));
            if (k == f && g == b) i.marginTop = "0px", i.marginLeft = "0px";
            else {
                l = f;
                h = b;
                if (d == "fillFrameProportionally") {
                    if (a !== "off" || f > k && b > g) d = f / k, a = b / g, d < a ? (h = b / d, l = k) : (h = g, l = f / a)
                } else if (d ==
                    "fitContentProportionally" && (a !== "off" || f > k || b > g)) d = f / k, a = b / g, d > a ? (h = b / d, l = f / d) : (h = b / a, l = f / a);
                i.width = Muse.Utils.pixelRound(l) + "px";
                i.height = Muse.Utils.pixelRound(h) + "px";
                i.marginTop = Muse.Utils.pixelRound((g - h) / 2) + "px";
                i.marginLeft = Muse.Utils.pixelRound((k - l) / 2) + "px"
            }
        }
    };
    c.extend(WebPro.Widget.ContentSlideShow.slideImageIncludePlugin.defaultOptions, {
        imageIncludeClassName: "ImageInclude",
        slideLoadingClassName: "SSSlideLoading"
    });
    WebPro.Widget.ContentSlideShow.prototype.defaultPlugins = [Muse.Plugins.ContentSlideShow];
    WebPro.Widget.ContentSlideShow.prototype._getAjaxSrcForImage = function (b) {
        for (var d = c(window).data("ResolutionManager").getDataSrcAttrName(), a = d.length, f, h = 0; h < a; h++)
            if ((f = b.data(d[h])) && f.length) return f;
        return b.data("src")
    }
});;
(function () {
    if (!("undefined" == typeof Muse || "undefined" == typeof Muse.assets)) {
        var c = function (a, b) {
            for (var c = 0, d = a.length; c < d; c++)
                if (a[c] == b) return c;
            return -1
        }(Muse.assets.required, "musewpslideshow.js");
        if (-1 != c) {
            Muse.assets.required.splice(c, 1);
            for (var c = document.getElementsByTagName("meta"), b = 0, d = c.length; b < d; b++) {
                var a = c[b];
                if ("generator" == a.getAttribute("name")) {
                    "2018.1.0.386" != a.getAttribute("content") && Muse.assets.outOfDate.push("musewpslideshow.js");
                    break
                }
            }
        }
    }
})();
