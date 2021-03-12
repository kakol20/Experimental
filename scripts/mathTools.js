var getPrimes = function()
{
	var min = Math.abs(document.getElementById('primesMin').value) || key.random(Math.PI * 10);
	var max = Math.abs(document.getElementById('primesMax').value) || key.random(Math.PI * 100, min);
	var minNmax = [min, max];
	minNmax.sort(key.sortAscending);

	var t0 = performance.now();

	var primes = [];
	for (var i = key.round(minNmax[0], "up"); i <= key.round(minNmax[1], "down"); i++)
	{
		if (i >= 2)
		{
			if (key.isPrime(i))
			{
				primes.push(i);
			}
		}
	}

	var output = "";
	for (var i = 0; i < primes.length; i++)
	{
		if (i > 0)
		{
			output = output + ", " + primes[i].toString();
		}
		else
		{
			output = output + primes[i].toString();
		}
	}

	document.getElementById('primes').innerHTML = output;
	console.log("Min: " + min);
	console.log("Max: " + max);
	console.log("Length: " + primes.length);

	var t1 = performance.now();
	var t = Math.abs(t1 - t0);
	/*
	if (t >= 1000) {
	    console.log("Took: " + key.round(t / 1000, "nearest", 4) + "s");
	} else {
	    console.log("Took: " + t.toPrecision(5) + "ms");
	}
	*/
	console.log(t >= 1000 ? "Took: " + key.round(t / 1000, "nearest", 4) + "s" : "Took: " + t.toPrecision(5) + "ms");
	console.log(" ");
};

var iteration = function()
{ // https://en.wikipedia.org/wiki/Newton's_method
	// ax³ + bx² + cx + d
	var output = "";

	var formula = function(x, a, b, c, d)
	{
		return (a * Math.pow(x, 3)) + (b * Math.pow(x, 2)) + (c * x) + d;
	};
	var derivative = function(x, a, b, c, d)
	{
		d = d || 0;
		return (3 * a * Math.pow(x, 2)) + (2 * b * x) + c;
	};
	var newtonMethod = function(x, a, b, c, d)
	{
		return x - (formula(x, a, b, c, d) / derivative(x, a, b, c));
	};

	var a = key.round(parseFloat(document.getElementById('iterationA').value)) || key.round(key.random(10, -10));
	while (a === 0)
	{
		a = key.round(key.random(10, -10));
	}
	var b = key.round(parseFloat(document.getElementById('iterationB').value)) || key.round(key.random(10, -10));
	while (b === 0)
	{
		b = key.round(key.random(10, -10));
	}
	var c = key.round(parseFloat(document.getElementById('iterationC').value)) || key.round(key.random(10, -10));
	while (c === 0)
	{
		c = key.round(key.random(10, -10));
	}
	var d = key.round(parseFloat(document.getElementById('iterationD').value)) || key.round(key.random(10, -10));
	while (d === 0)
	{
		d = key.round(key.random(10, -10));
	}

	if (a === 1)
	{
		output = "$$ \\mathrm{Equation} \\rightarrow x^3 ";
	}
	else if (a === -1)
	{
		output = "$$ \\mathrm{Equation} \\rightarrow -x^3 ";
	}
	else
	{
		output = "$$ \\mathrm{Equation} \\rightarrow " + a + "x^3 ";
	}
	if (b > 0)
	{
		if (b === 1)
		{
			output = output + "+ x^2 ";
		}
		else
		{
			output = output + "+ " + b + "x^2 ";
		}
	}
	else
	{
		if (b === -1)
		{
			output = output + "- x^2 ";
		}
		else
		{
			output = output + "- " + Math.abs(b) + "x^2 ";
		}
	}
	if (c > 0)
	{
		if (c === 1)
		{
			output = output + "+ x ";
		}
		else
		{
			output = output + "+ " + c + "x ";
		}
	}
	else
	{
		if (c === -1)
		{
			output = output + "- x ";
		}
		else
		{
			output = output + "- " + Math.abs(c) + "x ";
		}
	}
	if (d > 0)
	{
		output = output + "+ " + d + " \\\\ ";
	}
	else
	{
		output = output + "- " + Math.abs(d) + " \\\\ ";
	}

	var t0 = performance.now();

	var startNumber = parseFloat(document.getElementById('iterationStart').value) || key.round(key.random(100, -100));
	var decimalPlaces = key.round(parseFloat(document.getElementById('iterationDecimalPlaces').value)) || key.round(key.random(4, 2));

	output = output + " \\mbox{Decimal Places} \\rightarrow " + decimalPlaces + " \\\\ x_0 = " + startNumber + " \\\\ ";

	if (!key.isValidNumber(startNumber) || !key.isValidNumber(decimalPlaces))
	{
		output = "One of the inputs is invalid";
	}
	else
	{
		var x = [startNumber, key.round(newtonMethod(startNumber, a, b, c, d), "nearest", decimalPlaces + 1)];
		while (key.round(x[x.length - 1], "nearest", decimalPlaces) !== key.round(x[x.length - 2], "nearest", decimalPlaces))
		{
			x.push(key.round(newtonMethod(x[x.length - 1], a, b, c, d), "nearest", decimalPlaces + 1));

			if (x.length >= 1000)
			{
				break;
			}
		}
		console.log(x);

		var iterations = x.length - 1;

		if (x.length >= 1000)
		{
			var temp = key.countDupes(x);
			temp.sort(function(a, b)
			{
				return b[1] - a[1];
			});
			console.log(temp);

			if ((temp[0][1] > 1) && (temp[1][1] > 1))
			{
				output = "It is impossible to do with the given start number <br>";
			}
			else
			{
				output = "It will take too long <br>";
			}
		}
		else
		{
			output = output + " \\text{Root} \\rightarrow " + key.round(x[x.length - 1], "nearest", decimalPlaces) + " \\\\ ";
			if (iterations > 1)
			{
				output = output + " \\mbox{Took } " + iterations + " \\mbox{ iterations} \\\\ ";
			}
			else
			{
				output = output + " \\mbox{Took one iteration} \\\\ ";
			}

			var noOfIterations = x.length - 1;

			var root_ = key.round(x[x.length - 1], "nearest", decimalPlaces);
			// console.log("Root: " + root_);
			var root_Value = formula(root_, a, b, c, d);
			// console.log("root_Value = " + root_Value);

			var low = key.round(((root_ * Math.pow(10, decimalPlaces)) - 0.5) / Math.pow(10, decimalPlaces), "nearest", decimalPlaces + 1);
			// console.log("Low: " + low);
			var lowValue = formula(low, a, b, c, d);
			// console.log("lowValue = " + lowValue);

			var high = key.round(((root_ * Math.pow(10, decimalPlaces)) + 0.5) / Math.pow(10, decimalPlaces), "nearest", decimalPlaces + 1);
			// console.log("High: " + high);
			var highValue = formula(high, a, b, c, d);
			// console.log("highValue = " + highValue);

			output = output + "f(" + low + ") = " + lowValue + " \\\\ f(" + root_ + ") = " + root_Value + " \\\\ f(" + high + ") = " + highValue + " $$";
		}
	}

	document.getElementById('iterationOutput').innerHTML = output;
	key.loadMathJax("iterationOutput");

	var t1 = performance.now();
	var t = Math.abs(t1 - t0);
	/*
	if (t >= 1000) {
	    console.log("Took: " + key.round(t / 1000, "nearest", 4) + "s");
	} else {
	    console.log("Took: " + t.toPrecision(5) + "ms");
	}
	*/
	console.log(t >= 1000 ? "Took: " + key.round(t / 1000, "nearest", 4) + "s" : "Took: " + t.toPrecision(5) + "ms");
	console.log(" ");
};

var carmichael = function()
{
	alert("Bigger numbers and bigger gap between minimum and maximum means it will take longer to find the Carmichael numbers");
	var t0 = performance.now();

	var fermatLittleThereom = function(p)
	{
		for (var i = 2; i <= 5; i++)
		{
			if (!bigInt(i).pow(p).subtract(i).isDivisibleBy(p))
			{
				return false;
			}
		}
		return true;
	};

	var isCarmichael = function(p)
	{
		if (fermatLittleThereom(p))
		{
			if (!bigInt(p).isPrime())
			{
				return true;
			}
		}
		return false;
	};

	var min = document.getElementById('carmichaelMin').value || key.round(key.random(1111, 1));
	// console.log(min);
	var max = document.getElementById('carmichaelMax').value || key.round(key.random(min + (Math.PI * 1000), min + (Math.PI * 100)));
	// console.log(max);

	var t0 = performance.now();

	var numbers = [];
	for (var i = min.toString(); bigInt(max.toString()).greaterOrEquals(i); i = bigInt(i).next().toString())
	{
		if (isCarmichael(i))
		{
			numbers.push(i);
		}
	}

	var output = "";
	if (numbers.length === 0)
	{
		output = "No Carmichael Numbers where found";
	}
	else
	{
		for (var i = 0; i < numbers.length; i++)
		{
			if (i === 0)
			{
				output = numbers[i].toString();
			}
			else
			{
				output = output + ", " + numbers[i];
			}
		}
	}

	document.getElementById('carmichaelOutput').innerHTML = output;
	var t1 = performance.now();
	var t = Math.abs(t1 - t0);
	/*
	if (t >= 1000) {
	    console.log("Took: " + key.round(t / 1000, "nearest", 4) + "s");
	} else {
	    console.log("Took: " + t.toPrecision(5) + "ms");
	}
	*/
	console.log(t >= 1000 ? "Took: " + key.round(t / 1000, "nearest", 4) + "s" : "Took: " + t.toPrecision(5) + "ms");
	console.log(" ");
};

var normalDistribution = function()
{
	var normalCDF = function(a)
	{
		/* Old way of estimation normal cdf
		var b = 1 / (1 + 0.2316419 * Math.abs(a));
		var c = 0.3989423 * Math.exp(-a * a / 2);
		var d = c * b * (0.3193815 + b * (-0.3565638 + b * (1.781478 + b * (-1.821256 + b * 1.330274))));
		if (a > 0) {
		    d = 1 - d;
		}
		return d;
		*/

		var b = 1.66355041031415 * -1 * a;
		return 1 / (1 + Math.exp(b));
	};
	var calculate = function(a, b, c)
	{
		var d = 0;
		c = Math.abs(c);

		/*
		if (c === 0) {
		    if (a < b) {
		        d = 0;
		    } else {
		        d = 1;
		    }
		} else {
		    d = normalCDF((a - b) / c);
		}
		*/

		d = c === 0 ? (a < b ? 0 : 1) : normalCDF((a - b) / c);

		return d;
	};

	var mean = document.getElementById('ndfMean').value || key.random(Math.PI * 10, Math.PI * (-10));

	var sd;
	if ((mean > 0) || (mean < 0))
	{
		//Standard Deviation cannot be a negative number
		sd = Math.abs(document.getElementById('ndfSD').value) || key.random(Math.abs(mean) / 10);
	}
	else
	{
		sd = Math.abs(document.getElementById('ndfSD').value) || 1;
	}

	var val = document.getElementById('ndfValue').value || key.random(mean + (sd * 4), mean - (sd * 4));

	var t0 = performance.now();

	var result = key.round(calculate(val, mean, sd), "nearest", 4);

	val = key.round(val, "nearest", 2);
	mean = key.round(mean, "up", 2);

	document.getElementById('ndfOutput').innerHTML = "$$X \\sim N(" + mean + ", " + key.round(sd, "nearest", 2) + "^2) \\rightarrow P(X < " + val + ") = " + result + "$$";
	key.loadMathJax("ndfOutput");

	console.log("P(Z < " + key.round((val - mean) / sd, "nearest", 2) + ")");

	var t1 = performance.now();
	var t = Math.abs(t1 - t0);
	/*
	if (t >= 1000) {
	    console.log("Took: " + key.round(t / 1000, "nearest", 4) + "s");
	} else {
	    console.log("Took: " + t.toPrecision(5) + "ms");
	}
	*/
	console.log(t >= 1000 ? "Took: " + key.round(t / 1000, "nearest", 4) + "s" : "Took: " + t.toPrecision(5) + "ms");
	console.log(" ");
};