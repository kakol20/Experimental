class Body {
    constructor(sgp, sgpPow, radius, rotPeriod) {
        this.sgp = sgp * Math.pow(10, sgpPow - 9);

        this.radius = radius; // in km
        this.rotPeriod = rotPeriod; // in seconds
    }
};

const tools = (function () {
    return {
        updateBody: function () {
            this.orbitBody = document.getElementById("orbitBody").value || "kerbin";

            console.log("Orbit Body changed to: " + this.orbitBody);
        },
        orbitBody: "kerbin",

        bodies: new Map(),

        getBody: function () {
            return this.bodies.get(this.orbitBody);
        },

        semiMajorAxis: function (apoapsis, periapsis) {
            return (apoapsis + periapsis + (tools.getBody().radius * 2)) / 2;
        },

        orbitalPeriod: function (sma) {
            return (Math.PI * 2) * Math.sqrt(Math.pow(sma, 3) / tools.getBody().sgp);
        },

        cleanPeriod: function (period) {
            let accumulated = period;
            let output = "";

            const seconds = accumulated % 60;
            accumulated -= seconds;
            accumulated /= 60;

            const minutes = accumulated % 60;
            accumulated -= minutes;
            accumulated /= 60;

            output = String(accumulated) + "h, ";
            output += String(minutes) + "m, ";
            output += Decimal(seconds).toDecimalPlaces(4) + "s";

            return output;
        }
    };
})();

// Runs script when page is loaded or reloaded
$(function () {
    console.log("Script by kakol20");
    console.log("-----");
    //console.log("");

    tools.bodies.set("kerbin", new Body(3.5316, 12, 600, 21549.425));
    tools.bodies.set("mun", new Body(6.5138398, 10, 200, 138984.38));
});