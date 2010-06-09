; (function() {
	var pendingTests = {};
	var executingTestsSignal = new Signal("all pending tests signal");

	function log(category, message, args) {
		function fmt(format, values) {
			return format.replace(/{([a-z0-9_.]+)}/ig, function $format$token(match, expr) {
				var index = parseInt(expr);
				return (index !== NaN && values[index] !== undefined && values[index] !== null) ?
					values[index].toString() :
					"{" + expr + "}";
			});
		}
		//console.log(fmt(message, args));
	}

	// override parse to avoid nasty recursion bug
	var oldObjectParser = QUnit.jsDump.parsers.object;
	QUnit.jsDump.parsers.object = function(obj) {
		if (obj.meta) {
			return obj.meta.type.get_jstype().formats.$system.convert(obj);
		}
		else {
			return oldObjectParser.call(this, obj);
		}
	}

	function setupTest(name, optionsOrCallback, callbackOrNone) {
		// usage is test setup
		log("tests", "{0}: setup", [name]);

		var options = optionsOrCallback;
		var callback = callbackOrNone;

		if (arguments.length == 2) {
			log("tests", "{0}: only two args provided, no options", [name]);
			callback = optionsOrCallback;
			options = {};
		}

		// watch for when the test is registered
		var scopeSignal = new Signal("registered signal: " + name);
		var scopeCallback = scopeSignal.pending();

		// create a function to be invoked when the test is ready to be executed
		var pending = pendingTests[name] = function() {
			log("tests", "{0}: invoked, waiting for scope", [name]);

			// store the arguments of the execution callback so that they can be applied later
			var invocationArguments = arguments;

			// wait until the test is in scope if it isn't already
			scopeSignal.waitForAll(function() {
				log("tests", "{0}: registered", [name]);

				// notify qunit that the test is starting back up
				start();

				try {
					log("tests", "{0}: applying callback", [name]);

					// invoke the test callback
					callback.apply(this, invocationArguments);
				}
				catch (e) {
					// log the error and provide a meaningful failure for qunit
					log("tests", "ERROR: {0}", [e]);
					ok(false, e);
				}
			});
		};

		log("tests", "{0}: queuing test", [name]);

		// queue up the test
		test(options.description || name, function() {
			if (options.expect) {
				log("tests", "{0}: expect {1} assertions", [name, options.expect]);
				expect(options.expect);
			}

			stop(options.timeout);

			// notify that the test is in scope
			log("tests", "{0}: test in scope", [name]);
			scopeCallback();
		});
	}

	window.setupTest = setupTest;

	function executeTest(name, callback) {
		// register a pending test execution signal
		var onComplete = executingTestsSignal.pending(callback);

		// usage is test execution
		log("tests", "{0}: execute", [name]);

		// look for the test in the cache
		var pending = pendingTests[name];

		var args = Array.prototype.slice.call(arguments, 1);

		if (pending) {
			log("tests", "{0}: calling test", [name]);

			// invoke the test callback
			pending.apply(this, args);
		}
		else {
			console.warn("(UT) test not found: " + name);
		}

		// delete the test from the cache
		delete pendingTests[name];

		// notify that the pending test is complete
		onComplete.call(this);

		// pass the argument through
		return args;
	}

	window.executeTest = executeTest;

	function executeTests(/*test0, test1...*/) {
		for (var i = 0; i < arguments.length; i++) {
			executeTest(arguments[i]);
		}
	}

	window.executeTests = executeTests;

	function timeoutTests(timeout) {
		window.setTimeout(function() {
			// allow tests to complete if they are mid-execution
			executingTestsSignal.waitForAll(function() {
				// look for any pending tests and force execute them
				for (var name in pendingTests) {
					// look for the test in the cache
					var pending = pendingTests[name];

					log("tests", "{0}: force test", [name]);

					start();

					// delete the test from the cache
					delete pendingTests[name];
				}
			});
		}, timeout * 1000);
	}

	window.timeoutTests = timeoutTests;

})();