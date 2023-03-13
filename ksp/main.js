class Body {
	constructor(sgp, sgpPow, radius, rotPeriod) {
		this.sgp = new Decimal(sgp);
		let pow = new Decimal(10).pow(sgpPow - 9);

		this.sgp = this.sgp.mul(pow);

		this.radius = new Decimal(radius); // in km
		this.rotPeriod = new Decimal(rotPeriod); // in seconds
	}
};

const tools = (function () {
	return {
		updateBody: function () {
			this.orbitBody = document.getElementById("orbitBody").value || "kerbin";

			console.log("Orbit Body changed to: " + this.orbitBody);
		},
		orbitBody: "kerbin",

		bodies: new Map()
	};
})();

// Runs script when page is loaded or reloaded
$(function () {
	console.log("Script by kakol20");
	console.log("-----");
	//console.log("");

	tools.bodies.set("kerbin", new Body(3.5316, 12, 600, 21549.425));
	tools.bodies.set("mun", new Body(new Decimal(6.5138398), 10, 200, 138984.38));
});