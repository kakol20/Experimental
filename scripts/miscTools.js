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
