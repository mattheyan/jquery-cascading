; (function() {
	//////////////////////////////////////////////////////////////////////////////////////
	function Signal(debugLabel) {
		this._waitForAll = [];
		this._pending = 0;
		var _this = this;
		this._oneDoneFn = function Signal$_oneDoneFn() { Signal.prototype.oneDone.apply(_this, arguments); };

		this._debugLabel = debugLabel;
	}

	Signal.prototype = {
		pending: function Signal$pending(callback, thisPtr) {
			this._pending++;
			log("signal", "(++{_pending}) {_debugLabel}", this);
			return this._genCallback(callback, thisPtr);
		},
		orPending: function Signal$orPending(callback, thisPtr) {
			return this._genCallback(callback, thisPtr);
		},
		_doCallback: function Signal$_doCallback(name, thisPtr, callback, args, executeImmediately) {
			try {
				if (executeImmediately) {
					callback.apply(thisPtr, args || []);
				}
				else {
					window.setTimeout(function Signal$_doCallback$timeout() {
						callback.apply(thisPtr, args || []);
					}, 1);
				}
			}
			catch (e) {
				logError("signal", "({0}) {1} callback threw an exception: {2}", [this._debugLabel, name, e]);
			}
		},
		_genCallback: function Signal$_genCallback(callback, thisPtr) {
			if (callback) {
				var signal = this;
				return function Signal$_genCallback$result() {
					signal._doCallback("pending", thisPtr || this, function Signal$_genCallback$fn() {
						callback.apply(this, arguments);
						signal.oneDone();
					}, arguments);
				};
			}
			else {
				return this._oneDoneFn;
			}
		},
		waitForAll: function Signal$waitForAll(callback, thisPtr, executeImmediately) {
			if (!callback) {
				return;
			}

			if (this._pending === 0) {
				this._doCallback("waitForAll", thisPtr, callback, [], executeImmediately);
			}
			else {
				this._waitForAll.push({ "callback": callback, "thisPtr": thisPtr, "executeImmediately": executeImmediately });
			}
		},
		oneDone: function Signal$oneDone() {
			log("signal", "(--{0}) {1}", [this._pending - 1, this._debugLabel]);

			--this._pending;

			while (this._pending === 0 && this._waitForAll.length > 0) {
				var item = this._waitForAll.pop();
				this._doCallback("waitForAll", item.thisPtr, item.callback, [], item.executeImmediately);
			}
		}
	};

	window.Signal = Signal;

})();
