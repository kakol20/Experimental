const changeOrbit = function () {
    // ----- GET VALUES -----
    let fromApoapsis = $("#changeOrbFrAp").val() * 1 || 0;
    let fromPeriapsis = $("#changeOrbFrPe").val() * 1 || 0;

    let max = Math.max(fromApoapsis, fromPeriapsis);
    fromPeriapsis = Math.min(fromApoapsis, fromPeriapsis);
    fromApoapsis = max;

    let toApoapsis =  $("#changeOrbToAp").val() * 1 || 0;
    let toPeriapsis = $("#changeOrbToPe").val() * 1 || 0;

    let max = Math.max(toApoapsis, toPeriapsis);
    toPeriapsis = Math.min(toApoapsis, toPeriapsis);
    toApoapsis = max;

    let currApoapsis = fromApoapsis;
    let currPeriapsis = fromPeriapsis;

    // ----- DETERMINE ORDER OF OPERATION -----

    let output = "";

    while (currApoapsis != toApoapsis || currPeriapsis != toPeriapsis) {
        if (toPeriapsis < currPeriapsis) {
            // decrease periapsis at apoapsis - burn retrograde
        } else if (toPeriapsis > currPeriapsis && toPeriapsis < currApoapsis) {
            // increase periapsis at apoapsis - burn prograde
        } else if (toApoapsis > currApoapsis) {
            // increase apoapsis at periapsis - burn prograde
        } else if (toApoapsis < currApoapsis && toApoapsis > currPeriapsis) {
            // decrease apoapsis at periapsis - burn retorgrade
        }
    }
};