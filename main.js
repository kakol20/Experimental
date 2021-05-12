/*
Notes: {
    Use parseInt("Text") to turn into number:
        let a = "18";
        let b = parseInt(a) + 2;

        result of b: 20
        
    Use let.split(',') to turn into list:
        let a = "a,b,c,d,e,f,g";
        let b = a.split(',');

        result of b: [a,b,c,d,e,f,g];
        
    Use "<br>" to split lines in div:
        let a = "a" + "<br>";
        let b = "b" + "<br>";
        let c = "c";
        document.getElementById('main').innerHTML = a + b + c;

        result Output:
            a
            b
            c

    Use number.toString(16) to convert decimal to hex:
        let a = 69;
        let b a.toString(16);

        result of b: 45;

    Use parseInt(hex, 16) to convert hex to decimal:
        let a = 45;
        let b = parseInt(a, 16);

        result of b: 69;

    Use array.reverse() to reverse list:
        let a = [2,3,1];
        a.reverse();

        result of a: [1,3,2];

    Use n.toPrecision(x) to round number in x significant figures:
        let a = 3.14159265;
        let b = a.toPrecision(4);

        result of b: 3.142;
    
    Standard Index Form:
        a * 10^b
        a - Coefficient
        b - Exponent
        let c = 0.0054;
        let exponent = key.round(Math.log(c) / Math.log(10), "down");
        let coefficient = c * Math.pow(10, -1 * exponent);

        result of exponent: -3
                  coefficient: 5.4 

    Use Number(string) to turn into a number
        let a = "3.14159265";
        let b = Number(a);

        result of b: 3.14159265

    http://stackoverflow.com/questions/34599303/javascript-sort-list-of-lists-by-sublist-second-entry

    Use array.splice(index, 1) to delete array[index]
        let a = [1, 2, 3];
        let b = a.splice(1, 1);

        result of b: [1, 3];
}
*/
let key = (function()
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
			let c = a - b;
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
			    for (let i = 0; i <= Math.sqrt(a); i++) {
			        if (a % i === 0) {
			            return false;
			        }
			    }
			    return true;
			}
			*/

			let b = bigInt(a);
			if (b.lesser(2))
			{
				return false;
			}
			else if (b.equals(2))
			{
				return true;
			}
			else
			{
				for (let i = bigInt(2); i.lesserOrEquals(key.bigIntApproxSqrt(b)); i = i.next())
				{
					if ((b.mod(i)).equals(0))
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
			let b = key.countDupes(a);
			let c = [];
			for (let i = 0; i < b.length; i++)
			{
				c.push(b[i][0]);
			}
			return c;
		},
		// https://stackoverflow.com/questions/19395257/how-to-count-duplicate-value-in-an-array-in-javascript
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
		countDupes: function(a)
		{
			let b = [];
			a.forEach(function(i)
			{
				b[i] = (b[i] || 0) + 1;
			});

			let c = [];
			for (const d in b)
			{
				c.push([`${d}`, parseInt(`${b[d]}`)]);
			}

			return c;
		},

		numberOutput: function(a)
		{
			let b = a.toString();
			let c = b.split("");
			c.reverse();
			let d = "";
			for (let i = 0; i < c.length; i++)
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
					let b;
					let c = a;
					let d = "";
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
						let e = d.split("");
						e.reverse();
						let f = "";
						for (let i = 0; i < e.length; i++)
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
					let b = [];
					if (!isNaN(a))
					{
						let c = a.toString();
						b = c.split("");
					}
					else
					{
						b = a.split("");
					}
					let d = [];
					for (let i = 0; i < b.length; i++)
					{
						if (b[i] !== " ")
						{
							d.push(b[i]);
						}
					}
					let e = 0;
					for (let i = 0; i < d.length; i++)
					{
						e = (e * 64) + key.base64.base.indexOf(d[i]);
					}
					return e;
				},

				test: function(a)
				{
					a = key.round(Math.abs(a), "down") || key.round(key.random(key.base64.toNumber("// //"), key.base64.toNumber(1000)));
					console.log("Number           : " + key.numberOutput(a));
					let b = key.base64.fromNumber(a, "yes");
					console.log("Number to Base-64: " + b);
					let c = key.base64.toNumber(b);
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
			let weekToConvert = w;
			let week = key.round(weekToConvert, "down");

			let dayToConvert = (weekToConvert - week) * 7;
			let day = key.round(dayToConvert, "down");

			let hourToConvert = (dayToConvert - day) * 24;
			let hour = key.round(hourToConvert, "down");

			let minuteToConvert = (hourToConvert - hour) * 60;
			let minute = key.round(minuteToConvert, "down");

			let second = key.round((minuteToConvert - minute) * 60, "nearest", 2);

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

			let converted = [week, day, hour, minute, second];
			let output = "";
			for (let i = 0; i < converted.length; i++)
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

			let b = a;
			let c = 1;

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

			let b = a;
			let c = bigInt(1);

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
			let math = document.getElementById(idName);
			MathJax.Hub.Queue(["Typeset", MathJax.Hub, math]);
		},

		degToRads: function (deg, decimal)
		{
			if (decimal)
			{
				let output = Decimal.div(this.PI, 180);

				return output.mul(deg);
			}
			else
			{
				return (Math.PI / 180.0) * deg;
            }
        },
	};
})();

// http://www.accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor - For future reference

// Runs script when page is loaded or reloaded
$(function()
{
	console.log("Script by kakol20");
	console.log("-----");
	//console.log("");
});

/*
TODO List - 
1. None
*/