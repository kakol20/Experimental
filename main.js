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
		PI: Decimal.acos(-1),

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

		degToRads: function (deg)
		{
			var output = Decimal.div(this.PI, 180);

			return output.mul(deg);
        },
	};
})();

// http://www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor - For future reference

// Runs script when page is loaded or reloaded
$(function()
{
	console.log("Script by kakol20");
});

/*
TODO List - 
1. None
*/