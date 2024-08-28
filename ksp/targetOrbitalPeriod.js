const targetOrbitalPeriod = (function () {
	let type = "circular";
	return {
		updateType: function () {
			type = $("#targetOPType").val() || "circular";
			console.log("Changed orbit type to: " + type);
			switch (type) {
				case "elliptical":
					$("#targetOPTypeOptions").show();
					break;
				case "circular":
					$("#targetOPTypeOptions").hide();
					break;
			}

			//document.getElementById("targetOPTypeOptions").innerHTML = innerHTMl;
		},

		run: function () {
			console.log("----- CALCULATING TARGET ORBITAL PERIOD -----");
			const hours = $("#targetOPH").val() * 1 || 0;
			const minutes = $("#targetOPM").val() * 1 || 0;
			const seconds = $("#targetOPS").val() * 1 || 0;
			const orbitalPeriod = (hours * 60 * 60) + (minutes * 60) + seconds;

			console.log("Orbital period: " + orbitalPeriod + " seconds");

			const sma = tools.targetOrbitalPeriod(orbitalPeriod);

			let apoapsis = 0;
			let periapsis = 0;
			switch (type) {
				case "circular":
					apoapsis = tools.circularFromSMA(sma);
					periapsis = apoapsis;
					break;
				case "elliptical":
					apoapsis = $("#targetOPOption").val() * 1 || 0;
					periapsis = tools.ellipticalFromSMA(sma, apoapsis);
					break;
			};

			const max = Math.max(apoapsis, periapsis);
			periapsis = Math.min(apoapsis, periapsis);
			apoapsis = max;

			//document.getElementById("targetOPOutput").innerHTML = "Apoapsis: " + tools.cleanNumber(apoapsis) + " km <br>Periapsis: " + tools.cleanNumber(periapsis) + " km";
			$("#targetOPOutput").html("Apoapsis: " + tools.cleanNumber(apoapsis) + " km <br>Periapsis: " + tools.cleanNumber(periapsis) + " km");

			console.log("Apoapsis: " + apoapsis + " km");
			console.log("Periapsis: " + periapsis + " km");

			console.log("----- END -----");
		}
	}
})();