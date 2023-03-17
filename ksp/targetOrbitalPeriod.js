const targetOrbitalPeriod = (function () {
    return {
        updateType: function () {
            this.type = document.getElementById("targetOPType").value || "circular";
            console.log("Changed orbit type to: " + this.type);
            let innerHTMl = "";
            if (this.type == "elliptical") {
                innerHTMl = "Altitude: <input type=\"number\" id=\"targetOPOption\" /><br>"
            } else {
                innerHTML = "";
            }

            document.getElementById("targetOPTypeOptions").innerHTML = innerHTMl;
        },

        type: "circular",

        run: function () {
            console.log("----- CALCULATING TARGET ORBITAL PERIOD -----");
            const hours = parseFloat(document.getElementById("targetOPH").value) || 0;
            const minutes = parseFloat(document.getElementById("targetOPM").value) || 0;
            const seconds = parseFloat(document.getElementById("targetOPS").value) || 0;
            const orbitalPeriod = (hours * 60 * 60) + (minutes * 60) + seconds;

            console.log("Orbital period: " + orbitalPeriod + " seconds");

            const sma = tools.targetOrbitalPeriod(orbitalPeriod);

            let apoapsis = 0;
            let periapsis = 0;
            switch (this.type) {
                case "circular":
                    apoapsis = tools.circularFromSMA(sma);
                    periapsis = apoapsis;
                    break;
                case "elliptical":
                    apoapsis = parseFloat(document.getElementById("targetOPOption").value) || 0;
                    periapsis = tools.ellipticalFromSMA(sma, apoapsis);
                    break;
            };

            const max = Math.max(apoapsis, periapsis);
            periapsis = Math.min(apoapsis, periapsis);
            apoapsis = max;

            console.log("Apoapsis: " + apoapsis + " km");
            console.log("Periapsis: " + periapsis + " km");

            console.log("----- END -----");
        }
    };
})();