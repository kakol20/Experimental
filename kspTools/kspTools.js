var ksp = (function ()
{
    return {
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

        orbitalPeriod: function (semiMajorAxis, sgp)
        {
            var result = semiMajorAxis.pow(3);
            result = result.div(sgp);
            result = Decimal.sqrt(result);
            return result.mul(key.PI.mul(2));
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
        },

        semiMajorAxis: function (apoapsis, periapsis, radius)
        {
            var perigee = Decimal.add(periapsis, radius);
            var apogee = Decimal.add(apoapsis, radius);

            var majorAxis = perigee.add(apogee);

            return majorAxis.div(2);
        },

        cleanNumberString: function (n, decimalPlaces)
        {
            decimalPlaces = decimalPlaces || -1;

            if (decimalPlaces >= 0)
            {
                return bigDecimal.getPrettyValue(n.toDecimalPlaces(decimalPlaces));
            }
            else
            {
                return bigDecimal.getPrettyValue(n.toString());
            }

            //bigDecimal.getPrettyValue(result.toDecimalPlaces(4))
        },

        changeInclination: function (velocity, startIncl, endIncl)
        {
            var deltaIncl = Decimal.sub(startIncl, endIncl);
            deltaIncl = deltaIncl.abs();

            var result = deltaIncl.div(2);
            result = result.sin();
            result = result.mul(velocity);
            result = result.abs();

            return result.mul(2);
        },
    };
})();

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
    document.getElementById("gravOutput").innerHTML = ksp.cleanNumberString(aD) + " km<sup>3</sup>/s<sup>-2</sup>";
}

var calculateAltitude = function ()
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
    console.log(ksp.cleanNumberString(result));

    document.getElementById("orbitOutput").innerHTML = bigDecimal.getPrettyValue(result.toDecimalPlaces(4)) + " km";
}

var resonantOrbit = (function ()
{
    return {
        run: function ()
        {
            var diveOrbit = document.getElementById("resonantDive").checked;
            //var minimumLOS = document.getElementById("resonantLOS").checked;

            var eqRadius = document.getElementById("resonantRadius").value || 600;
            var sgp = document.getElementById("resonantSGP").value || 3531.6;

            var satNum = new Decimal(document.getElementById("resonantSatNo").value || 3);

            var altitude;
            var semiMajorAxis;

            // ----- CALCULATE ALTITUDE -----
            this.altOption = document.getElementById("resonantSelect").value;

            switch (this.altOption)
            {
                case "custom":
                    //semiMajorAxis = new Decimal(document.getElementById("resonantCustom").value || 600);
                    //semiMajorAxis = semiMajorAxis.add(eqRadius);

                    //altitude = semiMajorAxis.sub(eqRadius);
                    altitude = new Decimal(document.getElementById("resonantCustom").value || 600);

                    semiMajorAxis = altitude.add(eqRadius);

                    break;
                case "minLOS":
                    var insideAngle = satNum.sub(2); // in radians
                    insideAngle = insideAngle.mul(key.PI);
                    insideAngle = insideAngle.div(satNum);

                    semiMajorAxis = new Decimal(eqRadius);
                    semiMajorAxis = semiMajorAxis.div(Decimal.sin(insideAngle.div(2)));

                    altitude = semiMajorAxis.sub(eqRadius);

                    break;
                case "maxRange":
                    //var den = key.PI.mul(2);
                    //den = den.div(satNum);
                    //den = den.div(2);
                    var den = key.PI.div(satNum);
                    den = den.sin();
                    den = den.mul(2);

                    semiMajorAxis = new Decimal(document.getElementById("resonantMaxRange").value || 5000);
                    semiMajorAxis = semiMajorAxis.div(den);

                    altitude = semiMajorAxis.sub(eqRadius);

                    break;
                default:
            }

            // ----- CALCULATE RESONANT ORBIT -----
            var orbitRatio;
            var orbitalPeriod = ksp.orbitalPeriod(semiMajorAxis, sgp);

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

            var fourPiSquared = key.PI.pow(2);
            fourPiSquared = fourPiSquared.mul(4);

            resonantSMA = resonantSMA.div(fourPiSquared);
            resonantSMA = resonantSMA.cbrt();

            // calculate other altitude
            var otherAltitude = resonantSMA.mul(2);
            otherAltitude = otherAltitude.sub(semiMajorAxis);
            otherAltitude = otherAltitude.sub(eqRadius);

            // ----- CALCULATE Δv (delta V) -----
            var orbitVelocity = ksp.velocity(semiMajorAxis, semiMajorAxis, sgp);
            var resonantOrbitVelocity = ksp.velocity(resonantSMA, semiMajorAxis, sgp);

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
            var output = "Final Altitude: " + ksp.cleanNumberString(altitude, 4) + " km<br>";

            // format time
            output += "Final Orbital Period: " + ksp.cleanPeriod(orbitalPeriod) + "<br><br>";

            // check apoapsis and periapsis
            if (altitude.greaterThan(otherAltitude))
            {
                output += "Apoapsis: " + ksp.cleanNumberString(altitude, 4) + " km<br>";
                output += "Periapsis: " + ksp.cleanNumberString(otherAltitude, 4) + " km<br><br>";
            }
            else
            {
                output += "Apoapsis: " + ksp.cleanNumberString(otherAltitude, 4) + " km<br>";
                output += "Periapsis: " + ksp.cleanNumberString(altitude, 4) + " km<br><br>";
            }

            output += "Δv needed: " + ksp.cleanNumberString(deltaV, 4) + " m/s<br>";

            document.getElementById("resonantOutput").innerHTML = output;

            console.log("-----");
            //console.log("");
        },

        showAlt: function ()
        {
            this.altOption = document.getElementById("resonantSelect").value;

            switch (this.altOption)
            {
                case "custom":
                    document.getElementById('resonantCustomHTML').style = "display:block";
                    document.getElementById('resonantMaxRangeHTML').style = "display:none";
                    break;
                case "minLOS":
                    document.getElementById('resonantCustomHTML').style = "display:none";
                    document.getElementById('resonantMaxRangeHTML').style = "display:none";
                    break;
                case "maxRange":
                    document.getElementById('resonantCustomHTML').style = "display:none";
                    document.getElementById('resonantMaxRangeHTML').style = "display:block";
                    break;
                default:
            }
        },

        altOption: "custom",
    };
})();

var parkToOrbit = (function ()
{
    return {
        deorbit: true,
        deorbitHTML: function ()
        {
            this.deorbit = document.getElementById("orbitDeorbit").checked;
            var deorbitDIV = document.getElementById("orbitDeorbitHTML");

            if (this.deorbit)
            {
                deorbitDIV.style.display = "block";
            }
            else
            {
                deorbitDIV.style.display = "none";
            }
        },

        deltaV: {
            aeroBrakeAlt: new Decimal(0),
            circularise: new Decimal(0),
            //inclChange: new Decimal(0),
            toLowOrbit: new Decimal(0),
            toLowOrbitCircularise: new Decimal(0),
            toTargetAp: new Decimal(0),
            toTargetPe: new Decimal(0),

            total: function ()
            {
                var temp = new Decimal(0);
                temp = temp.add(this.circularise);
                //temp = temp.add(this.inclChange);
                temp = temp.add(this.toTargetAp);
                temp = temp.add(this.toTargetPe);

                if (parkToOrbit.deorbit)
                {
                    temp = temp.add(this.aeroBrakeAlt);
                    temp = temp.add(this.toLowOrbit);
                    temp = temp.add(this.toLowOrbitCircularise);
                }

                return temp;
            },

            convert: function ()
            {
                this.aeroBrakeAlt = this.aeroBrakeAlt.mul(1000);
                this.circularise = this.circularise.mul(1000);
                //this.inclChange = this.inclChange.mul(1000);
                this.toLowOrbit = this.toLowOrbit.mul(1000);
                this.toLowOrbitCircularise = this.toLowOrbitCircularise.mul(1000);
                this.toTargetAp = this.toTargetAp.mul(1000);
                this.toTargetPe = this.toTargetPe.mul(1000);
            }
        },

        run: function ()
        {
            this.deorbit = document.getElementById("orbitDeorbit").checked;

            var deorbitAlt = 70;
            var lowOrbitAlt = 160;
            if (this.deorbit)
            {
                lowOrbitAlt = document.getElementById("orbitLowOrbitAlt").value || 100;
                deorbitAlt = document.getElementById("orbitFinalAlt").value || 35;
            }

            var eqRadius = document.getElementById("orbitMeanRadius").value || 600;
            var sgp = document.getElementById("orbitSGP").value || 3531.6;

            var parkAp = document.getElementById("orbitStartAp").value || 100;
            var parkPe = document.getElementById("orbitStartPe").value || 100;
            //var parkIncl = key.degToRads(document.getElementById("orbitStartIncl").value || 0);

            // 398600.4418 km3/s-2 --- for testing (Earth parameters for geostationary orbit)
            // Apoapsis: 53621.3426 km
            // Periapsis: 35793.1727 km
            // 6371 km mean radius

            // 3531.6 km3/s-2 --- for testing (Kerbin parameters for geostationary orbit)
            // Apoapsis: 4327.7267 km
            // Periapsis: 2863.334 km
            // 600 km equatorial radius

            var targetAp = document.getElementById("orbitTargetAp").value || 4327.7267;
            var targetPe = document.getElementById("orbitTargetPe").value || 2863.334;
            //var targetIncl = key.degToRads(document.getElementById("orbitTargetIncl").value || 0);

            // for keeping track ----
            var apoapsis = parkAp;
            var periapsis = parkPe;

            // ----- BURN TO TARGET PERIAPSIS @ PERIAPSIS -----
            var distanceToPlanet = Decimal.add(periapsis, eqRadius);
            var semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
            var velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

            var targetSMA = ksp.semiMajorAxis(targetPe, periapsis, eqRadius);
            var targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

            var temp = Decimal.sub(velocity, targetVelocity);
            this.deltaV.toTargetPe = temp.abs();

            apoapsis = new Decimal(targetPe);

            // ----- CIRCULARISE @ NEW APOAPSIS -----
            semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
            distanceToPlanet = Decimal.add(apoapsis, eqRadius);
            velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

            targetSMA = ksp.semiMajorAxis(apoapsis, targetPe, eqRadius);
            targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

            temp = Decimal.sub(velocity, targetVelocity);
            this.deltaV.circularise = temp.abs();

            periapsis = new Decimal(targetPe);

            // ----- DIRECT INCLINATION CHANGE -----
            //semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
            //distanceToPlanet = Decimal.add(periapsis, eqRadius);
            //velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

            //this.deltaV.inclChange = this.changeInclination(velocity, parkIncl, targetIncl);

            // ----- BURN TO TARGET APOAPSIS @ PERIAPSIS -----
            targetSMA = ksp.semiMajorAxis(targetAp, periapsis, eqRadius);
            targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

            temp = Decimal.sub(velocity, targetVelocity);
            this.deltaV.toTargetAp = temp.abs();

            apoapsis = new Decimal(targetAp);

            if (this.deorbit)
            {
                // ----- TO LOW ORBIT PERIAPSIS @ APOAPSIS -----
                semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
                distanceToPlanet = Decimal.add(apoapsis, eqRadius);
                velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

                targetSMA = ksp.semiMajorAxis(apoapsis, lowOrbitAlt, eqRadius);
                targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

                temp = Decimal.sub(velocity, targetVelocity);
                this.deltaV.toLowOrbit = temp.abs();

                periapsis = new Decimal(lowOrbitAlt);

                // ----- CIRCULARISE @ PERIAPSIS -----
                semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
                distanceToPlanet = Decimal.add(periapsis, eqRadius);
                velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

                targetSMA = ksp.semiMajorAxis(lowOrbitAlt, periapsis, eqRadius);
                targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

                temp = Decimal.sub(velocity, targetVelocity);
                this.deltaV.toLowOrbitCircularise = temp.abs();

                apoapsis = periapsis;

                // ----- BURN TO AEROBRAKE ALTITUDE @ APOAPSIS -----
                semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
                distanceToPlanet = Decimal.add(apoapsis, eqRadius);
                velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

                targetSMA = ksp.semiMajorAxis(apoapsis, deorbitAlt, eqRadius);
                targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

                temp = Decimal.sub(velocity, targetVelocity);
                this.deltaV.aeroBrakeAlt = temp.abs();
            }

            // ----- CONVERT Δv TO m/s -----
            this.deltaV.convert();

            // ----- CONSOLE LOGGING -----

            console.log("Δv to target periapsis    : " + this.deltaV.toTargetPe.toString());
            console.log("Δv to circularise         : " + this.deltaV.circularise.toString());
            //console.log("Δv to change inclination  : " + this.deltaV.inclChange.toString());
            console.log("Δv to target apoapsis     : " + this.deltaV.toTargetAp.toString());

            //console.log("Δv to aerobrake altitude : " + deltaV[4].toString());

            if (this.deorbit)
            {
                //console.log("Δv to target apoapsis     : " + this.deltaV.toTargetAp.toString()); // temp
                console.log("");
                console.log("Δv to low orbit periapsis : " + this.deltaV.toLowOrbit.toString());
                console.log("Δv to circularise         : " + this.deltaV.toLowOrbitCircularise.toString());
                console.log("Δv to deorbit altitude    : " + this.deltaV.aeroBrakeAlt.toString());
            }

            console.log("");
            console.log("Total Δv                  : " + this.deltaV.total().toString());
            console.log("-----");
            //console.log("");

            document.getElementById("parkToOrbitOutput").innerHTML = this.output(2);
        },

        output: function (decimalPlaces)
        {
            var print = "<b><u>MANOUVERING TO TARGET ORBIT</u></b><br>";
            print += "Burn to target periapsis at periapsis = " + ksp.cleanNumberString(this.deltaV.toTargetPe, decimalPlaces) + " m/s<br>";
            print += "Circularise at target periapsis = " + ksp.cleanNumberString(this.deltaV.circularise, decimalPlaces) + " m/s<br>";
            //print += "Change inclination &asymp; " + ksp.cleanNumberString(this.deltaV.inclChange, decimalPlaces) + " m/s<br>";
            print += "Burn to target apoapsis at periapsis =  " + ksp.cleanNumberString(this.deltaV.toTargetAp, decimalPlaces) + " m/s<br><br>"

            if (this.deorbit)
            {
                print += "<b><u>MANOUVERING TO DEORBIT</u></b><br>";
                print += "Burn to low orbit periapsis at apoapsis = " + ksp.cleanNumberString(this.deltaV.toLowOrbit, decimalPlaces) + " m/s<br>";
                print += "Circularise at low orbit periapsis = " + ksp.cleanNumberString(this.deltaV.toLowOrbitCircularise, decimalPlaces) + " m/s<br>";
                print += "Deorbit at apoapsis = " + ksp.cleanNumberString(this.deltaV.aeroBrakeAlt, decimalPlaces) + " m/s<br><br>";
            }

            print += "Total Δv required &asymp; " + ksp.cleanNumberString(this.deltaV.total(), decimalPlaces) + " m/s<br>";

            return print;
        },
    };
})();

var changeIncl = (function ()
{
    return {
        run: function ()
        {
            var orbitAp = document.getElementById("changeInclAp").value || 100;
            var orbitPe = document.getElementById("changeInclPe").value || 100;
            var orbitIncl = parseFloat(document.getElementById("changeInclCIncl").value) || 0;

            var targetIncl = parseFloat(document.getElementById("changeInclTIncl").value) || 28;

            var sgp = document.getElementById("changeInclSGP").value || 3531.6;
            var meanRadius = document.getElementById("changeInclSGP").value || 600;

            var increment = document.getElementById("changeInclInc").value || 10;
            var maxAltitude = document.getElementById("changeInclMaxAlt").value || 9500;
            //var minFractionChange = 0.0001;
            var minFraction = document.getElementById("changeInclMinFrac").value || 0.6;

            var originalDV = this.calculateDeltaV(orbitAp, orbitPe, orbitAp, key.degToRads(orbitIncl), key.degToRads(targetIncl), sgp, meanRadius);

            var currentAp = new Decimal(orbitAp);

            var currentDV = this.calculateDeltaV(orbitAp, orbitPe, currentAp, key.degToRads(orbitIncl), key.degToRads(targetIncl), sgp, meanRadius);
            var currentFraction = currentDV.div(originalDV);

            var debugCurrentDV = currentDV.toString();
            var debugCurrentFrac = currentFraction.toString();

            while (true)
            {
                var nextAp = currentAp.add(increment);

                if (nextAp.greaterThan(maxAltitude)) // check if max altitude reached
                {
                    //console.log(nextAp.toString());
                    //console.log(nextDV.toString());
                    //console.log(fraction.toString());
                    break;
                }
                else
                {
                    var nextDV = this.calculateDeltaV(orbitAp, orbitPe, nextAp, key.degToRads(orbitIncl), key.degToRads(targetIncl), sgp, meanRadius);
                    var debugNextDV = nextDV.toString();
                    //console.log()

                    var nextFraction = nextDV.div(originalDV);
                    var debugNextFraction = nextFraction.toString();

                    //var fractionChange = currentFraction.sub(nextFraction);

                    if (nextFraction.greaterThan(minFraction) && nextFraction.lessThan(currentFraction))
                    {
                        currentAp = nextAp;
                        currentDV = nextDV;
                        currentFraction = nextFraction;
                    }
                    else
                    {
                        break;
                    }

                    //if (fraction.greaterThan(Decimal.sub(1, minDifferencePercent)))
                    //{
                    //    currentAp = nextAp;
                    //    currentDV = nextDV;
                    //}
                    //else
                    //{
                    //    //console.log(nextAp.toString());
                    //    //console.log(nextDV.toString());
                    //    //console.log(fraction.toString());
                    //    break;
                    //}
                }
            }

            //console.log(ksp.cleanNumberString(currentAp));
            //console.log(ksp.cleanNumberString(currentDV.mul(1000)));
            //console.log(ksp.cleanNumberString(currentFraction));

            var output = "";

            output = "Change Inclination at Apoapsis " + ksp.cleanNumberString(currentAp, 4) + " km<br>";
            output += "Total Δv required &asymp; " + ksp.cleanNumberString(currentDV.mul(1000), 2) + " m/s<br>";
            output += "Fraction = " + ksp.cleanNumberString(currentFraction, 4);

            document.getElementById("changeInclOutput").innerHTML = output;
        },

        calculateDeltaV: function (orbitAP, orbitPe, burnAp, inclStart, inclEnd, sgp, meanRadius)
        {
            // BURN TO APOAPSIS
            var sma = ksp.semiMajorAxis(orbitAP, orbitPe, meanRadius);
            var distanceToPlanet = Decimal.add(meanRadius, orbitPe);
            var currentV = ksp.velocity(sma, distanceToPlanet, sgp);

            sma = ksp.semiMajorAxis(burnAp, orbitPe, meanRadius);
            var targetV = ksp.velocity(sma, distanceToPlanet, sgp);

            var burnToApDV = currentV.sub(targetV);
            burnToApDV = burnToApDV.abs();

            // CHANGE INCLINATION
            distanceToPlanet = Decimal.add(meanRadius, burnAp);
            currentV = ksp.velocity(sma, distanceToPlanet, sgp);

            var changeInclDV = ksp.changeInclination(currentV, inclStart, inclEnd);

            // RETURN TO ORBIT Δv = BURN TO APOAPSIS Δv

            return changeInclDV.add(burnToApDV.mul(2));
        }
    };
})();