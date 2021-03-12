var gravConverter = function()
{
	var a = document.getElementById('gravNum').value || 1;
	var b = document.getElementById('gravPow').value || 1;

	b -= 9;

	if (b > 0)
	{
		for (var i = 0; i < b; i++)
		{
			a *= 10;
		}
	}
	else if (b < 0)
	{
		for (var i = 0; i < Math.abs(b); i++)
		{
			a /= 10;
		}
	}

	// document.getElementById('gravOutput').innerHTML = a * Math.pow(10, b - 9);
	document.getElementById('gravOutput').innerHTML = a + ' km&sup3/s&sup2';
}

var calculateAltitude = function()
{
	var time = document.getElementById('orbitTime').value * 60 || 5400;
	var mu = document.getElementById('orbitPara').value || 3531.6;
	var radius = document.getElementById('orbitRadius').value || 600;

	// https://forum.kerbalspaceprogram.com/index.php?/topic/64230-calculating-altitude-for-given-orbital-period/
	// 	a = ((T/2pi)^2 * mu)^1/3

	// That's how I have it in my quick orbit calculator.

	// Note, however, that a is the semi-major axis, not the orbital height. For that you have to substract the radius of the body you are orbiting.

	document.getElementById('orbitOutput').innerHTML = (Math.pow(Math.pow(time / (2 * Math.PI), 2) * mu, 1 / 3) - radius) + ' km';
}