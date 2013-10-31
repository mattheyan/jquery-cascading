JQuery Cascading Drop-down Plugin
=================================

A JQuery plugin for creating and deleting dependent selects dynamically based on data.

Designed to allow a user to drill down into a hierarchy of unknown depth (e.g. categories).

For more information, check out the [wiki](./wiki)!

Usage
-----

Basic initialization:

		$("select.root").cascading({
			url: "someurl/getoptions?parent={0}"
		});

The url option can be a function.

		$("select.root").cascading({
			url: function(val, elem, parent) {
				return "someurl/" + (parent ? (parent.id + "/") : "") + elem.id + (val ? "/" + val : "") + "/";
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

License
-------

This software is licensed under the [The MIT License (MIT)](http://opensource.org/licenses/MIT).

	Copyright (C) 2013 Bryan Matthews

	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
