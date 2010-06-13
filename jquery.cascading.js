/*!
 * JQuery Cascading Plugin 0.1
 * 
 *
 * Copyright 2010, Bryan Matthews
 * Licensed under the GNU Lesser General Public License Version 3
 * http://www.gnu.org/licenses/lgpl.html
 *
 * Date: Tue Jun  8 20:56:59 EDT 2010
 */

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

	function log(message, args) {
		if (window.console && console.log) {
			console.log(fmt(message, args));
		}
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
		this._val = "";
		this._text = "";

		var settings = this.settings = $.extend({
			debug: false,
			onValueChanged: function(elem, val, text, oldVal, oldText) { },
			filter: function(elem, val, text, oldVal, oldText) { return true; },
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
				err("Unknown url settings: {0}.  Expected string or function(val).", [this.settings.url.toString()]);
			}
		},
		hide: function hide(elem, callback) {
			if (!this.settings.hide || !(this.settings.hide instanceof Function)) {
				err("Unknown hide settings: {0}.  Expected function(elem, callback).", [this.settings.hide.toString()]);
			}
			this.settings.hide(elem, callback);
		},
		show: function show(elem, callback) {
			if (!this.settings.show || !(this.settings.show instanceof Function)) {
				err("Unknown show settings: {0}.  Expected function(elem, callback).", [this.settings.show.toString()]);
			}
			this.settings.show(elem, callback);
		},
		filter: function filter(elem, val, text, oldVal, oldText) {
			if (!this.settings.filter) {
				return;
			}

			if (!(this.settings.filter instanceof Function)) {
				err("Unknown filter settings: {0}.  Expected function(elem, val, text, oldVal, oldText).", [this.settings.filter.toString()]);
			}

			return this.settings.filter(elem, val, text, oldVal, oldText);
		},
		create: function create(parent) {
			return $(parent).after("<select style=\"display:none;\"></select>").next("select");
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

			var val = $(elem).val();
			var oldVal = $(elem).data("cascading.val");

			var text = $($(elem).children().get(elem.selectedIndex)).text();
			var oldText = $(elem).data("cascading.text");

			if (this.settings.onValueChanged && this.settings.onValueChanged instanceof Function) {
				if (!(this.settings.onValueChanged instanceof Function)) {
					err("Unknown onValueChanged settings: {0}.  Expected function(elem, val, text, oldVal, oldText).", 
						[this.settings.onValueChanged.toString()]);
				}

				// Reset value and exit early if the callback returns false.
				// This will bypass the cascading behavior's creation of a
				// child select list and will NOT re-broadcast events.  Also,
				// it is assumed that if the developer must respond to the 
				// fact that the user's selection was reverted, then he/she
				// can do so within the callback itself.
				if(this.settings.onValueChanged(elem, val, text, olvVal, oldText) === false) {
					$(elem).val(oldVal);
					return;
				}	
			}

			this._val = val;
			$(elem).data("cascading.val", val);

			this._text = text;
			$(elem).data("cascading.text", text);

			removeDependants(elem,
				function hideFn(elem, callback) {
					cascading.hide(elem, callback)
				},
				function callback() {
					if (cascading._val) {
						cascading.populate(cascading.create(elem), elem);
					}
				}
			);
		},
		populate: function populate(elem, parent) {
			var cascading = this;
			$(elem).load(this.url(this._val), function(responseText, status) {
				cascading.contentLoaded(this, parent, $.trim(responseText).length === 0);
			});
		}
	};

	jQuery.fn.cascading = function cascading(options) {
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

