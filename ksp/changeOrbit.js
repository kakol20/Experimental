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
};