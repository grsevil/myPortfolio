! function(a, b, c, d) {
	function e(b, c) {
		this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this.drag = a.extend({}, m), this.state = a.extend({}, n), this.e = a.extend({}, o), this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._invalidated = {}, this._pipe = [], a.each(e.Plugins, a.proxy(function(a, b) {
			this._plugins[a[0].toLowerCase() + a.slice(1)] = new b(this)
		}, this)), a.each(e.Pipe, a.proxy(function(b, c) {
			this._pipe.push({
				filter: c.filter,
				run: a.proxy(c.run, this)
			})
		}, this)), this.setup(), this.initialize()
	}

	function f(a) {
		if (a.touches !== d) return {
			x: a.touches[0].pageX,
			y: a.touches[0].pageY
		};
		if (a.touches === d) {
			if (a.pageX !== d) return {
				x: a.pageX,
				y: a.pageY
			};
			if (a.pageX === d) return {
				x: a.clientX,
				y: a.clientY
			}
		}
	}

	function g(a) {
		var b, d, e = c.createElement("div"),
			f = a;
		for (b in f)
			if (d = f[b], "undefined" != typeof e.style[d]) return e = null, [d, b];
		return [!1]
	}

	function h() {
		return g(["transition", "WebkitTransition", "MozTransition", "OTransition"])[1]
	}

	function i() {
		return g(["transform", "WebkitTransform", "MozTransform", "OTransform", "msTransform"])[0]
	}

	function j() {
		return g(["perspective", "webkitPerspective", "MozPerspective", "OPerspective", "MsPerspective"])[0]
	}

	function k() {
		return "ontouchstart" in b || !!navigator.msMaxTouchPoints
	}

	function l() {
		return b.navigator.msPointerEnabled
	}
	var m, n, o;
	m = {
		start: 0,
		startX: 0,
		startY: 0,
		current: 0,
		currentX: 0,
		currentY: 0,
		offsetX: 0,
		offsetY: 0,
		distance: null,
		startTime: 0,
		endTime: 0,
		updatedX: 0,
		targetEl: null
	}, n = {
		isTouch: !1,
		isScrolling: !1,
		isSwiping: !1,
		direction: !1,
		inMotion: !1
	}, o = {
		_onDragStart: null,
		_onDragMove: null,
		_onDragEnd: null,
		_transitionEnd: null,
		_resizer: null,
		_responsiveCall: null,
		_goToLoop: null,
		_checkVisibile: null
	}, e.Defaults = {
		items: 3,
		loop: !1,
		center: !1,
		mouseDrag: !0,
		touchDrag: !0,
		pullDrag: !0,
		freeDrag: !1,
		margin: 0,
		stagePadding: 0,
		merge: !1,
		mergeFit: !0,
		autoWidth: !1,
		startPosition: 0,
		rtl: !1,
		smartSpeed: 250,
		fluidSpeed: !1,
		dragEndSpeed: !1,
		responsive: {},
		responsiveRefreshRate: 200,
		responsiveBaseElement: b,
		responsiveClass: !1,
		fallbackEasing: "swing",
		info: !1,
		nestedItemSelector: !1,
		itemElement: "div",
		stageElement: "div",
		themeClass: "owl-theme",
		baseClass: "owl-carousel",
		itemClass: "owl-item",
		centerClass: "center",
		activeClass: "active"
	}, e.Width = {
		Default: "default",
		Inner: "inner",
		Outer: "outer"
	}, e.Plugins = {}, e.Pipe = [{
		filter: ["width", "items", "settings"],
		run: function(a) {
			a.current = this._items && this._items[this.relative(this._current)]
		}
	}, {
		filter: ["items", "settings"],
		run: function() {
			var a = this._clones,
				b = this.$stage.children(".cloned");
			(b.length !== a.length || !this.settings.loop && a.length > 0) && (this.$stage.children(".cloned").remove(), this._clones = [])
		}
	}, {
		filter: ["items", "settings"],
		run: function() {
			var a, b, c = this._clones,
				d = this._items,
				e = this.settings.loop ? c.length - Math.max(2 * this.settings.items, 4) : 0;
			for (a = 0, b = Math.abs(e / 2); b > a; a++) e > 0 ? (this.$stage.children().eq(d.length + c.length - 1).remove(), c.pop(), this.$stage.children().eq(0).remove(), c.pop()) : (c.push(c.length / 2), this.$stage.append(d[c[c.length - 1]].clone().addClass("cloned")), c.push(d.length - 1 - (c.length - 1) / 2), this.$stage.prepend(d[c[c.length - 1]].clone().addClass("cloned")))
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function() {
			var a, b, c, d = this.settings.rtl ? 1 : -1,
				e = (this.width() / this.settings.items).toFixed(3),
				f = 0;
			for (this._coordinates = [], b = 0, c = this._clones.length + this._items.length; c > b; b++) a = this._mergers[this.relative(b)], a = this.settings.mergeFit && Math.min(a, this.settings.items) || a, f += (this.settings.autoWidth ? this._items[this.relative(b)].width() + this.settings.margin : e * a) * d, this._coordinates.push(f)
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function() {
			var b, c, d = (this.width() / this.settings.items).toFixed(3),
				e = {
					width: Math.abs(this._coordinates[this._coordinates.length - 1]) + 2 * this.settings.stagePadding,
					"padding-left": this.settings.stagePadding || "",
					"padding-right": this.settings.stagePadding || ""
				};
			if (this.$stage.css(e), e = {
					width: this.settings.autoWidth ? "auto" : d - this.settings.margin
				}, e[this.settings.rtl ? "margin-left" : "margin-right"] = this.settings.margin, !this.settings.autoWidth && a.grep(this._mergers, function(a) {
					return a > 1
				}).length > 0)
				for (b = 0, c = this._coordinates.length; c > b; b++) e.width = Math.abs(this._coordinates[b]) - Math.abs(this._coordinates[b - 1] || 0) - this.settings.margin, this.$stage.children().eq(b).css(e);
			else this.$stage.children().css(e)
		}
	}, {
		filter: ["width", "items", "settings"],
		run: function(a) {
			a.current && this.reset(this.$stage.children().index(a.current))
		}
	}, {
		filter: ["position"],
		run: function() {
			this.animate(this.coordinates(this._current))
		}
	}, {
		filter: ["width", "position", "items", "settings"],
		run: function() {
			var a, b, c, d, e = this.settings.rtl ? 1 : -1,
				f = 2 * this.settings.stagePadding,
				g = this.coordinates(this.current()) + f,
				h = g + this.width() * e,
				i = [];
			for (c = 0, d = this._coordinates.length; d > c; c++) a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
			this.$stage.children("." + this.settings.activeClass).removeClass(this.settings.activeClass), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass(this.settings.activeClass), this.settings.center && (this.$stage.children("." + this.settings.centerClass).removeClass(this.settings.centerClass), this.$stage.children().eq(this.current()).addClass(this.settings.centerClass))
		}
	}], e.prototype.initialize = function() {
		if (this.trigger("initialize"), this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl", this.settings.rtl), this.browserSupport(), this.settings.autoWidth && this.state.imagesLoaded !== !0) {
			var b, c, e;
			if (b = this.$element.find("img"), c = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, e = this.$element.children(c).width(), b.length && 0 >= e) return this.preloadAutoWidthImages(b), !1
		}
		this.$element.addClass("owl-loading"), this.$stage = a("<" + this.settings.stageElement + ' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'), this.$element.append(this.$stage.parent()), this.replace(this.$element.children().not(this.$stage.parent())), this._width = this.$element.width(), this.refresh(), this.$element.removeClass("owl-loading").addClass("owl-loaded"), this.eventsCall(), this.internalEvents(), this.addTriggerableEvents(), this.trigger("initialized")
	}, e.prototype.setup = function() {
		var b = this.viewport(),
			c = this.options.responsive,
			d = -1,
			e = null;
		c ? (a.each(c, function(a) {
			b >= a && a > d && (d = Number(a))
		}), e = a.extend({}, this.options, c[d]), delete e.responsive, e.responsiveClass && this.$element.attr("class", function(a, b) {
			return b.replace(/\b owl-responsive-\S+/g, "")
		}).addClass("owl-responsive-" + d)) : e = a.extend({}, this.options), (null === this.settings || this._breakpoint !== d) && (this.trigger("change", {
			property: {
				name: "settings",
				value: e
			}
		}), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {
			property: {
				name: "settings",
				value: this.settings
			}
		}))
	}, e.prototype.optionsLogic = function() {
		this.$element.toggleClass("owl-center", this.settings.center), this.settings.loop && this._items.length < this.settings.items && (this.settings.loop = !1), this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
	}, e.prototype.prepare = function(b) {
		var c = this.trigger("prepare", {
			content: b
		});
		return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.settings.itemClass).append(b)), this.trigger("prepared", {
			content: c.data
		}), c.data
	}, e.prototype.update = function() {
		for (var b = 0, c = this._pipe.length, d = a.proxy(function(a) {
				return this[a]
			}, this._invalidated), e = {}; c > b;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
		this._invalidated = {}
	}, e.prototype.width = function(a) {
		switch (a = a || e.Width.Default) {
			case e.Width.Inner:
			case e.Width.Outer:
				return this._width;
			default:
				return this._width - 2 * this.settings.stagePadding + this.settings.margin
		}
	}, e.prototype.refresh = function() {
		if (0 === this._items.length) return !1;
		(new Date).getTime();
		this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$stage.addClass("owl-refresh"), this.update(), this.$stage.removeClass("owl-refresh"), this.state.orientation = b.orientation, this.watchVisibility(), this.trigger("refreshed")
	}, e.prototype.eventsCall = function() {
		this.e._onDragStart = a.proxy(function(a) {
			this.onDragStart(a)
		}, this), this.e._onDragMove = a.proxy(function(a) {
			this.onDragMove(a)
		}, this), this.e._onDragEnd = a.proxy(function(a) {
			this.onDragEnd(a)
		}, this), this.e._onResize = a.proxy(function(a) {
			this.onResize(a)
		}, this), this.e._transitionEnd = a.proxy(function(a) {
			this.transitionEnd(a)
		}, this), this.e._preventClick = a.proxy(function(a) {
			this.preventClick(a)
		}, this)
	}, e.prototype.onThrottledResize = function() {
		b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this.e._onResize, this.settings.responsiveRefreshRate)
	}, e.prototype.onResize = function() {
		return this._items.length ? this._width === this.$element.width() ? !1 : this.trigger("resize").isDefaultPrevented() ? !1 : (this._width = this.$element.width(), this.invalidate("width"), this.refresh(), void this.trigger("resized")) : !1
	}, e.prototype.eventsRouter = function(a) {
		var b = a.type;
		"mousedown" === b || "touchstart" === b ? this.onDragStart(a) : "mousemove" === b || "touchmove" === b ? this.onDragMove(a) : "mouseup" === b || "touchend" === b ? this.onDragEnd(a) : "touchcancel" === b && this.onDragEnd(a)
	}, e.prototype.internalEvents = function() {
		var c = (k(), l());
		this.settings.mouseDrag ? (this.$stage.on("mousedown", a.proxy(function(a) {
			this.eventsRouter(a)
		}, this)), this.$stage.on("dragstart", function() {
			return !1
		}), this.$stage.get(0).onselectstart = function() {
			return !1
		}) : this.$element.addClass("owl-text-select-on"), this.settings.touchDrag && !c && this.$stage.on("touchstart touchcancel", a.proxy(function(a) {
			this.eventsRouter(a)
		}, this)), this.transitionEndVendor && this.on(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd, !1), this.settings.responsive !== !1 && this.on(b, "resize", a.proxy(this.onThrottledResize, this))
	}, e.prototype.onDragStart = function(d) {
		var e, g, h, i;
		if (e = d.originalEvent || d || b.event, 3 === e.which || this.state.isTouch) return !1;
		if ("mousedown" === e.type && this.$stage.addClass("owl-grab"), this.trigger("drag"), this.drag.startTime = (new Date).getTime(), this.speed(0), this.state.isTouch = !0, this.state.isScrolling = !1, this.state.isSwiping = !1, this.drag.distance = 0, g = f(e).x, h = f(e).y, this.drag.offsetX = this.$stage.position().left, this.drag.offsetY = this.$stage.position().top, this.settings.rtl && (this.drag.offsetX = this.$stage.position().left + this.$stage.width() - this.width() + this.settings.margin), this.state.inMotion && this.support3d) i = this.getTransformProperty(), this.drag.offsetX = i, this.animate(i), this.state.inMotion = !0;
		else if (this.state.inMotion && !this.support3d) return this.state.inMotion = !1, !1;
		this.drag.startX = g - this.drag.offsetX, this.drag.startY = h - this.drag.offsetY, this.drag.start = g - this.drag.startX, this.drag.targetEl = e.target || e.srcElement, this.drag.updatedX = this.drag.start, ("IMG" === this.drag.targetEl.tagName || "A" === this.drag.targetEl.tagName) && (this.drag.targetEl.draggable = !1), a(c).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents", a.proxy(function(a) {
			this.eventsRouter(a)
		}, this))
	}, e.prototype.onDragMove = function(a) {
		var c, e, g, h, i, j;
		this.state.isTouch && (this.state.isScrolling || (c = a.originalEvent || a || b.event, e = f(c).x, g = f(c).y, this.drag.currentX = e - this.drag.startX, this.drag.currentY = g - this.drag.startY, this.drag.distance = this.drag.currentX - this.drag.offsetX, this.drag.distance < 0 ? this.state.direction = this.settings.rtl ? "right" : "left" : this.drag.distance > 0 && (this.state.direction = this.settings.rtl ? "left" : "right"), this.settings.loop ? this.op(this.drag.currentX, ">", this.coordinates(this.minimum())) && "right" === this.state.direction ? this.drag.currentX -= (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length) : this.op(this.drag.currentX, "<", this.coordinates(this.maximum())) && "left" === this.state.direction && (this.drag.currentX += (this.settings.center && this.coordinates(0)) - this.coordinates(this._items.length)) : (h = this.coordinates(this.settings.rtl ? this.maximum() : this.minimum()), i = this.coordinates(this.settings.rtl ? this.minimum() : this.maximum()), j = this.settings.pullDrag ? this.drag.distance / 5 : 0, this.drag.currentX = Math.max(Math.min(this.drag.currentX, h + j), i + j)), (this.drag.distance > 8 || this.drag.distance < -8) && (c.preventDefault !== d ? c.preventDefault() : c.returnValue = !1, this.state.isSwiping = !0), this.drag.updatedX = this.drag.currentX, (this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === !1 && (this.state.isScrolling = !0, this.drag.updatedX = this.drag.start), this.animate(this.drag.updatedX)))
	}, e.prototype.onDragEnd = function(b) {
		var d, e, f;
		if (this.state.isTouch) {
			if ("mouseup" === b.type && this.$stage.removeClass("owl-grab"), this.trigger("dragged"), this.drag.targetEl.removeAttribute("draggable"), this.state.isTouch = !1, this.state.isScrolling = !1, this.state.isSwiping = !1, 0 === this.drag.distance && this.state.inMotion !== !0) return this.state.inMotion = !1, !1;
			this.drag.endTime = (new Date).getTime(), d = this.drag.endTime - this.drag.startTime, e = Math.abs(this.drag.distance), (e > 3 || d > 300) && this.removeClick(this.drag.targetEl), f = this.closest(this.drag.updatedX), this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(f), this.invalidate("position"), this.update(), this.settings.pullDrag || this.drag.updatedX !== this.coordinates(f) || this.transitionEnd(), this.drag.distance = 0, a(c).off(".owl.dragEvents")
		}
	}, e.prototype.removeClick = function(c) {
		this.drag.targetEl = c, a(c).on("click.preventClick", this.e._preventClick), b.setTimeout(function() {
			a(c).off("click.preventClick")
		}, 300)
	}, e.prototype.preventClick = function(b) {
		b.preventDefault ? b.preventDefault() : b.returnValue = !1, b.stopPropagation && b.stopPropagation(), a(b.target).off("click.preventClick")
	}, e.prototype.getTransformProperty = function() {
		var a, c;
		return a = b.getComputedStyle(this.$stage.get(0), null).getPropertyValue(this.vendorName + "transform"), a = a.replace(/matrix(3d)?\(|\)/g, "").split(","), c = 16 === a.length, c !== !0 ? a[4] : a[12]
	}, e.prototype.closest = function(b) {
		var c = -1,
			d = 30,
			e = this.width(),
			f = this.coordinates();
		return this.settings.freeDrag || a.each(f, a.proxy(function(a, g) {
			return b > g - d && g + d > b ? c = a : this.op(b, "<", g) && this.op(b, ">", f[a + 1] || g - e) && (c = "left" === this.state.direction ? a + 1 : a), -1 === c
		}, this)), this.settings.loop || (this.op(b, ">", f[this.minimum()]) ? c = b = this.minimum() : this.op(b, "<", f[this.maximum()]) && (c = b = this.maximum())), c
	}, e.prototype.animate = function(b) {
		this.trigger("translate"), this.state.inMotion = this.speed() > 0, this.support3d ? this.$stage.css({
			transform: "translate3d(" + b + "px,0px, 0px)",
			transition: this.speed() / 1e3 + "s"
		}) : this.state.isTouch ? this.$stage.css({
			left: b + "px"
		}) : this.$stage.animate({
			left: b
		}, this.speed() / 1e3, this.settings.fallbackEasing, a.proxy(function() {
			this.state.inMotion && this.transitionEnd()
		}, this))
	}, e.prototype.current = function(a) {
		if (a === d) return this._current;
		if (0 === this._items.length) return d;
		if (a = this.normalize(a), this._current !== a) {
			var b = this.trigger("change", {
				property: {
					name: "position",
					value: a
				}
			});
			b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", {
				property: {
					name: "position",
					value: this._current
				}
			})
		}
		return this._current
	}, e.prototype.invalidate = function(a) {
		this._invalidated[a] = !0
	}, e.prototype.reset = function(a) {
		a = this.normalize(a), a !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]))
	}, e.prototype.normalize = function(b, c) {
		var e = c ? this._items.length : this._items.length + this._clones.length;
		return !a.isNumeric(b) || 1 > e ? d : b = this._clones.length ? (b % e + e) % e : Math.max(this.minimum(c), Math.min(this.maximum(c), b))
	}, e.prototype.relative = function(a) {
		return a = this.normalize(a), a -= this._clones.length / 2, this.normalize(a, !0)
	}, e.prototype.maximum = function(a) {
		var b, c, d, e = 0,
			f = this.settings;
		if (a) return this._items.length - 1;
		if (!f.loop && f.center) b = this._items.length - 1;
		else if (f.loop || f.center)
			if (f.loop || f.center) b = this._items.length + f.items;
			else {
				if (!f.autoWidth && !f.merge) throw "Can not detect maximum absolute position.";
				for (revert = f.rtl ? 1 : -1, c = this.$stage.width() - this.$element.width();
					(d = this.coordinates(e)) && !(d * revert >= c);) b = ++e
			}
		else b = this._items.length - f.items;
		return b
	}, e.prototype.minimum = function(a) {
		return a ? 0 : this._clones.length / 2
	}, e.prototype.items = function(a) {
		return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a])
	}, e.prototype.mergers = function(a) {
		return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a])
	}, e.prototype.clones = function(b) {
		var c = this._clones.length / 2,
			e = c + this._items.length,
			f = function(a) {
				return a % 2 === 0 ? e + a / 2 : c - (a + 1) / 2
			};
		return b === d ? a.map(this._clones, function(a, b) {
			return f(b)
		}) : a.map(this._clones, function(a, c) {
			return a === b ? f(c) : null
		})
	}, e.prototype.speed = function(a) {
		return a !== d && (this._speed = a), this._speed
	}, e.prototype.coordinates = function(b) {
		var c = null;
		return b === d ? a.map(this._coordinates, a.proxy(function(a, b) {
			return this.coordinates(b)
		}, this)) : (this.settings.center ? (c = this._coordinates[b], c += (this.width() - c + (this._coordinates[b - 1] || 0)) / 2 * (this.settings.rtl ? -1 : 1)) : c = this._coordinates[b - 1] || 0, c)
	}, e.prototype.duration = function(a, b, c) {
		return Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed)
	}, e.prototype.to = function(c, d) {
		if (this.settings.loop) {
			var e = c - this.relative(this.current()),
				f = this.current(),
				g = this.current(),
				h = this.current() + e,
				i = 0 > g - h ? !0 : !1,
				j = this._clones.length + this._items.length;
			h < this.settings.items && i === !1 ? (f = g + this._items.length, this.reset(f)) : h >= j - this.settings.items && i === !0 && (f = g - this._items.length, this.reset(f)), b.clearTimeout(this.e._goToLoop), this.e._goToLoop = b.setTimeout(a.proxy(function() {
				this.speed(this.duration(this.current(), f + e, d)), this.current(f + e), this.update()
			}, this), 30)
		} else this.speed(this.duration(this.current(), c, d)), this.current(c), this.update()
	}, e.prototype.next = function(a) {
		a = a || !1, this.to(this.relative(this.current()) + 1, a)
	}, e.prototype.prev = function(a) {
		a = a || !1, this.to(this.relative(this.current()) - 1, a)
	}, e.prototype.transitionEnd = function(a) {
		return a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0)) ? !1 : (this.state.inMotion = !1, void this.trigger("translated"))
	}, e.prototype.viewport = function() {
		var d;
		if (this.options.responsiveBaseElement !== b) d = a(this.options.responsiveBaseElement).width();
		else if (b.innerWidth) d = b.innerWidth;
		else {
			if (!c.documentElement || !c.documentElement.clientWidth) throw "Can not detect viewport width.";
			d = c.documentElement.clientWidth
		}
		return d
	}, e.prototype.replace = function(b) {
		this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function() {
			return 1 === this.nodeType
		}).each(a.proxy(function(a, b) {
			b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)
		}, this)), this.reset(a.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
	}, e.prototype.add = function(a, b) {
		b = b === d ? this._items.length : this.normalize(b, !0), this.trigger("add", {
			content: a,
			position: b
		}), 0 === this._items.length || b === this._items.length ? (this.$stage.append(a), this._items.push(a), this._mergers.push(1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)) : (this._items[b].before(a), this._items.splice(b, 0, a), this._mergers.splice(b, 0, 1 * a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge") || 1)), this.invalidate("items"), this.trigger("added", {
			content: a,
			position: b
		})
	}, e.prototype.remove = function(a) {
		a = this.normalize(a, !0), a !== d && (this.trigger("remove", {
			content: this._items[a],
			position: a
		}), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", {
			content: null,
			position: a
		}))
	}, e.prototype.addTriggerableEvents = function() {
		var b = a.proxy(function(b, c) {
			return a.proxy(function(a) {
				a.relatedTarget !== this && (this.suppress([c]), b.apply(this, [].slice.call(arguments, 1)), this.release([c]))
			}, this)
		}, this);
		a.each({
			next: this.next,
			prev: this.prev,
			to: this.to,
			destroy: this.destroy,
			refresh: this.refresh,
			replace: this.replace,
			add: this.add,
			remove: this.remove
		}, a.proxy(function(a, c) {
			this.$element.on(a + ".owl.carousel", b(c, a + ".owl.carousel"))
		}, this))
	}, e.prototype.watchVisibility = function() {
		function c(a) {
			return a.offsetWidth > 0 && a.offsetHeight > 0
		}

		function d() {
			c(this.$element.get(0)) && (this.$element.removeClass("owl-hidden"), this.refresh(), b.clearInterval(this.e._checkVisibile))
		}
		c(this.$element.get(0)) || (this.$element.addClass("owl-hidden"), b.clearInterval(this.e._checkVisibile), this.e._checkVisibile = b.setInterval(a.proxy(d, this), 500))
	}, e.prototype.preloadAutoWidthImages = function(b) {
		var c, d, e, f;
		c = 0, d = this, b.each(function(g, h) {
			e = a(h), f = new Image, f.onload = function() {
				c++, e.attr("src", f.src), e.css("opacity", 1), c >= b.length && (d.state.imagesLoaded = !0, d.initialize())
			}, f.src = e.attr("src") || e.attr("data-src") || e.attr("data-src-retina")
		})
	}, e.prototype.destroy = function() {
		this.$element.hasClass(this.settings.themeClass) && this.$element.removeClass(this.settings.themeClass), this.settings.responsive !== !1 && a(b).off("resize.owl.carousel"), this.transitionEndVendor && this.off(this.$stage.get(0), this.transitionEndVendor, this.e._transitionEnd);
		for (var d in this._plugins) this._plugins[d].destroy();
		(this.settings.mouseDrag || this.settings.touchDrag) && (this.$stage.off("mousedown touchstart touchcancel"), a(c).off(".owl.dragEvents"), this.$stage.get(0).onselectstart = function() {}, this.$stage.off("dragstart", function() {
			return !1
		})), this.$element.off(".owl"), this.$stage.children(".cloned").remove(), this.e = null, this.$element.removeData("owlCarousel"), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.unwrap()
	}, e.prototype.op = function(a, b, c) {
		var d = this.settings.rtl;
		switch (b) {
			case "<":
				return d ? a > c : c > a;
			case ">":
				return d ? c > a : a > c;
			case ">=":
				return d ? c >= a : a >= c;
			case "<=":
				return d ? a >= c : c >= a
		}
	}, e.prototype.on = function(a, b, c, d) {
		a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
	}, e.prototype.off = function(a, b, c, d) {
		a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
	}, e.prototype.trigger = function(b, c, d) {
		var e = {
				item: {
					count: this._items.length,
					index: this.current()
				}
			},
			f = a.camelCase(a.grep(["on", b, d], function(a) {
				return a
			}).join("-").toLowerCase()),
			g = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({
				relatedTarget: this
			}, e, c));
		return this._supress[b] || (a.each(this._plugins, function(a, b) {
			b.onTrigger && b.onTrigger(g)
		}), this.$element.trigger(g), this.settings && "function" == typeof this.settings[f] && this.settings[f].apply(this, g)), g
	}, e.prototype.suppress = function(b) {
		a.each(b, a.proxy(function(a, b) {
			this._supress[b] = !0
		}, this))
	}, e.prototype.release = function(b) {
		a.each(b, a.proxy(function(a, b) {
			delete this._supress[b]
		}, this))
	}, e.prototype.browserSupport = function() {
		if (this.support3d = j(), this.support3d) {
			this.transformVendor = i();
			var a = ["transitionend", "webkitTransitionEnd", "transitionend", "oTransitionEnd"];
			this.transitionEndVendor = a[h()], this.vendorName = this.transformVendor.replace(/Transform/i, ""), this.vendorName = "" !== this.vendorName ? "-" + this.vendorName.toLowerCase() + "-" : ""
		}
		this.state.orientation = b.orientation
	}, a.fn.owlCarousel = function(b) {
		return this.each(function() {
			a(this).data("owlCarousel") || a(this).data("owlCarousel", new e(this, b))
		})
	}, a.fn.owlCarousel.Constructor = e
}(window.Zepto || window.jQuery, window, document),
function(a, b) {
	var c = function(b) {
		this._core = b, this._loaded = [], this._handlers = {
			"initialized.owl.carousel change.owl.carousel": a.proxy(function(b) {
				if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type))
					for (var c = this._core.settings, d = c.center && Math.ceil(c.items / 2) || c.items, e = c.center && -1 * d || 0, f = (b.property && b.property.value || this._core.current()) + e, g = this._core.clones().length, h = a.proxy(function(a, b) {
							this.load(b)
						}, this); e++ < d;) this.load(g / 2 + this._core.relative(f)), g && a.each(this._core.clones(this._core.relative(f++)), h)
			}, this)
		}, this._core.options = a.extend({}, c.Defaults, this._core.options), this._core.$element.on(this._handlers)
	};
	c.Defaults = {
		lazyLoad: !1
	}, c.prototype.load = function(c) {
		var d = this._core.$stage.children().eq(c),
			e = d && d.find(".owl-lazy");
		!e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function(c, d) {
			var e, f = a(d),
				g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src");
			this._core.trigger("load", {
				element: f,
				url: g
			}, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function() {
				f.css("opacity", 1), this._core.trigger("loaded", {
					element: f,
					url: g
				}, "lazy")
			}, this)).attr("src", g) : (e = new Image, e.onload = a.proxy(function() {
				f.css({
					"background-image": "url(" + g + ")",
					opacity: "1"
				}), this._core.trigger("loaded", {
					element: f,
					url: g
				}, "lazy")
			}, this), e.src = g)
		}, this)), this._loaded.push(d.get(0)))
	}, c.prototype.destroy = function() {
		var a, b;
		for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Lazy = c
}(window.Zepto || window.jQuery, window, document),
function(a) {
	var b = function(c) {
		this._core = c, this._handlers = {
			"initialized.owl.carousel": a.proxy(function() {
				this._core.settings.autoHeight && this.update()
			}, this),
			"changed.owl.carousel": a.proxy(function(a) {
				this._core.settings.autoHeight && "position" == a.property.name && this.update()
			}, this),
			"loaded.owl.lazy": a.proxy(function(a) {
				this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass) === this._core.$stage.children().eq(this._core.current()) && this.update()
			}, this)
		}, this._core.options = a.extend({}, b.Defaults, this._core.options), this._core.$element.on(this._handlers)
	};
	b.Defaults = {
		autoHeight: !1,
		autoHeightClass: "owl-height"
	}, b.prototype.update = function() {
		this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass)
	}, b.prototype.destroy = function() {
		var a, b;
		for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = b
}(window.Zepto || window.jQuery, window, document),
function(a, b, c) {
	var d = function(b) {
		this._core = b, this._videos = {}, this._playing = null, this._fullscreen = !1, this._handlers = {
			"resize.owl.carousel": a.proxy(function(a) {
				this._core.settings.video && !this.isInFullScreen() && a.preventDefault()
			}, this),
			"refresh.owl.carousel changed.owl.carousel": a.proxy(function() {
				this._playing && this.stop()
			}, this),
			"prepared.owl.carousel": a.proxy(function(b) {
				var c = a(b.content).find(".owl-video");
				c.length && (c.css("display", "none"), this.fetch(c, a(b.content)))
			}, this)
		}, this._core.options = a.extend({}, d.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function(a) {
			this.play(a)
		}, this))
	};
	d.Defaults = {
		video: !1,
		videoHeight: !1,
		videoWidth: !1
	}, d.prototype.fetch = function(a, b) {
		var c = a.attr("data-vimeo-id") ? "vimeo" : "youtube",
			d = a.attr("data-vimeo-id") || a.attr("data-youtube-id"),
			e = a.attr("data-width") || this._core.settings.videoWidth,
			f = a.attr("data-height") || this._core.settings.videoHeight,
			g = a.attr("href");
		if (!g) throw new Error("Missing video URL.");
		if (d = g.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube";
		else {
			if (!(d[3].indexOf("vimeo") > -1)) throw new Error("Video URL not supported.");
			c = "vimeo"
		}
		d = d[6], this._videos[g] = {
			type: c,
			id: d,
			width: e,
			height: f
		}, b.attr("data-video", g), this.thumbnail(a, this._videos[g])
	}, d.prototype.thumbnail = function(b, c) {
		var d, e, f, g = c.width && c.height ? 'style="width:' + c.width + "px;height:" + c.height + 'px;"' : "",
			h = b.find("img"),
			i = "src",
			j = "",
			k = this._core.settings,
			l = function(a) {
				e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? '<div class="owl-video-tn ' + j + '" ' + i + '="' + a + '"></div>' : '<div class="owl-video-tn" style="opacity:1;background-image:url(' + a + ')"></div>', b.after(d), b.after(e)
			};
		return b.wrap('<div class="owl-video-wrapper"' + g + "></div>"), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length ? (l(h.attr(i)), h.remove(), !1) : void("youtube" === c.type ? (f = "http://img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type && a.ajax({
			type: "GET",
			url: "http://vimeo.com/api/v2/video/" + c.id + ".json",
			jsonp: "callback",
			dataType: "jsonp",
			success: function(a) {
				f = a[0].thumbnail_large, l(f)
			}
		}))
	}, d.prototype.stop = function() {
		this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null
	}, d.prototype.play = function(b) {
		this._core.trigger("play", null, "video"), this._playing && this.stop();
		var c, d, e = a(b.target || b.srcElement),
			f = e.closest("." + this._core.settings.itemClass),
			g = this._videos[f.attr("data-video")],
			h = g.width || "100%",
			i = g.height || this._core.$stage.height();
		"youtube" === g.type ? c = '<iframe width="' + h + '" height="' + i + '" src="http://www.youtube.com/embed/' + g.id + "?autoplay=1&v=" + g.id + '" frameborder="0" allowfullscreen></iframe>' : "vimeo" === g.type && (c = '<iframe src="http://player.vimeo.com/video/' + g.id + '?autoplay=1" width="' + h + '" height="' + i + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'), f.addClass("owl-video-playing"), this._playing = f, d = a('<div style="height:' + i + "px; width:" + h + 'px" class="owl-video-frame">' + c + "</div>"), e.after(d)
	}, d.prototype.isInFullScreen = function() {
		var d = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
		return d && a(d).parent().hasClass("owl-video-frame") && (this._core.speed(0), this._fullscreen = !0), d && this._fullscreen && this._playing ? !1 : this._fullscreen ? (this._fullscreen = !1, !1) : this._playing && this._core.state.orientation !== b.orientation ? (this._core.state.orientation = b.orientation, !1) : !0
	}, d.prototype.destroy = function() {
		var a, b;
		this._core.$element.off("click.owl.video");
		for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Video = d
}(window.Zepto || window.jQuery, window, document),
function(a, b, c, d) {
	var e = function(b) {
		this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = {
			"change.owl.carousel": a.proxy(function(a) {
				"position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value)
			}, this),
			"drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function(a) {
				this.swapping = "translated" == a.type
			}, this),
			"translate.owl.carousel": a.proxy(function() {
				this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
			}, this)
		}, this.core.$element.on(this.handlers)
	};
	e.Defaults = {
		animateOut: !1,
		animateIn: !1
	}, e.prototype.swap = function() {
		if (1 === this.core.settings.items && this.core.support3d) {
			this.core.speed(0);
			var b, c = a.proxy(this.clear, this),
				d = this.core.$stage.children().eq(this.previous),
				e = this.core.$stage.children().eq(this.next),
				f = this.core.settings.animateIn,
				g = this.core.settings.animateOut;
			this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.css({
				left: b + "px"
			}).addClass("animated owl-animated-out").addClass(g).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c)), f && e.addClass("animated owl-animated-in").addClass(f).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", c))
		}
	}, e.prototype.clear = function(b) {
		a(b.target).css({
			left: ""
		}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.transitionEnd()
	}, e.prototype.destroy = function() {
		var a, b;
		for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
		for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document),
function(a, b, c) {
	var d = function(b) {
		this.core = b, this.core.options = a.extend({}, d.Defaults, this.core.options), this.handlers = {
			"translated.owl.carousel refreshed.owl.carousel": a.proxy(function() {
				this.autoplay()
			}, this),
			"play.owl.autoplay": a.proxy(function(a, b, c) {
				this.play(b, c)
			}, this),
			"stop.owl.autoplay": a.proxy(function() {
				this.stop()
			}, this),
			"mouseover.owl.autoplay": a.proxy(function() {
				this.core.settings.autoplayHoverPause && this.pause()
			}, this),
			"mouseleave.owl.autoplay": a.proxy(function() {
				this.core.settings.autoplayHoverPause && this.autoplay()
			}, this)
		}, this.core.$element.on(this.handlers)
	};
	d.Defaults = {
		autoplay: !1,
		autoplayTimeout: 5e3,
		autoplayHoverPause: !1,
		autoplaySpeed: !1
	}, d.prototype.autoplay = function() {
		this.core.settings.autoplay && !this.core.state.videoPlay ? (b.clearInterval(this.interval), this.interval = b.setInterval(a.proxy(function() {
			this.play()
		}, this), this.core.settings.autoplayTimeout)) : b.clearInterval(this.interval)
	}, d.prototype.play = function() {
		return c.hidden === !0 || this.core.state.isTouch || this.core.state.isScrolling || this.core.state.isSwiping || this.core.state.inMotion ? void 0 : this.core.settings.autoplay === !1 ? void b.clearInterval(this.interval) : void this.core.next(this.core.settings.autoplaySpeed)
	}, d.prototype.stop = function() {
		b.clearInterval(this.interval)
	}, d.prototype.pause = function() {
		b.clearInterval(this.interval)
	}, d.prototype.destroy = function() {
		var a, c;
		b.clearInterval(this.interval);
		for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
		for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.autoplay = d
}(window.Zepto || window.jQuery, window, document),
function(a) {
	"use strict";
	var b = function(c) {
		this._core = c, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
			next: this._core.next,
			prev: this._core.prev,
			to: this._core.to
		}, this._handlers = {
			"prepared.owl.carousel": a.proxy(function(b) {
				this._core.settings.dotsData && this._templates.push(a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
			}, this),
			"add.owl.carousel": a.proxy(function(b) {
				this._core.settings.dotsData && this._templates.splice(b.position, 0, a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))
			}, this),
			"remove.owl.carousel prepared.owl.carousel": a.proxy(function(a) {
				this._core.settings.dotsData && this._templates.splice(a.position, 1)
			}, this),
			"change.owl.carousel": a.proxy(function(a) {
				if ("position" == a.property.name && !this._core.state.revert && !this._core.settings.loop && this._core.settings.navRewind) {
					var b = this._core.current(),
						c = this._core.maximum(),
						d = this._core.minimum();
					a.data = a.property.value > c ? b >= c ? d : c : a.property.value < d ? c : a.property.value
				}
			}, this),
			"changed.owl.carousel": a.proxy(function(a) {
				"position" == a.property.name && this.draw()
			}, this),
			"refreshed.owl.carousel": a.proxy(function() {
				this._initialized || (this.initialize(), this._initialized = !0), this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation")
			}, this)
		}, this._core.options = a.extend({}, b.Defaults, this._core.options), this.$element.on(this._handlers)
	};
	b.Defaults = {
		nav: !1,
		navRewind: !0,
		navText: ["prev", "next"],
		navSpeed: !1,
		navElement: "div",
		navContainer: !1,
		navContainerClass: "owl-nav",
		navClass: ["owl-prev", "owl-next"],
		slideBy: 1,
		dotClass: "owl-dot",
		dotsClass: "owl-dots",
		dots: !0,
		dotsEach: !1,
		dotData: !1,
		dotsSpeed: !1,
		dotsContainer: !1,
		controlsClass: "owl-controls"
	}, b.prototype.initialize = function() {
		var b, c, d = this._core.settings;
		d.dotsData || (this._templates = [a("<div>").addClass(d.dotClass).append(a("<span>")).prop("outerHTML")]), d.navContainer && d.dotsContainer || (this._controls.$container = a("<div>").addClass(d.controlsClass).appendTo(this.$element)), this._controls.$indicators = d.dotsContainer ? a(d.dotsContainer) : a("<div>").hide().addClass(d.dotsClass).appendTo(this._controls.$container), this._controls.$indicators.on("click", "div", a.proxy(function(b) {
			var c = a(b.target).parent().is(this._controls.$indicators) ? a(b.target).index() : a(b.target).parent().index();
			b.preventDefault(), this.to(c, d.dotsSpeed)
		}, this)), b = d.navContainer ? a(d.navContainer) : a("<div>").addClass(d.navContainerClass).prependTo(this._controls.$container), this._controls.$next = a("<" + d.navElement + ">"), this._controls.$previous = this._controls.$next.clone(), this._controls.$previous.addClass(d.navClass[0]).html(d.navText[0]).hide().prependTo(b).on("click", a.proxy(function() {
			this.prev(d.navSpeed)
		}, this)), this._controls.$next.addClass(d.navClass[1]).html(d.navText[1]).hide().appendTo(b).on("click", a.proxy(function() {
			this.next(d.navSpeed)
		}, this));
		for (c in this._overrides) this._core[c] = a.proxy(this[c], this)
	}, b.prototype.destroy = function() {
		var a, b, c, d;
		for (a in this._handlers) this.$element.off(a, this._handlers[a]);
		for (b in this._controls) this._controls[b].remove();
		for (d in this.overides) this._core[d] = this._overrides[d];
		for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
	}, b.prototype.update = function() {
		var a, b, c, d = this._core.settings,
			e = this._core.clones().length / 2,
			f = e + this._core.items().length,
			g = d.center || d.autoWidth || d.dotData ? 1 : d.dotsEach || d.items;
		if ("page" !== d.slideBy && (d.slideBy = Math.min(d.slideBy, d.items)), d.dots || "page" == d.slideBy)
			for (this._pages = [], a = e, b = 0, c = 0; f > a; a++)(b >= g || 0 === b) && (this._pages.push({
				start: a - e,
				end: a - e + g - 1
			}), b = 0, ++c), b += this._core.mergers(this._core.relative(a))
	}, b.prototype.draw = function() {
		var b, c, d = "",
			e = this._core.settings,
			f = (this._core.$stage.children(), this._core.relative(this._core.current()));
		if (!e.nav || e.loop || e.navRewind || (this._controls.$previous.toggleClass("disabled", 0 >= f), this._controls.$next.toggleClass("disabled", f >= this._core.maximum())), this._controls.$previous.toggle(e.nav), this._controls.$next.toggle(e.nav), e.dots) {
			if (b = this._pages.length - this._controls.$indicators.children().length, e.dotData && 0 !== b) {
				for (c = 0; c < this._controls.$indicators.children().length; c++) d += this._templates[this._core.relative(c)];
				this._controls.$indicators.html(d)
			} else b > 0 ? (d = new Array(b + 1).join(this._templates[0]), this._controls.$indicators.append(d)) : 0 > b && this._controls.$indicators.children().slice(b).remove();
			this._controls.$indicators.find(".active").removeClass("active"), this._controls.$indicators.children().eq(a.inArray(this.current(), this._pages)).addClass("active")
		}
		this._controls.$indicators.toggle(e.dots)
	}, b.prototype.onTrigger = function(b) {
		var c = this._core.settings;
		b.page = {
			index: a.inArray(this.current(), this._pages),
			count: this._pages.length,
			size: c && (c.center || c.autoWidth || c.dotData ? 1 : c.dotsEach || c.items)
		}
	}, b.prototype.current = function() {
		var b = this._core.relative(this._core.current());
		return a.grep(this._pages, function(a) {
			return a.start <= b && a.end >= b
		}).pop()
	}, b.prototype.getPosition = function(b) {
		var c, d, e = this._core.settings;
		return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c
	}, b.prototype.next = function(b) {
		a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b)
	}, b.prototype.prev = function(b) {
		a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b)
	}, b.prototype.to = function(b, c, d) {
		var e;
		d ? a.proxy(this._overrides.to, this._core)(b, c) : (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c))
	}, a.fn.owlCarousel.Constructor.Plugins.Navigation = b
}(window.Zepto || window.jQuery, window, document),
function(a, b) {
	"use strict";
	var c = function(d) {
		this._core = d, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
			"initialized.owl.carousel": a.proxy(function() {
				"URLHash" == this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation")
			}, this),
			"prepared.owl.carousel": a.proxy(function(b) {
				var c = a(b.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");
				this._hashes[c] = b.content
			}, this)
		}, this._core.options = a.extend({}, c.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function() {
			var a = b.location.hash.substring(1),
				c = this._core.$stage.children(),
				d = this._hashes[a] && c.index(this._hashes[a]) || 0;
			return a ? void this._core.to(d, !1, !0) : !1
		}, this))
	};
	c.Defaults = {
		URLhashListener: !1
	}, c.prototype.destroy = function() {
		var c, d;
		a(b).off("hashchange.owl.navigation");
		for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
		for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null)
	}, a.fn.owlCarousel.Constructor.Plugins.Hash = c
}(window.Zepto || window.jQuery, window, document);