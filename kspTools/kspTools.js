var gravConverter = function()
{
	var a = parseFloat(document.getElementById('gravNum').value) || 1;
	var b = parseFloat(document.getElementById('gravPow').value) || 1;

	b -= 9;

	var aD = new Decimal(a);

	if (b > 0)
	{
		for (var i = 0; i < b; i++)
		{
			aD = aD.mul(10);
		}
	}
	else if (b < 0)
	{
		for (var i = 0; i < Math.abs(b); i++)
		{
			aD = aD.div(10);
		}
	}

	// console.log()

	// document.getElementById('gravOutput').innerHTML = a * Math.pow(10, b - 9);
	document.getElementById('gravOutput').innerHTML = bigDecimal.getPrettyValue(aD.toString()) + ' km&sup3/s&sup2';
}

var calculateAltitude = function()
{
	// var time = document.getElementById('orbitTime').value * 60 || 5400;
	var time = (parseFloat(document.getElementById('orbitHours').value) || 0) * 60 * 60;
	time += (parseFloat(document.getElementById('orbitMinutes').value) || 0) * 60;
	time += parseFloat(document.getElementById('orbitSeconds').value) || 0;
	var mu = document.getElementById('orbitPara').value || 3531.6;
	var radius = document.getElementById('orbitRadius').value || 600;

	// https://github.com/MikeMcl/decimal.js/
	var tau = new Decimal(Math.PI);
	tau = tau.mul(2);

	var result = new Decimal(time === 0 ? 1 : time);
	result = result.div(tau);
	result = result.mul(result);
	result = result.mul(mu);

	var third = new Decimal(1);
	third = third.div(3);

	result = result.pow(third);
	result = result.sub(radius);

	// console.log();

	// https://forum.kerbalspaceprogram.com/index.php?/topic/64230-calculating-altitude-for-given-orbital-period/
	// 	a = ((T/2pi)^2 * mu)^1/3

	// That's how I have it in my quick orbit calculator.

	// Note, however, that a is the semi-major axis, not the orbital height. For that you have to substract the radius of the body you are orbiting.
	console.log(bigDecimal.getPrettyValue(result.toString()));

	document.getElementById('orbitOutput').innerHTML = bigDecimal.getPrettyValue(result.toDecimalPlaces(4)) + ' km';
}
