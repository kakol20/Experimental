const resonant = (function() {
    let type = "syncOrbit";
    let altitude = 0;
    return {
        showAlt: function() {
            type = $("#resonantSelect").val() || "syncOrbit";
            console.log("Changed altitude type to: " + type);

            if (type == "custom") {
                $("#resonantCustomHTML").show();
                $("#resonantMaxRangeHTML").hide();
            } else if (type == "maxRange") {
                $("#resonantCustomHTML").hide();
                $("#resonantMaxRangeHTML").show();
            } else {
                $("#resonantCustomHTML").hide();
                $("#resonantMaxRangeHTML").hide();
            }
        },

        run: function() {

        }
    };
})();