; (function() {

    window.logQUnit = false;

	var $target;
	var selectedValue;

	setupTest("1", { description: "Initialization and Basic Assumptions", expect: 1 }, function() {
		$target = $("#test_target");
		
		var returnValue = $target.cascading({
			url: function(val, elem, parent) {
                var index = $(elem).attr("data-index");
                if (!index) {
                    var parentIndex = $(parent).attr("data-index");
                    index = parseInt(parentIndex) + 1;
                    $(elem).attr("data-index", index);
                }
				return "mocks" + "/" + index + (val ? "/" + val : "") + "/";
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

	setupTest("4", { description: "Basic cascading #1", expect: 3 }, function() {
		$target.val("invertebrates").trigger("change"); // NOTE: "change" has to be triggered manually
		ok(selectedValue === "invertebrates", "Custom onValueChanged function should be called");
        ok($target.next("select").val() === "", "Next select list is blank");
		equals($("select").length, 2, "Should be two select lists on the page after changing value");
	});

	setupTest("5", { description: "Basic cascading #2", expect: 3 }, function() {
		$target.next("select").val("insects").trigger("change"); // NOTE: "change" has to be triggered manually
		ok(selectedValue === "insects", "Custom onValueChanged function should be called");
        ok($target.next("select").next("select").val() === "", "Next select list is blank");
        equals($("select").length, 3, "Should be three select lists on the page after changing value");
	});

	setupTest("6", { description: "Terminal selection", expect: 2 }, function() {
		$target.next("select").next("select").val("spiders").trigger("change"); // NOTE: "change" has to be triggered manually
		ok(selectedValue === "spiders", "Custom onValueChanged function should be called");
        equals($("select").length, 3, "Should be three select lists on the page after changing value");
	});

	// selecting blank option in parent drop down doesn't seem to affect child

	$(function() {
		executeTest("1");

		// TODO: implement cascading "ready"
		setTimeout(function() {
			executeTests("2", "3", "4", "5", "6");
		}, 1000);
	});

})();

