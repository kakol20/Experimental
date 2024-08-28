const changeOrbit = function () {
	console.log("----- CALCULATING CHANGE ORBIT -----");

	// ----- GET VALUES -----
	let fromApoapsis = $("#changeOrbFrAp").val() * 1 || 0;
	let fromPeriapsis = $("#changeOrbFrPe").val() * 1 || 0;

	let max = Math.max(fromApoapsis, fromPeriapsis);
	fromPeriapsis = Math.min(fromApoapsis, fromPeriapsis);
	fromApoapsis = max;

	let toApoapsis = $("#changeOrbToAp").val() * 1 || 0;
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

	let totalDeltaV = 0;
	while (currApoapsis != toApoapsis || currPeriapsis != toPeriapsis) {
		let first = "";
		let last = "";
		let manoeuvreAlt = 0;
		let changePeriapsis = false;

		if (toApoapsis > currApoapsis) {
			// increase apoapsis at periapsis - burn prograde
			console.log("increase apoapsis at periapsis - burn prograde");

			first = "Burn ";
			last = " m/s prograde at periapsis<br>";
			manoeuvreAlt = currPeriapsis;
		} else if (toPeriapsis < currPeriapsis) {
			// decrease periapsis at apoapsis - burn retrograde
			console.log("decrease periapsis at apoapsis - burn retrograde");

			first = "Burn ";
			last = " m/s retrograde at apoapsis<br>";
			manoeuvreAlt = currApoapsis;
			changePeriapsis = true;
		} else if (toApoapsis < currApoapsis && toApoapsis >= currPeriapsis) {
			// decrease apoapsis at periapsis - burn retorgrade
			console.log("decrease apoapsis at periapsis - burn retorgrade");

			first = "Burn ";
			last = " m/s retrograde at periapsis<br>";
			manoeuvreAlt = currPeriapsis;
		} else if (toPeriapsis > currPeriapsis && toPeriapsis <= currApoapsis) {
			// increase periapsis at apoapsis - burn prograde
			console.log("increase periapsis at apoapsis - burn prograde");

			first = "Burn ";
			last = " m/s prograde at apoapsis<br>";
			manoeuvreAlt = currApoapsis;
			changePeriapsis = true;
		} else {
			alert("Manoeuvre planning failed");
			break;
		}

		let currentV = tools.velocityElliptical(tools.semiMajorAxis(currApoapsis, currPeriapsis), manoeuvreAlt);
		let targetV = 0;
		if (changePeriapsis) {
			targetV = tools.velocityElliptical(tools.semiMajorAxis(currApoapsis, toPeriapsis), manoeuvreAlt);

			currPeriapsis = toPeriapsis;
		} else {
			targetV = tools.velocityElliptical(tools.semiMajorAxis(toApoapsis, currPeriapsis), manoeuvreAlt);

			currApoapsis = toApoapsis;
		}

		debugAltitude.apoapsis = currApoapsis;
		debugAltitude.periapsis = currPeriapsis;
		console.log(debugAltitude);

		let deltaV = Math.abs(targetV - currentV);

		totalDeltaV += deltaV;

		console.log("Delta V: " + deltaV);

		innerHTML += first + tools.cleanNumber(deltaV) + last;
	}

	if (innerHTML === "") {
		innerHTML = "No manoeuvres required<br>";
	} else {
		innerHTML += "Total Δv required: " + tools.cleanNumber(totalDeltaV) + " m/s<br>";
	}
	$("#changeOrbOut").html(innerHTML);

	console.log("----- END -----");
};
