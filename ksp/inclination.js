const inclination = (function() {
    return {
        run: function() {
            console.log("----- CALCULATING CHANGE INCLINATION -----");

            // const apoapsis = $("#orbitPeriodAp").val() * 1 || 0;
            
            const orbitAp = $("#inclAp").val() * 1 || 100;
            const orbitPe = $("#inclPe").val() * 1 || 100;
            const orbitIncl = $("#inclDeg").val() * 1 || 0;

            const targetIncl = $("#inclTIncl").val() * 1 || 0;

            const increment = $("#inclInc").val() * 1 || 100;
            const maxAltitude = $("#inclMaxAlt").val() * 1 || 80000;
            const minFraction = $("#inclMinFrac").val() * 1 || 0;

            const originalDV = this.calculateDV(orbitAp, orbitPe, orbitAp, orbitIncl, targetIncl, false);

            // console.log(orbitAp);
            // console.log(orbitPe);
            // console.log(orbitIncl);
            // console.log(targetIncl);
            // console.log(increment);
            // console.log(maxAltitude);
            // console.log(minFraction);
            // console.log(originalDV);

            let currentAP = orbitAp;
            let currentDv = originalDV;
            let currentFraction = currentDv / originalDV;

            while (true) {
                let nextAp = currentAP + increment;
                if (nextAp > maxAltitude) {
                    break;
                } else {
                    let nextDV = this.calculateDV(orbitAp, orbitPe, nextAp, orbitIncl, targetIncl, false);
                    let nextFraction = nextDV / originalDV;

                    if (nextFraction > minFraction && nextFraction < currentFraction) {
                        currentAP = nextAp;
                        currentDv = nextDV;
                        currentFraction = nextFraction;
                    } else {
                        break;
                    }
                }
            }

            let optimalDV = this.calculateDV(orbitAp, orbitPe, currentAP, orbitIncl, targetIncl, true);

            if (optimalDV === 0) {
                // $("#changeOrbOut").html(innerHTML);
                $("#changeInclOutput").html("No manoeuvres required<br>");
            } else {
                let output = "Change Inclination at Apoapsis " + tools.cleanNumber(currentAP) + " km<br>";
                output += "Total Δv required &asymp; " + tools.cleanNumber(optimalDV) + " m/s<br>";
                output += "Fraction = " + tools.cleanNumber(currentFraction) + "<br>";
                $("#changeInclOutput").html(output);
            }
        },

        calculateDV: function(orbitAP, orbitPE, burnAP, inclStart, inclEnd, debug) {
            // ----- BURN TO APOAPSIS -----
            let sma = tools.semiMajorAxis(orbitAP, orbitPE);
            let currentV = tools.velocityElliptical(sma, orbitPE);

            // console.log("At periapsis: " + tools.cleanNumber(currentV) + " m/s");

            sma = tools.semiMajorAxis(burnAP, orbitPE);
            let targetV = tools.velocityElliptical(sma, orbitPE);

            // console.log("Target Δv to apoapsis: " + tools.cleanNumber(targetV) + " m/s");

            let burn2APV = targetV - currentV;

            // ----- CHANGE INCLINATION -----

            currentV = tools.velocityElliptical(sma, burnAP);

            // console.log(tools.cleanNumber(velocityElliptical) + " m/s at apoapsis");

            let changeInclDV = tools.changeInclination(currentV, inclStart, inclEnd);


            let result = (burn2APV * 2) + changeInclDV;

            if (debug) {
                console.log("Target apoapsis: " + tools.cleanNumber(burnAP) + " km");
                console.log("Δv to apoapsis: " + tools.cleanNumber(burn2APV) + " m/s");
                console.log("Inclination change Δv: " + tools.cleanNumber(changeInclDV) + " m/s");
                console.log("Total Δv: " + tools.cleanNumber(result) + " m/s");
            }

            return result;
        }
    }
})();