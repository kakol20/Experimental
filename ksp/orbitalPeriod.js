const orbitalPeriod = function () {
	console.log("----- CALCULATING ORBITAL PERIOD -----");

	const apoapsis = $("#orbitPeriodAp").val() * 1 || 0;
	const periapsis = $("#orbitPeriodPe").val() * 1 || 0;

	const semiMajorAxis = tools.semiMajorAxis(apoapsis, periapsis);

	console.log("Apoapsis: " + apoapsis);
	console.log("Periapsis: " + periapsis);
	console.log("Semi-major axis: " + semiMajorAxis);

	const result = tools.orbitalPeriod(semiMajorAxis);
	console.log("Orbital Period: " + result + " seconds");

	console.log("----- END -----");

	//document.getElementById("orbitPeriodOutput").innerHTML = tools.cleanPeriod(result);
	$("#orbitPeriodOutput").html(tools.cleanPeriod(result));
};