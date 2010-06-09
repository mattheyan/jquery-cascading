; (function() {

	var $target;
	var selectedValue;

	setupTest("1", { description: "Initialization and Basic Assumptions", expect: 1 }, function() {
		$target = $("#test_target");
		
		var returnValue = $target.cascading({
			url: function(val) {
				return "mocks/" + (val ? val : "__root") + ".htm";
			},
			onValueChanged: function(elem, val, text) {
				selectedValue = val;
			}
		});

		equals(returnValue, $target, "Should return original jQuery object");
	});

	setupTest("2", { description: "Verify Initial Options Loaded", expect: 1 }, function() {
		equals($target.children().length, 3, "Should be three children");
	});

	setupTest("3", { description: "Use of onValueChanged option", expect: 1 }, function() {
		$target.val("mammals").trigger("change"); // NOTE: "change" has to be triggered manually
		ok(selectedValue === "mammals", "Custom onValueChanged function should be called");
	});

	setupTest("4", { description: "Basic Cascading", expect: 1 }, function() {
		$target.val("invertibrates").trigger("change"); // NOTE: "change" has to be triggered manually
		equals($("select").length, 2, "Should be two select lists on the page after changing value");
	});

	// selecting blank option in parent drop down doesn't seem to affect child

	$(function() {
		executeTest("1");

		// TODO: implement cascading "ready"
		setTimeout(function() {
			executeTests("2", "3", "4");
		}, 1000);
	});

})();

