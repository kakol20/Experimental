// Old code
var medianIQR = function()
{
	var isDecimal = function(a)
	{
		if ((a % 1) === 0)
		{
			return false;
		}
		else
		{
			return true;
		}
	};

	var createList = function()
	{
		var a = "";

		for (var i = 0; i < 50; i++)
		{
			if (i === 0)
			{
				a = a + key.round(key.random(50, 1));
			}
			else
			{
				a = a + ", " + key.round(key.random(50, 1));
			}
		}
		return a;
	};
	var toArray = function(a)
	{
		var b = a.split(', ');
		var c = [];
		for (var i = 0; i < b.length; i++)
		{
			c.push(parseInt(b[i]));
		}
		return c;
	}

	var initial = document.getElementById('IQRInput').value || createList();
	var array = toArray(initial);
	console.log(array);

	var t0 = performance.now();

	var q1 = key.round(array[key.round(((array.length / 4) - 1), "up")], "nearest", 1);
	var q3 = key.round(array[key.round((((array.length * 3) / 4) - 1), "up")], "nearest", 1);
	var iqr = key.round(q3 - q1, "nearest", 1);

	var nthValueInArray = (array.length - 1) / 2;

	var median = 0;

	if (isDecimal(nthValueInArray))
	{
		median = key.round((array[key.round(nthValueInArray, "down")] + array[key.round(nthValueInArray, "up")]) / 2, "nearest", 1);
	}
	else
	{
		median = key.round(array[nthValueInArray], "nearest", 1);
	}

	array.sort(key.sortAscending);

	var maxArray = key.round(array[array.length - 1], "nearest", 1);
	var minArray = key.round(array[0], "nearest", 1);

	var output = "The median is " + median + "<br>Q1 is " + q1 + "<br>Q3 is " + q3 + "<br>The interquartile range is " + iqr + "<br>The max is " + maxArray + "<br>The min is " + minArray;

	document.getElementById('IQROutput').innerHTML = output;

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

var approximateSqrt = function()
{
	//https://www.youtube.com/watch?v=PJHtqMjrStk

	var num = document.getElementById('sqrtOf').value || key.round(key.random(Math.PI * 100));

	var t0 = performance.now();

	var approximate = key.approxSqrt(num);

	var actual = Math.sqrt(num);
	console.log("Actual value: " + key.round(actual, "nearest", 4));

	var percentOff = key.round((Math.abs(actual - approximate) / actual) * 100, "nearest", 4);

	document.getElementById('approxSqrtOutput').innerHTML = "The approximate square root of " + num + " is " + key.round(approximate, "nearest", 4) + " and it was " + percentOff + "% off the real value";

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

var averages = function()
{
	var isInt = function(a)
	{
		if ((a % 1) === 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	};
	var mode = function(a)
	{
		var b = [];
		for (var i = 0; i < a.length; i++)
		{
			b.push(a[i]);
		}
		/*
		b = key.countDupes(b);
		var c = [];
		for (var i = 0; i < b[1].length; i++) {
		    c.push(b[1][i]);
		}
		c.sort(key.sortDescending);
		return b[0][b[1].indexOf(c[0])];
		*/

		var c = (key.countDupes(b)).sort(function(a, b)
		{
			return b[1] - a[1]
		});
		console.log(c);
		return parseInt(c[0][0]);

	};
	var median = function(a)
	{
		var b = a.sort(key.sortAscending);
		var c = [];
		for (var i = 0; i < b.length; i++)
		{
			c.push(b[i]);
		}
		if (c.length == 1)
		{
			return c[0];
		}
		else if (c.length == 2)
		{
			return (c[0] + c[1]) / 2;
		}
		else
		{
			c.splice(c.length - 1, 1);
			c.splice(0, 1);
			return median(c);
		}
	};
	var mean = function(a)
	{
		var b = 0;
		for (var i = 0; i < a.length; i++)
		{
			b += a[i];
		}
		return key.round(b / a.length, "nearest", 2);
	};

	var createList = function()
	{
		var a = "";

		for (var i = 0; i < 50; i++)
		{
			if (i === 0)
			{
				a = a + key.round(key.random(50, 1));
			}
			else
			{
				a = a + ", " + key.round(key.random(50, 1));
			}
		}
		return a;
	};
	var toArray = function(a)
	{
		var b = a.split(", ");
		var c = [];
		for (var i = 0; i < b.length; i++)
		{
			c.push(parseInt(b[i]));
		}
		return c;
	};

	var initial = document.getElementById('averagesInput').value || createList();
	var list = toArray(initial);
	console.log(list);

	var t0 = performance.now();

	document.getElementById('avgOutput').innerHTML = "Mode: " + mode(list) + "<br>Median: " + median(list) + "<br>Mean: " + mean(list);

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

var monteCarlo = function()
{
	var max = Math.abs(document.getElementById('monteCarloMax').value) || 1;
	var rep = Math.abs(document.getElementById('monteCarloRep').value) || Number(key.random(5000000, 500000).toPrecision(3));

	var output = "";

	var t0 = performance.now();

	if (!key.isValidNumber(max) || !key.isValidNumber(rep))
	{
		output = "An input is invalid";
	}
	else
	{
		var total = 0;
		var inCircle = 0;

		for (var i = 0; i < rep; i++)
		{
			var xValue = key.random(max, max * -1);
			var yValue = key.random(max, max * -1);
			if ((Math.pow(xValue, 2) + Math.pow(yValue, 2)) <= Math.pow(max, 2))
			{
				inCircle++;
				total++;
			}
			else
			{
				total++;
			}
		}
		var estimate = (inCircle / total) * 4;
		var percentOff = Number(((Math.abs(estimate - Math.PI) / Math.PI) * 100).toPrecision(4));
		output = "Total: " + total + "<br>In Circle: " + inCircle + "<br>Estimate: " + Number(estimate.toPrecision(9)) + "<br>Percentage Off: " + percentOff + "%";
	}
	document.getElementById('monteCarloOutput').innerHTML = output;

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

var happyNumbers = function()
{
	var out = function(units, result)
	{
		var a = "";
		for (var i = 0; i < units.length; i++)
		{
			/*
			if (i === 0) {
			    a = units[i] + "<sup>2</sup> ";
			} else {
			    a = a + "+ " + units[i] + "<sup>2</sup> ";
			}
			*/
			if (i === 0)
			{
				a = a + units[i] + "^2 ";
			}
			else
			{
				a = a + "+ " + units[i] + "^2 ";
			}
		}
		return a + "=" + result;
	};
	var isHappyNumber = function(num)
	{
		var output = '';

		if (!key.isValidNumber(num))
		{
			return [false, "NaN"];
		}
		else
		{
			var b = [];
			var c = Number(num);
			while (true)
			{
				var d = (c.toString()).split('');
				var e = 0;
				for (var i = 0; i < d.length; i++)
				{
					e += Math.pow(Number(d[i]), 2);
				}
				if (e === 1)
				{
					output = output + out(d, e);
					return [true, "$$" + output + "$$"];
				}
				else if (b.indexOf(e) > -1)
				{
					output = output + out(d, e);
					return [false, "$$ " + output + " $$"];
				}
				b.push(e);
				c = e;
				output = output + out(d, e) + "\\\\";;
			}
		}
	};

	var number = key.round(document.getElementById('happyNumbersInput').value) || key.round(key.random(Math.PI * 100, 5));

	var t0 = performance.now();

	if (isHappyNumber(number)[0])
	{
		document.getElementById('happyNumbersOutput').innerHTML = isHappyNumber(number)[1] + number + " is a happy number";
	}
	else
	{
		document.getElementById('happyNumbersOutput').innerHTML = isHappyNumber(number)[1] + number + " is not a happy number";
	}
	key.loadMathJax("happyNumbersOutput");

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

var lcmAtoB = function()
{
	alert("Bigger numbers will take longer time to execute. A recommended max number is 214 600");
	// http://pastebin.com/RBa0HpWj - 39 466
	// https://pastebin.com/PfMQkpsM - 214 600

	var gcd = function(a, b)
	{
		a = a.abs();
		b = b.abs();
		while (true)
		{
			if ((bigInt.min(a, b)).equals(0))
			{
				return bigInt.max(a, b);
			}
			else
			{
				var temp = bigInt.max(a, b);
				a = bigInt.min(a, b);
				b = temp.mod(a);
			}
		}
	};
	var lcm = function(a, b)
	{
		return (a.multiply(b)).divide(gcd(a, b));
	};

	var a = document.getElementById('lcmA').value || key.round(key.random(214600, 1));
	a = bigInt(a);
	var b = document.getElementById('lcmB').value || key.round(key.random(214600, 1));
	b = bigInt(b);

	var t0 = performance.now();

	var result = bigInt(1);
	var temp = bigInt.max(a, b);
	b = bigInt.min(a, b);
	a = temp;

	for (var i = b; i.lesserOrEquals(a); i = i.next())
	{
		result = lcm(result, i);
	}
	result = result.toString();

	var output = "Smallest Number Divisible By All Numbers Between " + key.numberOutput(b.toString()) + " & " + key.numberOutput(a.toString()) + " is: " + key.numberOutput(result) + "<br>Length: " + key.numberOutput((result.length).toString());
	document.getElementById('lcmOutput').innerHTML = output;

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