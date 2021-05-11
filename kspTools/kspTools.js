let ksp = (function ()
{
    return {
        velocity: function (semiMajorAxis, distanceToSatellite, mu)
        {
            let old = false;
            if (old)
            {
                let part1 = new Decimal(mu);
                part1 = part1.div(semiMajorAxis);
                part1 = part1.mul(-1);

                let part2 = new Decimal(mu);
                part2 = part2.mul(2);
                part2 = part2.div(distanceToSatellite);

                let result = part1.add(part2);
                return result.sqrt();
            }
            else
            {
                // simpler - easier to read version http://www.braeunig.us/space/orbmech.htm#maneuver
                let part1 = new Decimal(2);
                part1 = Decimal.div(part1, distanceToSatellite);

                let part2 = new Decimal(1);
                part2 = part2.div(semiMajorAxis);

                let result = part1.sub(part2);
                result = result.mul(mu);

                return result.sqrt();
            }
        },

        velocityCircular: function (semiMajorAxis, mu)
        {
            let result = new Decimal(mu);
            result = result.div(semiMajorAxis);

            return result.sqrt();
        },

        orbitalPeriod: function (semiMajorAxis, sgp)
        {
            let result = semiMajorAxis.pow(3);
            result = result.div(sgp);
            result = Decimal.sqrt(result);
            return result.mul(key.PI.mul(2));
        },

        cleanPeriod: function (period)
        {
            let accumulated = period;
            let output = "";

            let seconds = accumulated.mod(60);

            accumulated = accumulated.sub(seconds);
            accumulated = accumulated.div(60);

            let minutes = accumulated.mod(60);

            accumulated = accumulated.sub(minutes);
            accumulated = accumulated.div(60);

            output += accumulated.toString() + "h:";
            output += minutes.toString() + "m:";
            output += seconds.toDecimalPlaces(4) + "s";

            return output;
        },

        semiMajorAxis: function (apoapsis, periapsis, radius)
        {
            let perigee = Decimal.add(periapsis, radius);
            let apogee = Decimal.add(apoapsis, radius);

            let majorAxis = perigee.add(apogee);

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
            let deltaIncl = Decimal.sub(key.degToRads(startIncl), key.degToRads(endIncl));
            deltaIncl = deltaIncl.abs();

            let result = deltaIncl.div(2);
            result = result.sin();
            result = result.mul(velocity);
            result = result.abs();

            return result.mul(2);
        },
    };
})();

let gravConverter = function ()
{
    let a = parseFloat(document.getElementById("gravNum").value) || 1;
    let b = parseFloat(document.getElementById("gravPow").value) || 1;

    b -= 9;

    let aD = new Decimal(a);

    if (b > 0)
    {
        for (let i = 0; i < b; i++)
        {
            aD = aD.mul(10);
        }
    }
    else if (b < 0)
    {
        for (let i = 0; i < Math.abs(b); i++)
        {
            aD = aD.div(10);
        }
    }

    // console.log()

    // document.getElementById("gravOutput").innerHTML = a * Math.pow(10, b - 9);
    document.getElementById("gravOutput").innerHTML = ksp.cleanNumberString(aD) + " km<sup>3</sup>/s<sup>-2</sup>";
}

let calculateAltitude = function ()
{
    // let time = document.getElementById("orbitTime").value * 60 || 5400;
    let time = (parseFloat(document.getElementById("orbitHours").value) || 0) * 60 * 60;
    time += (parseFloat(document.getElementById("orbitMinutes").value) || 0) * 60;
    time += parseFloat(document.getElementById("orbitSeconds").value) || 0;
    let mu = document.getElementById("orbitPara").value || 3531.6;
    let radius = document.getElementById("orbitRadius").value || 600;

    // https://github.com/MikeMcl/decimal.js/
    let tau = new Decimal(Math.PI);
    tau = tau.mul(2);

    let result = new Decimal(time === 0 ? 1 : time);
    result = result.div(tau);
    result = result.mul(result);
    result = result.mul(mu);

    let third = new Decimal(1);
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

let resonantOrbit = (function ()
{
    return {
        run: function ()
        {
            let diveOrbit = document.getElementById("resonantDive").checked;
            //let minimumLOS = document.getElementById("resonantLOS").checked;

            let eqRadius = document.getElementById("resonantRadius").value || 600;
            let sgp = document.getElementById("resonantSGP").value || 3531.6;

            let satNum = new Decimal(document.getElementById("resonantSatNo").value || 3);

            let altitude;
            let semiMajorAxis;

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
                    let insideAngle = satNum.sub(2); // in radians
                    insideAngle = insideAngle.mul(key.PI);
                    insideAngle = insideAngle.div(satNum);

                    semiMajorAxis = new Decimal(eqRadius);
                    semiMajorAxis = semiMajorAxis.div(Decimal.sin(insideAngle.div(2)));

                    altitude = semiMajorAxis.sub(eqRadius);

                    break;
                case "maxRange":
                    //let den = key.PI.mul(2);
                    //den = den.div(satNum);
                    //den = den.div(2);
                    let den = key.PI.div(satNum);
                    den = den.sin();
                    den = den.mul(2);

                    semiMajorAxis = new Decimal(document.getElementById("resonantMaxRange").value || 5000);
                    semiMajorAxis = semiMajorAxis.div(den);

                    altitude = semiMajorAxis.sub(eqRadius);

                    break;
                default:
            }

            // ----- CALCULATE RESONANT ORBIT -----
            let orbitRatio;
            let orbitalPeriod = ksp.orbitalPeriod(semiMajorAxis, sgp);

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
            let resonantOrbitPeriod = orbitalPeriod.mul(orbitRatio);

            // calculate resonant orbit semi major axis
            let resonantSMA = Decimal.pow(resonantOrbitPeriod, 2);
            resonantSMA = resonantSMA.mul(sgp);

            let fourPiSquared = key.PI.pow(2);
            fourPiSquared = fourPiSquared.mul(4);

            resonantSMA = resonantSMA.div(fourPiSquared);
            resonantSMA = resonantSMA.cbrt();

            // calculate other altitude
            let otherAltitude = resonantSMA.mul(2);
            otherAltitude = otherAltitude.sub(semiMajorAxis);
            otherAltitude = otherAltitude.sub(eqRadius);

            // ----- CALCULATE Δv (delta V) -----
            let orbitVelocity = ksp.velocity(semiMajorAxis, semiMajorAxis, sgp);
            let resonantOrbitVelocity = ksp.velocity(resonantSMA, semiMajorAxis, sgp);

            let deltaV = orbitVelocity.sub(resonantOrbitVelocity);
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
            let output = "Final Altitude: " + ksp.cleanNumberString(altitude, 4) + " km<br>";

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

let parkToOrbit = (function ()
{
    return {
        deorbit: true,
        deorbitHTML: function ()
        {
            this.deorbit = document.getElementById("orbitDeorbit").checked;
            let deorbitDIV = document.getElementById("orbitDeorbitHTML");

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
            toLowOrbit: new Decimal(0),
            toLowOrbitCircularise: new Decimal(0),
            toTargetAp: new Decimal(0),
            toTargetPe: new Decimal(0),

            reset: function ()
            {
                this.aeroBrakeAlt = new Decimal(0);
                this.circularise = new Decimal(0);
                this.toLowOrbit = new Decimal(0);
                this.toLowOrbitCircularise = new Decimal(0);
                this.toTargetAp = new Decimal(0);
                this.toTargetPe = new Decimal(0);
            },

            total: function ()
            {
                let temp = new Decimal(0);
                if (parkToOrbit.changeIncl)
                {
                    temp = temp.add(this.circularise);
                }
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
                this.toLowOrbit = this.toLowOrbit.mul(1000);
                this.toLowOrbitCircularise = this.toLowOrbitCircularise.mul(1000);
                this.toTargetAp = this.toTargetAp.mul(1000);
                this.toTargetPe = this.toTargetPe.mul(1000);
            }
        },

        changeIncl: false,

        run: function ()
        {
            this.deltaV.reset();

            this.deorbit = document.getElementById("orbitDeorbit").checked;

            this.changeIncl = document.getElementById("orbitInclChange").checked;

            let deorbitAlt = 70;
            let lowOrbitAlt = 160;
            if (this.deorbit)
            {
                lowOrbitAlt = document.getElementById("orbitLowOrbitAlt").value || 100;
                deorbitAlt = document.getElementById("orbitFinalAlt").value || 35;
            }

            let eqRadius = document.getElementById("orbitMeanRadius").value || 600;
            let sgp = document.getElementById("orbitSGP").value || 3531.6;

            let parkAp = document.getElementById("orbitStartAp").value || 100;
            let parkPe = document.getElementById("orbitStartPe").value || 100;
            //let parkIncl = key.degToRads(document.getElementById("orbitStartIncl").value || 0);

            // 398600.4418 km3/s-2 --- for testing (Earth parameters for geostationary orbit)
            // Apoapsis: 53621.3426 km
            // Periapsis: 35793.1727 km
            // 6371 km mean radius

            // 3531.6 km3/s-2 --- for testing (Kerbin parameters for geostationary orbit)
            // Apoapsis: 4327.7267 km
            // Periapsis: 2863.334 km
            // 600 km equatorial radius

            let targetAp = document.getElementById("orbitTargetAp").value || 4327.7267;
            let targetPe = document.getElementById("orbitTargetPe").value || 2863.334;
            //let targetIncl = key.degToRads(document.getElementById("orbitTargetIncl").value || 0);

            // for keeping track ----
            let apoapsis = parkAp;
            let periapsis = parkPe;

            if (this.changeIncl)
            {
                // ----- BURN TO TARGET PERIAPSIS @ PERIAPSIS -----
                let distanceToPlanet = Decimal.add(periapsis, eqRadius);
                let semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
                let velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

                let targetSMA = ksp.semiMajorAxis(targetPe, periapsis, eqRadius);
                let targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

                let temp = Decimal.sub(velocity, targetVelocity);
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
                semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
                distanceToPlanet = Decimal.add(periapsis, eqRadius);
                velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

                targetSMA = ksp.semiMajorAxis(targetAp, periapsis, eqRadius);
                targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

                temp = Decimal.sub(velocity, targetVelocity);
                this.deltaV.toTargetAp = temp.abs();

                apoapsis = new Decimal(targetAp);
            }
            else
            {
                // ----- BURN TO TARGET APOAPSIS @ PERIAPSIS -----
                semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
                distanceToPlanet = Decimal.add(periapsis, eqRadius);
                velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

                targetSMA = ksp.semiMajorAxis(targetAp, periapsis, eqRadius);
                targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

                temp = Decimal.sub(velocity, targetVelocity);
                this.deltaV.toTargetAp = temp.abs();

                apoapsis = new Decimal(targetAp);

                // ----- BURN TO TARGET PERIAPSIS @ NEW APOAPSIS -----
                semiMajorAxis = ksp.semiMajorAxis(apoapsis, periapsis, eqRadius);
                distanceToPlanet = Decimal.add(apoapsis, eqRadius);
                velocity = ksp.velocity(semiMajorAxis, distanceToPlanet, sgp);

                targetSMA = ksp.semiMajorAxis(apoapsis, targetPe, eqRadius);
                targetVelocity = ksp.velocity(targetSMA, distanceToPlanet, sgp);

                temp = Decimal.sub(velocity, targetVelocity);
                this.deltaV.toTargetPe = temp.abs();

                periapsis = new Decimal(targetPe);
            }

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
            let print = "<b><u>MANOUVERING TO TARGET ORBIT</u></b><br>";
            if (this.changeIncl)
            {
                print += "Burn to target periapsis at periapsis = " + ksp.cleanNumberString(this.deltaV.toTargetPe, decimalPlaces) + " m/s<br>";
                print += "Circularise at target periapsis = " + ksp.cleanNumberString(this.deltaV.circularise, decimalPlaces) + " m/s<br>";
                //print += "Change inclination &asymp; " + ksp.cleanNumberString(this.deltaV.inclChange, decimalPlaces) + " m/s<br>";
                print += "Burn to target apoapsis at periapsis =  " + ksp.cleanNumberString(this.deltaV.toTargetAp, decimalPlaces) + " m/s<br><br>"
            }
            else
            {
                print += "Burn to target apoapsis at periapsis = " + ksp.cleanNumberString(this.deltaV.toTargetAp, decimalPlaces) + " m/s<br>";
                print += "Burn to target periapsis at apoapsis = " + ksp.cleanNumberString(this.deltaV.toTargetPe, decimalPlaces) + " m/s<br><br>";
            }

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

let changeIncl = (function ()
{
    return {
        run: function ()
        {
            let orbitAp = parseFloat(document.getElementById("changeInclAp").value) || 100;
            let orbitPe = parseFloat(document.getElementById("changeInclPe").value) || 100;
            let orbitIncl = parseFloat(document.getElementById("changeInclCIncl").value) || 0;

            let targetIncl = parseFloat(document.getElementById("changeInclTIncl").value) || 0;

            let sgp = parseFloat(document.getElementById("changeInclSGP").value) || 3531.6; // 398600.5
            let meanRadius = parseFloat(document.getElementById("changeInclMeanRad").value) || 600;

            let increment = parseFloat(document.getElementById("changeInclInc").value) || 10;
            let maxAltitude = parseFloat(document.getElementById("changeInclMaxAlt").value) || 9500;
            //let minFractionChange = 0.0001;
            let minFraction = parseFloat(document.getElementById("changeInclMinFrac").value) || 0;

            let originalDV = this.calculateDeltaV(orbitAp, orbitPe, orbitAp, orbitIncl, targetIncl, sgp, meanRadius);

            let currentAp = new Decimal(orbitAp);

            let currentDV = this.calculateDeltaV(orbitAp, orbitPe, currentAp, orbitIncl, targetIncl, sgp, meanRadius);
            let currentFraction = currentDV.div(originalDV);

            while (true)
            {
                let nextAp = currentAp.add(increment);

                if (nextAp.greaterThan(maxAltitude)) // check if max altitude reached
                {
                    //console.log(nextAp.toString());
                    //console.log(nextDV.toString());
                    //console.log(fraction.toString());
                    break;
                }
                else
                {
                    let nextDV = this.calculateDeltaV(orbitAp, orbitPe, nextAp, orbitIncl, targetIncl, sgp, meanRadius);
                    //let debugNextDV = nextDV.toString();
                    //console.log()

                    let nextFraction = nextDV.div(originalDV);

                    //let fractionChange = currentFraction.sub(nextFraction);

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

            let output = "";

            //let debugDecimal = currentFraction.toString() + originalDV.toString();

            output = "Change Inclination at Apoapsis " + ksp.cleanNumberString(currentAp, 4) + " km<br>";
            output += "Total Δv required &asymp; " + ksp.cleanNumberString(currentDV.mul(1000), 2) + " m/s<br>";
            output += "Fraction = " + ksp.cleanNumberString(currentFraction, 4);

            document.getElementById("changeInclOutput").innerHTML = output;
        },

        calculateDeltaV: function (orbitAP, orbitPe, burnAp, inclStart, inclEnd, sgp, meanRadius)
        {
            // BURN TO APOAPSIS
            let sma = ksp.semiMajorAxis(orbitAP, orbitPe, meanRadius);
            let distanceToPlanet = Decimal.add(meanRadius, orbitPe);
            let currentV = ksp.velocity(sma, distanceToPlanet, sgp);
            console.log(ksp.cleanNumberString(currentV, 4));

            sma = ksp.semiMajorAxis(burnAp, orbitPe, meanRadius);
            distanceToPlanet = Decimal.add(meanRadius, burnAp);
            let targetV = ksp.velocity(sma, distanceToPlanet, sgp);

            let burnToApDV = currentV.sub(targetV);
            burnToApDV = burnToApDV.abs();

            // CHANGE INCLINATION
            distanceToPlanet = Decimal.add(meanRadius, burnAp);
            currentV = ksp.velocity(sma, distanceToPlanet, sgp);

            let changeInclDV = ksp.changeInclination(currentV, inclStart, inclEnd);
            changeInclDV = changeInclDV.abs();

            // RETURN TO ORBIT Δv = BURN TO APOAPSIS Δv

            return changeInclDV.add(burnToApDV.mul(2));
        }
    };
})();