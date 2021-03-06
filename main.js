/*
Notes: {
    Use parseInt("Text") to turn into number:
        var a = "18";
        var b = parseInt(a) + 2;

        result of b: 20
        
    Use var.split(',') to turn into list:
        var a = "a,b,c,d,e,f,g";
        var b = a.split(',');

        result of b: [a,b,c,d,e,f,g];
        
    Use "<br>" to split lines in div:
        var a = "a" + "<br>";
        var b = "b" + "<br>";
        var c = "c";
        document.getElementById('main').innerHTML = a + b + c;

        result Output:
            a
            b
            c

    Use number.toString(16) to convert decimal to hex:
        var a = 69;
        var b a.toString(16);

        result of b: 45;

    Use parseInt(hex, 16) to convert hex to decimal:
        var a = 45;
        var b = parseInt(a, 16);

        result of b: 69;

    Use array.reverse() to reverse list:
        var a = [2,3,1];
        a.reverse();

        result of a: [1,3,2];

    Use n.toPrecision(x) to round number in x significant figures:
        var a = 3.14159265;
        var b = a.toPrecision(4);

        result of b: 3.142;
    
    Standard Index Form:
        a * 10^b
        a - Coefficient
        b - Exponent
        var c = 0.0054;
        var exponent = key.round(Math.log(c) / Math.log(10), "down");
        var coefficient = c * Math.pow(10, -1 * exponent);

        result of exponent: -3
                  coefficient: 5.4 

    Use Number(string) to turn into a number
        var a = "3.14159265";
        var b = Number(a);

        result of b: 3.14159265

    http://stackoverflow.com/questions/34599303/javascript-sort-list-of-lists-by-sublist-second-entry

    Use array.splice(index, 1) to delete array[index]
        var a = [1, 2, 3];
        var b = a.splice(1, 1);

        result of b: [1, 3];
}
*/
var key = (function()
{
	return {
		isString: function(a)
		{
			return isNaN(a);
		},

		random: function(a, b)
		{
			b = b || 0;
			var c = a - b;
			return (Math.random() * c) + b;
		},

		round: function(a, b, c)
		{
			b = b || "nearest";
			c = c || 0;
			if (b == "down")
			{
				return Math.floor(a * Math.pow(10, c)) / Math.pow(10, c);
			}
			else if (b == "up")
			{
				return Math.ceil(a * Math.pow(10, c)) / Math.pow(10, c);
			}
			else
			{
				return Math.round(a * Math.pow(10, c)) / Math.pow(10, c);
			}
		},

		sortAscending: function(a, b)
		{
			return a - b;
			//array.sort(key.sortAscending);
		},
		sortDescending: function(a, b)
		{
			return b - a;
		},

		isPrime: function(a)
		{
			/*
			if (a < 2) {
			    return false;
			} else if (a == 2) {
			    return true;
			} else {
			    for (var i = 0; i <= Math.sqrt(a); i++) {
			        if (a % i === 0) {
			            return false;
			        }
			    }
			    return true;
			}
			*/

			var a = bigInt(a);
			if (a.lesser(2))
			{
				return false;
			}
			else if (a.equals(2))
			{
				return true;
			}
			else
			{
				for (var i = bigInt(2); i.lesserOrEquals(key.bigIntApproxSqrt(a)); i = i.next())
				{
					if ((a.mod(i)).equals(0))
					{
						return false;
					}
				}
				return true;
			}
		},

		// jQuery Needed       
		removeDupes: function(a)
		{
			var b = key.countDupes(a);
			var c = [];
			for (var i = 0; i < b.length; i++)
			{
				c.push(b[i][0]);
			}
			return c;
		},
		// https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
		countDupes: function(a)
		{
			var b = [];
			a.forEach(function(i)
			{
				b[i] = (b[i] || 0) + 1;
			});

			var c = [];
			for (const d in b)
			{
				c.push([`${d}`, parseInt(`${b[d]}`)]);
			}

			return c;
		},

		numberOutput: function(a)
		{
			var b = a.toString();
			var c = b.split("");
			c.reverse();
			var d = "";
			for (var i = 0; i < c.length; i++)
			{
				if ((i + 1) === c.length)
				{
					d = c[i] + d;
				}
				else if (((i + 1) % 3) === 0)
				{
					d = " " + c[i] + d;
				}
				else
				{
					d = c[i] + d;
				}
			}
			return d;
		},

		//http://stackoverflow.com/questions/6213227/fastest-way-to-convert-a-number-to-radix-64-in-javascript
		base64: (function()
		{
			return {
				base: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+/",

				fromNumber: function(a, clean)
				{
					clean = clean || "no";
					a = key.round(a, "down");
					if (!key.isValidNumber(a))
					{
						console.log("The input is not valid");
						return;
					}
					if (a < 0)
					{
						console.log("Can't represent negative numbers now");
						return;
					}
					var b;
					var c = a;
					var d = "";
					while (true)
					{
						b = c % 64;
						d = key.base64.base.charAt(b) + d;
						c = key.round(c / 64, "down");
						if (c === 0)
						{
							break;
						}
					}
					if (clean == "yes")
					{
						var e = d.split("");
						e.reverse();
						var f = "";
						for (var i = 0; i < e.length; i++)
						{
							if ((i + 1) == e.length)
							{
								f = e[i] + f;
							}
							else if (((i + 1) % 2) === 0)
							{
								f = " " + e[i] + f;
							}
							else
							{
								f = e[i] + f;
							}
						}
						return f;
					}
					else
					{
						return d;
					}
				},

				toNumber: function(a)
				{
					var b = [];
					if (!isNaN(a))
					{
						var c = a.toString();
						b = c.split("");
					}
					else
					{
						b = a.split("");
					}
					var d = [];
					for (var i = 0; i < b.length; i++)
					{
						if (b[i] !== " ")
						{
							d.push(b[i]);
						}
					}
					var e = 0;
					for (var i = 0; i < d.length; i++)
					{
						e = (e * 64) + key.base64.base.indexOf(d[i]);
					}
					return e;
				},

				test: function(a)
				{
					a = key.round(Math.abs(a), "down") || key.round(key.random(key.base64.toNumber("// //"), key.base64.toNumber(1000)));
					console.log("Number           : " + key.numberOutput(a));
					var b = key.base64.fromNumber(a, "yes");
					console.log("Number to Base-64: " + b);
					var c = key.base64.toNumber(b);
					console.log("Base-64 to Number: " + key.numberOutput(c));
					if (c !== a)
					{
						console.log("Test Failed");
					}
					console.log(" ");
				}
			};
		})(),

		isValidNumber: function(n)
		{
			return !(isNaN(Number(n)) || (n === null) || (Number(n) == Number.POSITIVE_INFINITY));
		},

		convertWeek: function(w)
		{
			var weekToConvert = w;
			var week = key.round(weekToConvert, "down");

			var dayToConvert = (weekToConvert - week) * 7;
			var day = key.round(dayToConvert, "down");

			var hourToConvert = (dayToConvert - day) * 24;
			var hour = key.round(hourToConvert, "down");

			var minuteToConvert = (hourToConvert - hour) * 60;
			var minute = key.round(minuteToConvert, "down");

			var second = key.round((minuteToConvert - minute) * 60, "nearest", 2);

			if (week == 1)
			{
				week = week + " week, ";
			}
			else
			{
				week = week + " weeks, ";
			}
			if (day == 1)
			{
				day = day + " day, ";
			}
			else
			{
				day = day + " days, ";
			}
			if (hour == 1)
			{
				hour = hour + " hour, ";
			}
			else
			{
				hour = hour + " hours, ";
			}
			if (minute == 1)
			{
				minute = minute + " minute and ";
			}
			else
			{
				minute = minute + " minutes and ";
			}
			if (second == 1)
			{
				second = second + " second";
			}
			else
			{
				second = second + " seconds";
			}

			var converted = [week, day, hour, minute, second];
			var output = "";
			for (var i = 0; i < converted.length; i++)
			{
				output = output + converted[i];
			}

			return output;
		},

		approxSqrt: function(a)
		{
			if (a < 0)
			{
				return NaN;
			}

			var b = a;
			var c = 1;

			while (true)
			{
				b = a - (c * c);

				if (b === 0)
				{
					break;
				}
				else if (b < 0)
				{
					c--;
					break;
				}
				else
				{
					c++;
				}
			}

			b = a - (c * c);
			return c + (b / (c * 2));
		},

		bigIntApproxSqrt: function(a)
		{
			if (a.lesserOrEquals(0))
			{
				return NaN;
			}

			var b = a;
			var c = bigInt(1);

			while (true)
			{
				b = a.subtract(c.square());

				if (b.equals(0))
				{
					break;
				}
				else if (b.lesser(0))
				{
					c = c.prev();
					break;
				}
				else
				{
					c = c.next();
				}
			}

			b = a.subtract(c.square());
			return c.add(b.divide(c.multiply(2)));
		},

		isNegative: function(a)
		{
			return Math.abs(a) == a ? false : true;
		},

		loadMathJax: function(idName)
		{
			var math = document.getElementById(idName);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]);
		},
	};
})();

// http://www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor - For future reference

// Runs script when page is loaded or reloaded
$(function()
{
	console.log("Script by kakol20");
});

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

var timeUntil = function()
{
	// http://ditio.net/2010/05/02/javascript-date-difference-calculation/

	var inWeeks = function(a, b)
	{
		var c = a.getTime();
		var d = b.getTime();
		return (c - d) / (7 * 24 * 60 * 60 * 1000);
	};
	var convertRound = function(a)
	{
		if (a > 0)
		{
			return key.round(a, "down");
		}
		else if (a < 0)
		{
			return key.round(a, "up");
		}
		else
		{
			return a;
		}
	};
	var isValidDate = function(a)
	{
		if (Object.prototype.toString.call(a) !== "[object Date]")
		{
			return false;
		}
		return !isNaN(a.getTime());
	};

	var date = document.getElementById('timeUntilInput').value || "random";

	var futureDate = new Date(date);
	var currentDate = new Date();

	if (!isValidDate(futureDate) || (futureDate.getTime() <= currentDate.getTime()))
	{
		var tempDate = new Date();

		var month = tempDate.getMonth() + 1;
		if (month <= 9)
		{
			month = "0" + month;
		}

		var days = tempDate.getDate();
		if (days <= 9)
		{
			days = "0" + days;
		}

		var year = tempDate.getFullYear() + 1;

		var hours = tempDate.getHours();
		if (hours <= 9)
		{
			hours = "0" + hours;
		}

		var minutes = tempDate.getMinutes();
		if (minutes <= 9)
		{
			minutes = "0" + minutes;
		}

		var tempDate1 = month + " " + days + ", " + year + " " + hours + ":" + minutes;
		tempDate1 = new Date(tempDate1);

		var randomisedDate = key.random(tempDate1.getTime(), currentDate.getTime());

		futureDate = new Date(randomisedDate);
	}

	var t0 = performance.now();

	currentDate = new Date();
	var output = key.convertWeek(inWeeks(futureDate, currentDate)) + " left until " + futureDate;
	document.getElementById('timeUntilOutput').innerHTML = output;

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

var timePast = function()
{
	var inWeeks = function(a, b)
	{
		var c = a.getTime();
		var d = b.getTime();
		return (c - d) / (7 * 24 * 60 * 60 * 1000);
	};
	var convertRound = function(a)
	{
		if (a > 0)
		{
			return key.round(a, "down");
		}
		else if (a < 0)
		{
			return key.round(a, "up");
		}
		else
		{
			return a;
		}
	};

	var isValideDate = function(a)
	{
		if (Object.prototype.toString.call(a) !== "[object Date]")
		{
			return false;
		}
		return !isNaN(a.getTime());
	};

	var date = document.getElementById('timePastInput').value || "random";

	var pastDate = new Date(date);
	var currentDate = new Date();

	if (!isValideDate(pastDate) || pastDate.getTime() >= currentDate.getTime())
	{
		var tempDate = new Date();

		var month = tempDate.getMonth() + 1;
		if (month <= 9)
		{
			month = "0" + month;
		}

		var days = tempDate.getDate();
		if (days <= 9)
		{
			days = "0" + days;
		}

		var year = tempDate.getFullYear() - 1;

		var hours = tempDate.getHours();
		if (hours <= 9)
		{
			hours = "0" + hours;
		}

		var minutes = tempDate.getMinutes();
		if (minutes <= 9)
		{
			minutes = "0" + minutes;
		}

		var tempDate1 = month + " " + days + ", " + year + " " + hours + ":" + minutes;
		tempDate1 = new Date(tempDate1);

		var randomisedDate = key.random(currentDate.getTime(), tempDate1.getTime());

		pastDate = new Date(randomisedDate);
	}

	var t0 = performance.now();

	currentDate = new Date();
	var output = key.convertWeek(inWeeks(currentDate, pastDate)) + " since " + pastDate;
	document.getElementById('timePastOutput').innerHTML = output;

	var t1 = performance.now();
	var dif = Math.abs(t1 - t0);
	console.log(dif >= 1000 ? "Took: " + key.round(dif / 1000, "nearest", 4) + "s" : "Took: " + dif.toPrecision(5) + "ms");
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

var morseConvert = function()
{
	var morseCode = (function()
	{
		return {
			code: ["/", ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---", ".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", ".----", "..---", "...--", "....-", ".....", "-....", "--...", "---..", "----.", "-----", "-.--.-", "-.--.-", "-....-", "--..--", ".-.-.-", "-..-.", "..--..", ".----."],
			letters: " ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890()-,./?'",

			fromSentence: function(a)
			{
				a = a.toUpperCase();
				var b = a.split("");
				var c = [];
				for (var i = 0; i < b.length; i++)
				{
					if ((morseCode.letters.indexOf(b[i]) <= -1) && (morseCode.letters.indexOf(b[i - 1]) > 0) && (morseCode.letters.indexOf(b[i + 1]) > 0))
					{
						c.push(" ");
					}
					else if (morseCode.letters.indexOf(b[i]) > -1)
					{
						c.push(b[i]);
					}
				}
				var d = "";
				for (var i = 0; i < c.length; i++)
				{
					var e = morseCode.code[morseCode.letters.indexOf(c[i])];
					if ((i + 1) == c.length)
					{
						d = d + e;
					}
					else
					{
						d = d + e + " ";
					}
				}
				return d;
			},

			toSentence: function(a)
			{
				var b = a.split(" ");
				var c = [];
				for (var i = 0; i < b.length; i++)
				{
					if (morseCode.code.indexOf(b[i]) > -1)
					{
						c.push(b[i]);
					}
				}
				var d = "";
				for (var i = 0; i < c.length; i++)
				{
					var e = morseCode.letters.charAt(morseCode.code.indexOf(c[i]));
					d = d + e;
				}
				return d;
			},

			test: function(a)
			{
				a = a || "Hello World";
				console.log("Sentence: " + a);
				var b = morseCode.fromSentence(a);
				console.log("Sentence to Morse Code: " + b);
				var c = morseCode.toSentence(b);
				console.log("Morse Code to Sentence: " + c);
				if (c !== a.toUpperCase())
				{
					console.log("Test Failed");
				}
				console.log(" ");
			}
		};
	})();

	var input = document.getElementById('morseInput').value || "";

	var t0 = performance.now();

	if ((input === " ") || (input === ""))
	{
		document.getElementById('morseOutput').innerHTML = "You must input something";
	}
	else
	{
		var isSentence = function(a)
		{
			var b = a.split(" ");
			for (var i = 0; i < b.length; i++)
			{
				if (morseCode.code.indexOf(b[i]) <= -1)
				{
					return true;
				}
				return false;
			}
		};
		if (isSentence(input))
		{
			document.getElementById('morseOutput').innerHTML = morseCode.fromSentence(input);
		}
		else
		{
			document.getElementById('morseOutput').innerHTML = morseCode.toSentence(input);
		}
	}

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

var gravConverter = function()
{
	var a = document.getElementById('gravNum').value || 1;
	var b = document.getElementById('gravPow').value || 1;

	document.getElementById('gravOutput').innerHTML = a * Math.pow(10, b - 9);
}

var calculateAltitude = function()
{
	var time = document.getElementById("orbitTime").value * 60 || 5400;
	var mu = document.getElementById("orbitPara").value || 3531.6;
	var radius = document.getElementById("orbitRadius").value || 600;

	// https://forum.kerbalspaceprogram.com/index.php?/topic/64230-calculating-altitude-for-given-orbital-period/
	// 	a = ((T/2pi)^2 * mu)^1/3

	// That's how I have it in my quick orbit calculator.

	// Note, however, that a is the semi-major axis, not the orbital height. For that you have to substract the radius of the body you are orbiting.

	document.getElementById('orbitOutput').innerHTML = Math.pow(Math.pow(time / (2 * Math.PI), 2) * mu, 1 / 3) - radius;
}

/*
TODO List - 
1. None
*/