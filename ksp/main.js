class Body {
	constructor(sgp, sgpPow, radius, rotPeriod, soi) {
		this.sgp = sgp * Math.pow(10, sgpPow - 9);

		this.radius = radius; // in km
		this.rotPeriod = rotPeriod; // in seconds

		this.syncOrbit = Math.cbrt((this.rotPeriod * this.rotPeriod * this.sgp) / (4 * Math.PI * Math.PI));
		this.syncOrbit -= this.radius;

		const semiPeriod = this.rotPeriod / 2.0;
		this.semiSyncOrbit = Math.cbrt((semiPeriod * semiPeriod * this.sgp) / (4 * Math.PI * Math.PI));
		this.semiSyncOrbit -= this.radius;

		this.soi = soi;

		// ----- SAVE BODY INFO IN HTML FORM -----
		this.bodyInfo = 'Equatorial Radius: ' + tools.cleanNumber(this.radius) + ' km<br>';

		// tools.cleanPeriod(this.rotPeriod)
		let span = '<span title=\"' + tools.cleanNumber(this.rotPeriod) + ' seconds\">' + tools.cleanPeriod(this.rotPeriod) + '</span>';

		this.bodyInfo += 'Standard Gravitational Parameter: ' + tools.cleanNumber(this.sgp) + ' km<sup>3</sup>/s<sup>-2</sup><br>';
		this.bodyInfo += 'Sidereal Rotational Period: ' + span + '<br>';
		this.bodyInfo += 'Synchronous Orbit: ' + tools.cleanNumber(this.syncOrbit) + ' km<br>';
		this.bodyInfo += 'Semi-synchronous Orbit: ' + tools.cleanNumber(this.semiSyncOrbit) + ' km<br>';
		// this.bodyInfo += 'Sphere of Influence: ' + tools.cleanNumber(this.soi) + ' km<br>';

		if (this.soi != "N/A" || !isNaN(this.soi)) {
			this.bodyInfo += 'Sphere of Influence: ' + tools.cleanNumber(this.soi) + ' km<br>';
		} else {
			//this.bodyInfo += 'Sphere of Influence: N/A or infinite<br>';
		}
	}
};

const tools = (function () {
	return {
		orbitBody: 'Kerbin',
		bodies: new Map(),

		chosenSystem: 'Stock',
		systems: new Map(),

		updateBody: function () {
			this.orbitBody = $('#orbitBody').val() || this.getSystem().default;
			$('#bodyInfo').html(tools.getBody().bodyInfo);

			console.log('Orbit Body changed to', this.orbitBody);
		},

		updateSystem: function () {
			this.chosenSystem = $('#orbitSystem').val() || 'Stock';
			this.orbitBody = this.getSystem().default;

			$('#orbitBody').html(this.getSystem().formHTML);

			this.bodies = this.getSystem().bodies;

			console.log('System changed to', this.chosenSystem);
			this.updateBody();

			console.log('tools.bodies', this.bodies);
		},

		getBody: function () {
			return this.bodies.get(this.orbitBody);
		},

		getSystem: function() {
			return this.systems.get(this.chosenSystem);
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
			let output = '';

			const seconds = accumulated % 60;
			accumulated -= seconds;
			accumulated /= 60;

			const minutes = accumulated % 60;
			accumulated -= minutes;
			accumulated /= 60;

			const hours = accumulated % 24;
			accumulated -= hours;
			accumulated /= 24;

			const days = this.cleanNumber(accumulated);

			// output = days + 'd, ';
			if (days != '0') {
				output = days + 'd, ';
			}
			output += hours + 'h, ';
			output += String(minutes) + 'm, ';
			output += Decimal(seconds).toDecimalPlaces(4) + 's';

			return output;
		},

		cleanNumber: function (number) {
			return number.toLocaleString('en-UK', { style: 'decimal', maximumFractionDigits: 4 });
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
		},

		changeInclination: function (velocity, start, end) {
			let delta = Math.abs(this.degreesToRadians(start) - this.degreesToRadians(end));

			return Math.abs(Math.sin(delta / 2) * velocity) * 2;
		},
		degreesToRadians: function (degrees) {
			return degrees * (Math.PI / 180.0);
		}
	};
})();

// Runs script when page is loaded or reloaded
$(async function () {
	console.log('Script by kakol20');
	console.log('-----');

	try {
		const systemResponse = await fetch('systems.json');
		if (!systemResponse.ok) throw new Error('Failed to fetch systems.json');

		const systemData = await systemResponse.json();
		console.log('systemData', systemData);

		let formHTML = '';
		for (let i = 0; i < systemData.systems.length; ++i) {
			// console.log(systemData.systems[i]);
			let system = {
				bodies: new Map(),
				default: systemData.systems[i].default,
				formHTML: ''
			};

			const bodiesResponse = await fetch(systemData.systems[i].json);
			if (!bodiesResponse.ok) throw new Error(`Failed to fetch ${systemData.systems[i].json}`);

			const bodiesData = await bodiesResponse.json();
			// console.log(bodiesData);

			for (let j = 0; j < bodiesData.length; ++j) {
				system.bodies.set(
					bodiesData[j].name,
					new Body(
						bodiesData[j].sgp,
						bodiesData[j].sgpPower,
						bodiesData[j].radius,
						bodiesData[j].rotPeriod,
						bodiesData[j].soi
					)
				);

				if (bodiesData[j].name === system.default) {
					system.formHTML += `<option selected="selected" value="${bodiesData[j].name}">`;
				} else {
					system.formHTML += `<option value="${bodiesData[j].name}">`;
				}

				system.formHTML += `${bodiesData[j].name}</option>\n`;
			}
			// console.log(system);

			if (systemData.systems[i].name === systemData.default) {
				formHTML += `<option selected="selected" value="${systemData.systems[i].name}">`;
			} else {
				formHTML += `<option value="${systemData.systems[i].name}">`;
			}
			formHTML += `${systemData.systems[i].name}</option>\n`;

			tools.systems.set(
				systemData.systems[i].name,
				system
			);
		}
		console.log('tools.systems', tools.systems);
		console.log('orbitSystem', formHTML);
		tools.chosenSystem = systemData.default;

		$('#orbitSystem').html(formHTML);

		tools.updateSystem();
	} catch (err) {
		console.error(err);
	}
});
