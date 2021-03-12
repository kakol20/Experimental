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