A JQuery plugin for creating and deleting dependent selects dynamically based on data.

Designed to allow a user to drill down into a heirarchy of unknown depth (e.g. categories).

Basic initialization:

		$("select.root").cascading({
			url: "someurl/getoptions?parent={0}"
		});

The url option can be a function.

		$("select.root").cascading({
			url: function(val) {
				return "someurl" + (val ? "/" + val : "") + "/";
			}
		});

You can also use the onValueChanged option to run custom code when the selected value changes.

		$("select.root").cascading({
			url: "someurl/getoptions?parent={0}",
			onValueChanged: function(elem, val, text) {
				selectedValue = val;
			}
		});

Output is a sequence of select elements:

![Screenshot](https://raw.github.com/mattheyan/jquery-cascading/master/screenshot.png)

