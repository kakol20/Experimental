const resonant = (function () {
	let type = "syncOrbit";
	let altitude = 0;
	return {
		showAlt: function () {
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

		run: function () {
			console.log("----- CALCULATING RESONANT ORBIT -----");
			const satCount = $("#resonantSatNo").val() * 1 || 3;
			const diveOrbit = $("#resonantDive").prop("checked") || false;

			let a = 0;
			let R = 0;
			switch (type) {
				case "syncOrbit":
					altitude = tools.getBody().syncOrbit;
					break;
				case "semiSyncOrbit":
					altitude = tools.getBody().semiSyncOrbit;
					break;
				case "custom":
					altitude = $("#resonantCustom").val() * 1 || 0;
					break;
				case "minLOS":
					//const insideAngle = (Math.PI * (satCount - 2)) / satCount;
					const r = tools.getBody().radius;
					a = 2 * r * Math.tan(Math.PI / satCount);
					R = a / (2 * Math.sin(Math.PI / satCount));
					altitude = R - r;
					break;
				case "maxRange":
					a = $("#resonantMaxRange").val() * 1 || 0;
					R = a / (2 * Math.sin(Math.PI / satCount));
					altitude = R - tools.getBody().radius;
					break;
			}

			const semiMajorAxis = tools.semiMajorAxis(altitude, altitude);
			const period = tools.orbitalPeriod(semiMajorAxis);

			let orbitRatio = 0;
			let atPeriapsis = false;
			if (diveOrbit) {
				orbitRatio = (satCount - 1) / satCount;
				atPeriapsis = true;
			} else {
				orbitRatio = (satCount + 1) / satCount;
			}

			const targetPeriod = period * orbitRatio;
			const targetSMA = tools.targetOrbitalPeriod(targetPeriod);

			let periapsis = altitude;
			let apoapsis = tools.ellipticalFromSMA(targetSMA, periapsis);

			let max = Math.max(periapsis, apoapsis);
			periapsis = Math.min(periapsis, apoapsis);
			apoapsis = max;

			console.log("Apoapsis: " + apoapsis);
			console.log("Periapsis: " + periapsis);

			const deltaV = Math.abs(tools.velocityElliptical(targetSMA, altitude) -
				tools.velocityElliptical(semiMajorAxis, altitude)
			);

			console.log("Delta V: " + deltaV);

			let output = "Apoapsis: " + tools.cleanNumber(apoapsis) + " km<br>";
			output += "Periapsis: " + tools.cleanNumber(periapsis) + " km<br>";
			output += "Δv required: " + tools.cleanNumber(deltaV) + " m/s<br>";
			output += "Final Period: " + tools.cleanPeriod(period) + "<br>";

			$("#resonantOutput").html(output);

			console.log("----- END -----");
		}
	};
})();
