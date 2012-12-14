; (function() {

    var undefined;

    // Mock load calls.  Not the most scientific data, but it works.
    var results = [{
    
        "__default__": "<option value=''></option>\
            <option value='invertibrates'>Invertibrates</option>\
            <option value='mammals'>Mammals</option>"

        }, {

        "invertibrates": "<option value=''></option>\
<option value='insects'>Insects</option>",

        "mammals": "<option value=''></option>\
<option value='dogs'>Dogs</option>\
<option value='cats'>Cats</option>"
        }, {

        "insects": "<option value=''></option>\
<option value='spiders'>Spiders</option>\
<option value='beetles'>Beetles</option>",

        "dogs": "<option value=''></option>\
<option value='terriers'>Terriers</option>\
<option value='labs'>Labs</option>",

        "cats": "<option value=''></option>\
<option value='siamese'>Terriers</option>"

    }];

    var ctor = $(window).data("cascading.constructor");

    var urlParser = /^mocks\/(\d+)\/((.+)\/)?$/i;

    ctor.prototype.load = function(elem, url, callback) {
        if (!urlParser.test(url)) {
            throw new Error("Invalid url '" + url + "'.");
        }

        var parsed = urlParser.exec(url);
        var index = parsed[1];
        var name = parsed[3];

        var group = results[index];

        var result;

        if (group === undefined) {
            callback.call(elem, result, "error");
        }
        else {
            if (name === undefined) {
                result = group["__default__"];
            }
            else {
                result = group[name];
            }
            if (result === undefined) {
                callback.call(elem, result, "error");
            }
            else {
                $(elem).html(result);
                callback.call(elem, result, "success");
            }
        }
    };

})();

