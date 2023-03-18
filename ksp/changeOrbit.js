const changeOrbit = function () {
    console.log("----- CALCULATING CHANGE ORBIT -----");

    // ----- GET VALUES -----
    let fromApoapsis = $("#changeOrbFrAp").val() * 1 || 0;
    let fromPeriapsis = $("#changeOrbFrPe").val() * 1 || 0;

    let max = Math.max(fromApoapsis, fromPeriapsis);
    fromPeriapsis = Math.min(fromApoapsis, fromPeriapsis);
    fromApoapsis = max;

    let toApoapsis =  $("#changeOrbToAp").val() * 1 || 0;
    let toPeriapsis = $("#changeOrbToPe").val() * 1 || 0;

    max = Math.max(toApoapsis, toPeriapsis);
    toPeriapsis = Math.min(toApoapsis, toPeriapsis);
    toApoapsis = max;

    let currApoapsis = fromApoapsis;
    let currPeriapsis = fromPeriapsis;

    // ----- DETERMINE ORDER OF OPERATION -----

    let innerHTML = "";

    let debugAltitude = {
        apoapsis: currApoapsis,
        periapsis: currPeriapsis
    };

    console.log(debugAltitude);

    while (currApoapsis != toApoapsis || currPeriapsis != toPeriapsis) {
        let first = "";
        let last = "";
        let manoeuvreAlt = 0;
        if (toPeriapsis < currPeriapsis) {
            // decrease periapsis at apoapsis - burn retrograde
            console.log("decrease periapsis at apoapsis - burn retrograde");

            currPeriapsis = toPeriapsis;

            debugAltitude.apoapsis = currApoapsis;
            debugAltitude.periapsis = currPeriapsis;
            console.log(debugAltitude);

            first = "Burn ";
            last = " m/s retrograde at apoapsis<br>";
            manoeuvreAlt = currApoapsis;
        } else if (toPeriapsis > currPeriapsis) {
            // increase periapsis at apoapsis - burn prograde
            console.log("increase periapsis at apoapsis - burn prograde");

            currPeriapsis = toPeriapsis;

            debugAltitude.apoapsis = currApoapsis;
            debugAltitude.periapsis = currPeriapsis;
            console.log(debugAltitude);

            first = "Burn ";
            last = " m/s prograde at apoapsis<br>";
            manoeuvreAlt = currApoapsis;
        } else if (toApoapsis > currApoapsis) {
            // increase apoapsis at periapsis - burn prograde
            console.log("increase apoapsis at periapsis - burn prograde");

            currApoapsis = toApoapsis;

            debugAltitude.apoapsis = currApoapsis;
            debugAltitude.periapsis = currPeriapsis;
            console.log(debugAltitude);

            first = "Burn ";
            last = " m/s prograde at periapsis<br>";
            manoeuvreAlt = currPeriapsis;
        } else if (toApoapsis < currApoapsis) {
            // decrease apoapsis at periapsis - burn retorgrade
            console.log("decrease apoapsis at periapsis - burn retorgrade");

            currApoapsis = toApoapsis;

            debugAltitude.apoapsis = currApoapsis;
            debugAltitude.periapsis = currPeriapsis;
            console.log(debugAltitude);

            first = "Burn ";
            last = " m/s retrograde at periapsis<br>";
            manoeuvreAlt = currPeriapsis;
        } else {
            // should never happen but written just in case
            console.log("if statement failed");

            debugAltitude.apoapsis = currApoapsis;
            debugAltitude.periapsis = currPeriapsis;
            console.log(debugAltitude);
            break;
        }

        //let currentV = tools.
    }

    console.log("----- END -----");
};