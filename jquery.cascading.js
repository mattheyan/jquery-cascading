; (function() {
	var undefined;

	function fmt(format, values) {
		return format.replace(/{([a-z0-9_.]+)}/ig, function $format$token(match, expr) {
			var index = parseInt(expr);
			return (index !== NaN && values[index] !== undefined && values[index] !== null) ?
				values[index].toString() :
				"{" + expr + "}";
		});
	}

	function err(message, args) {
		throw fmt(message, args || []);
	}

	function assert(val, message) {
		if (val === undefined || val === null) {
			err("Url settings are not specified.");
		}
	}

	function dependsOn(dependant, dependency) {
		var dependants = $(dependency).data("dependants");
		if (!dependants) {
			dependants = [];
			$(dependency).data("dependants", dependants);
		}
		dependants.push(dependant);
	}

	function removeDependants(dependency, hideFn, callback) {
		var dependants = $(dependency).data("dependants");
		if (dependants && dependants.length > 0) {
			var remaining = dependants.length;
			$.each(dependants, function(index, elem) {
				removeDependants(elem, hideFn, function(elem) {
					hideFn(elem, function() {
						$(elem).remove();
						if (--remaining === 0) {
							if (callback && callback instanceof Function) {
								callback(dependency);
							}
						}
					});
				});
			});
		}
		else {
			if (callback && callback instanceof Function) {
				callback(dependency);
			}
		}
	}

	function Cascading(elem, options) {
		this._options = options;
		this._selectedValue = "";
		this._selectedText = "";

		var settings = this.settings = $.extend({
			onValueChanged: function(val) { },
			animate: false,
			show: function(elem, callback) {
				if (settings.animate) {
					$(elem).slideDown(function() {
						callback(this);
					});
				}
				else {
					$(elem).show();
					if (callback && callback instanceof Function) {
						callback(elem);
					}
				}
			},
			hide: function(elem, callback) {
				if (settings.animate) {
					$(elem).slideUp(function() {
						callback(this);
					});
				}
				else {
					$(elem).hide();
					if (callback && callback instanceof Function) {
						callback(elem);
					}
				}
			}
		}, options || {});

		this.populate(elem);
	}

	Cascading.prototype = {
		url: function url(val) {
			assert(this.settings.url, "Url settings are not specified.");
			if (this.settings.url instanceof Function) {
				return this.settings.url(val);
			}
			else if (this.settings.url.constructor === String) {
				return fmt(this.settings.url, [val]);
			}
			else {
				err("Unknown url settings: " + this.settings.url.toString());
			}
		},
		hide: function hide(elem, callback) {
			if (!this.settings.hide || !(this.settings.hide instanceof Function)) {
				err("Unknown hide settings: " + this.settings.hide.toString());
			}
			this.settings.hide(elem, callback);
		},
		show: function show(elem, callback) {
			if (!this.settings.show || !(this.settings.show instanceof Function)) {
				err("Unknown show settings: " + this.settings.show.toString());
			}
			this.settings.show(elem, callback);
		},
		create: function create(parent) {
			return $(parent).after("<select style='display:none;'></select>").next("select");
		},
		contentLoaded: function contentLoaded(elem, parent, empty) {
			var cascading = this;

			if (empty) {
				// Animate if the element is visible.
				if ($(elem).is(":visible")) {
					this.hide(elem, function(elem) {
						$(elem).remove();
					});
				}
				else {
					$(elem).remove();
				}
			}
			else {
				this.show(elem);
				$(elem).change(function() {
					cascading.valueChanged(this);
				});
				if (parent) {
					dependsOn(elem, parent);
				}
			}
		},
		valueChanged: function valueChanged(elem) {
			var cascading = this;

			this._selectedValue = $(elem).val();
			this._selectedText = $($(elem).children().get(elem.selectedIndex)).text();

			if (this.settings.onValueChanged && this.settings.onValueChanged instanceof Function) {
				this.settings.onValueChanged(elem, this._selectedValue, this._selectedText);
			}

			removeDependants(elem, function(elem, callback) {
				cascading.hide(elem, callback)
			}, function() {
				cascading.populate(cascading.create(elem), elem);
			});
		},
		populate: function populate(elem, parent) {
			var cascading = this;
			$(elem).load(this.url(this._selectedValue), function(responseText, status) {
				cascading.contentLoaded(this, parent, $.trim(responseText).length === 0);
			});
		}
	};

	jQuery.fn.cascading = function(options) {
		if (this.length > 0) {
			this.each(function() {
				var cascading = new Cascading(this, options);
			});
		}
		else {
			err("Query \"{0}\" results in no matching elements.", [this.selector]);
		}

		return this;
	};
})();
