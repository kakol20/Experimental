var gravConverter = function ()
{
    var a = parseFloat(document.getElementById("gravNum").value) || 1;
    var b = parseFloat(document.getElementById("gravPow").value) || 1;

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

    // document.getElementById("gravOutput").innerHTML = a * Math.pow(10, b - 9);
    document.getElementById("gravOutput").innerHTML = bigDecimal.getPrettyValue(aD.toString()) + " km<sup>3</sup>/s<sup>-2</sup>";
}

var calculateAltitude = function()
{
    // var time = document.getElementById("orbitTime").value * 60 || 5400;
    var time = (parseFloat(document.getElementById("orbitHours").value) || 0) * 60 * 60;
    time += (parseFloat(document.getElementById("orbitMinutes").value) || 0) * 60;
    time += parseFloat(document.getElementById("orbitSeconds").value) || 0;
    var mu = document.getElementById("orbitPara").value || 3531.6;
    var radius = document.getElementById("orbitRadius").value || 600;

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

    // That"s how I have it in my quick orbit calculator.

    // Note, however, that a is the semi-major axis, not the orbital height. For that you have to substract the radius of the body you are orbiting.
    console.log(bigDecimal.getPrettyValue(result.toString()));

    document.getElementById("orbitOutput").innerHTML = bigDecimal.getPrettyValue(result.toDecimalPlaces(4)) + " km";
}

var resonantOrbit = (function ()
{
    return {
        PI: Decimal.acos(-1),

        run: function ()
        {
            var diveOrbit = document.getElementById("resonantDive").checked;
            var minimumLOS = document.getElementById("resonantLOS").checked;

            var eqRadius = document.getElementById("resonantRadius").value || 600;
            var sgp = document.getElementById("resonantSGP").value || 3531.6;

            var satNum = new Decimal(document.getElementById("resonantSatNo").value || 3);

            var altitude;
            var semiMajorAxis;

            // ----- CALCULATE MINIMUM LINE OF SIGHT -----
            if (minimumLOS)
            {
                var insideAngle = satNum.sub(2); // in radians
                insideAngle = insideAngle.mul(this.PI);
                insideAngle = insideAngle.div(satNum);

                semiMajorAxis = new Decimal(eqRadius);
                semiMajorAxis = semiMajorAxis.div(Decimal.sin(insideAngle.div(2)));

                altitude = semiMajorAxis.sub(eqRadius);
            }
            else
            {
                semiMajorAxis = new Decimal(document.getElementById("resonantAlt").value || 600);
                semiMajorAxis = semiMajorAxis.add(eqRadius);

                altitude = semiMajorAxis.sub(eqRadius);
            }		

            // ----- CALCULATE RESONANT ORBIT -----
            var orbitRatio;
            var orbitalPeriod = this.orbitalPeriod(semiMajorAxis, sgp);

            if (diveOrbit) // calculate orbital ratio
            {
                orbitRatio = new Decimal(satNum);
                orbitRatio = orbitRatio.sub(1);
                orbitRatio = orbitRatio.div(satNum);
            }
            else
            {
                orbitRatio = new Decimal(satNum.add(1));
                orbitRatio = orbitRatio.div(satNum);
            }

            // calculate resonant orbital period
            var resonantOrbitPeriod = orbitalPeriod.mul(orbitRatio);

            // calculate resonant orbit semi major axis
            var resonantSMA = Decimal.pow(resonantOrbitPeriod, 2);
            resonantSMA = resonantSMA.mul(sgp);

            var fourPiSquared = this.PI.pow(2);
            fourPiSquared = fourPiSquared.mul(4);

            resonantSMA = resonantSMA.div(fourPiSquared);
            resonantSMA = resonantSMA.cbrt();

            // calculate other altitude
            var otherAltitude = resonantSMA.mul(2);
            otherAltitude = otherAltitude.sub(semiMajorAxis);
            otherAltitude = otherAltitude.sub(eqRadius);

            // ----- CALCULATE Δv (delta V) -----
            var orbitVelocity = this.velocity(semiMajorAxis, semiMajorAxis, sgp);
            var resonantOrbitVelocity = this.velocity(resonantSMA, semiMajorAxis, sgp);

            var deltaV = orbitVelocity.sub(resonantOrbitVelocity);
            deltaV = deltaV.abs();
            deltaV = deltaV.mul(1000);

            // ----- CONSOLE LOGGING -----

            console.log("Orbital Period: " + orbitalPeriod.toString());
            console.log("Semi Major Axis: " + semiMajorAxis.toString());
            console.log("Orbit Altitude: " + altitude.toString());
            console.log("Orbit Velocity: " + orbitVelocity.toString());
            console.log(" ");
            console.log("Orbit Ratio: " + orbitRatio.toString());
            console.log(" ");
            console.log("Resonant Orbital Period: " + resonantOrbitPeriod.toString());
            console.log("Resonant Orbit Semi Major Axis: " + resonantSMA.toString());
            console.log("Other Altitude: " + otherAltitude.toString());
            console.log("Resonant Orbit Velocity: " + resonantOrbitVelocity.toString());
            console.log(" ");
            console.log("Δv: " + deltaV.toString());

            // ----- OUTPUT -----
            var output = "Final Altitude: " + bigDecimal.getPrettyValue(altitude.toDecimalPlaces(4)) + " km<br>";

            // format time
            output += "Final Orbital Period: " + this.cleanPeriod(orbitalPeriod) + "<br><br>";	

            // check apoapsis and periapsis
            if (altitude.greaterThan(otherAltitude))
            {
                output += "Apoapsis: " + bigDecimal.getPrettyValue(altitude.toDecimalPlaces(4)) + " km<br>";
                output += "Periapsis: " + bigDecimal.getPrettyValue(otherAltitude.toDecimalPlaces(4)) + " km<br><br>";
            }
            else
            {
                output += "Apoapsis: " + bigDecimal.getPrettyValue(otherAltitude.toDecimalPlaces(4)) + " km<br>";
                output += "Periapsis: " + bigDecimal.getPrettyValue(altitude.toDecimalPlaces(4)) + " km<br><br>";
            }

            output += "Δv needed: " + bigDecimal.getPrettyValue(deltaV.toDecimalPlaces(4)) + " m/s<br>";

            document.getElementById("resonantOutput").innerHTML = output;

            console.log("-----");
        },

        showAlt: function ()
        {
            var showAlt = document.getElementById("resonantLOS").checked;
            var altHTML = document.getElementById("resonantAltHTML");

            if (!showAlt)
            {
                altHTML.style.display = "block";
            }
            else
            {
                altHTML.style.display = "none";
            }
        },

        orbitalPeriod: function (semiMajorAxis, sgp)
        {
            var result = semiMajorAxis.pow(3);
            result = result.div(sgp);
            result = Decimal.sqrt(result);
            return result.mul(this.PI.mul(2));
        },

        velocity: function (semiMajorAxis, distanceToSatellite, mu)
        {
            var part1 = new Decimal(mu);
            part1 = part1.div(semiMajorAxis);
            part1 = part1.mul(-1);

            var part2 = new Decimal(mu);
            part2 = part2.mul(2);
            part2 = part2.div(distanceToSatellite);

            var result = part1.add(part2);
            return result.sqrt();
        },

        cleanPeriod: function (period)
        {
            var accumulated = period;
            var output = "";

            var seconds = accumulated.mod(60);

            accumulated = accumulated.sub(seconds);
            accumulated = accumulated.div(60);

            var minutes = accumulated.mod(60);

            accumulated = accumulated.sub(minutes);
            accumulated = accumulated.div(60);

            output += accumulated.toString() + "h:";
            output += minutes.toString() + "m:";
            output += seconds.toDecimalPlaces(4) + "s";

            return output;
        }
    };
})();
