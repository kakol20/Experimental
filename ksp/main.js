class Body {
    constructor(sgp, sgpPow, radius, rotPeriod) {
        this.sgp = sgp * Math.pow(10, sgpPow - 9);

        this.radius = radius; // in km
        this.rotPeriod = rotPeriod; // in seconds

        this.syncOrbit = Math.cbrt((this.rotPeriod * this.rotPeriod * this.sgp) / (4 * Math.PI * Math.PI));
        this.syncOrbit -= this.radius;

        const semiPeriod = this.rotPeriod / 2.0;
        this.semiSyncOrbit = Math.cbrt((semiPeriod * semiPeriod * this.sgp) / (4 * Math.PI * Math.PI));
        this.semiSyncOrbit -= this.radius;

        // ----- SAVE BODY INFO IN HTML FORM -----
        this.bodyInfo = "Equatorial Radius: " + this.radius.toLocaleString() + " km<br>";

        // tools.cleanPeriod(this.rotPeriod)
        let span = "<span title=\"" + this.rotPeriod.toLocaleString() + " seconds\">" + tools.cleanPeriod(this.rotPeriod) + "</span>";

        this.bodyInfo += "Standard Gravitational Parameter: " + this.sgp.toLocaleString() + " km<sup>3</sup>/s<sup>-2</sup><br>";
        this.bodyInfo += "Sidereal Rotational Period: " + span + "<br>";
        this.bodyInfo += "Synchronous Orbit: " + this.syncOrbit.toLocaleString() + " km<br>";
        this.bodyInfo += "Semi-synchronous Orbit: " + this.semiSyncOrbit.toLocaleString() + " km<br>";
    }
};

const tools = (function () {
    return {
        orbitBody: "kerbin",
        bodies: new Map(),

        updateBody: function () {
            this.orbitBody = $("#orbitBody").val() || "kerbin";
            $("#bodyInfo").html(tools.getBody().bodyInfo);

            console.log("Orbit Body changed to: " + this.orbitBody);
        },

        getBody: function () {
            return this.bodies.get(this.orbitBody);
        },

        semiMajorAxis: function (apoapsis, periapsis) {
            return (apoapsis + periapsis + (tools.getBody().radius * 2)) / 2;
        },

        orbitalPeriod: function (sma) {
            return (Math.PI * 2) * Math.sqrt(Math.pow(sma, 3) / tools.getBody().sgp);
        },

        // returns the semi major axis in km
        targetOrbitalPeriod: function (orbitalPeriod) {
            return Math.cbrt((orbitalPeriod * orbitalPeriod * tools.getBody().sgp) / (4 * Math.PI * Math.PI));
        },

        ellipticalFromSMA: function (sma, altitude) {
            return (2 * sma) - altitude - (2 * tools.getBody().radius);
        },
        circularFromSMA: function (sma) {
            return sma - tools.getBody().radius;
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

            output = accumulated.toLocaleString() + "h, ";
            output += String(minutes) + "m, ";
            output += Decimal(seconds).toDecimalPlaces(4) + "s";

            return output;
        },

        cleanNumber: function (number) {
            return number.toLocaleString();
        },

        // https://en.wikipedia.org/wiki/Orbital_speed
        // http://www.braeunig.us/space/orbmech.htm#maneuver
        // All in m/s
        velocityCircular: function (sma) {
            const kms = Math.sqrt(this.getBody().sgp / sma);
            return kms * 1000;
        },
        velocityElliptical: function (sma, altitude) {
            const kms = Math.sqrt(this.getBody().sgp * ((2 / (altitude + this.getBody().radius)) - (1 / sma)));
            return kms * 1000;
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

    tools.updateBody();
    targetOrbitalPeriod.updateType();
    resonant.showAlt();
});