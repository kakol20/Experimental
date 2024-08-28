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
			// this.bodyInfo += 'Sphere of Influence: N/A or infinite<br>';
		}
	}
};

const tools = (function () {
	return {
		orbitBody: 'Kerbin',
		bodies: new Map(),

		updateBody: function () {
			this.orbitBody = $('#orbitBody').val() || 'Kerbin';
			$('#bodyInfo').html(tools.getBody().bodyInfo);

			console.log('Orbit Body changed to: ' + this.orbitBody);
		},

		getBody: function () {
			return this.bodies.get(this.orbitBody);
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
$(function () {
	console.log('Script by kakol20');
	console.log('-----');
	//console.log('');

	// tools.bodies.set('kerbin', new Body(3.5316, 12, 600, 21549.425, 84159.286));
	$.getJSON('bodies.json', (data) => {
		// console.log(data);
		let formHTML = '';

		for (let i = 0; i < data.length; i++) {
			tools.bodies.set(data[i].name, new Body(data[i].sgp, data[i].sgpPower, data[i].radius, data[i].rotPeriod, data[i].soi));

			// <option value='Kerbin'>Kerbin</option>
			if (data[i].name === 'Kerbin') {
				formHTML += '<option selected=\"selected\" value=\"';
			} else {
				formHTML += '<option value=\"';
			}
			formHTML += data[i].name + '\">' + data[i].name + '</option>\n';
		}

		console.log(tools.bodies);
		// console.log(formHTML);
		// console.log(tools.getBody());

		$('#orbitBody').html(formHTML);

		tools.updateBody();
		targetOrbitalPeriod.updateType();
		resonant.showAlt();
		// dataCopy = [...data];
	}).fail(() => {
		console.log('Failed to read bodies.json')
	});

});
