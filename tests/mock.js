; (function() {

    var undefined;

	// Mock load calls.  Not the most scientific data, but it works.
	var results = {
        "mocks/": "<option value=''></option>\
<option value='invertibrates'>Invertibrates</option>\
<option value='mammals'>Mammals</option>",

        "mocks/invertibrates/": "<option value=''></option>\
<option value='insects'>Insects</option>",

        "mocks/mammals/": "<option value=''></option>\
<option value='dogs'>Dogs</option>\
<option value='cats'>Cats</option>",

        "mocks/insects/": "<option value=''></option>\
<option value='spiders'>Spiders</option>\
<option value='beetles'>Beetles</option>",

        "mocks/dogs/": "<option value=''></option>\
<option value='terriers'>Terriers</option>\
<option value='labs'>Labs</option>"
    };

	var ctor = $(window).data("cascading.constructor");

	ctor.prototype.load = function(elem, url, callback) {
		var result = results[url];

        if (result === undefined) {
    		callback.call(elem, result, "error");
        }
        else {
    		$(elem).html(result);
    		callback.call(elem, result, "success");
        }
	};

})();

