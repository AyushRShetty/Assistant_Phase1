window.addEventListener("load", windowLoadHandler, false);

// Button click event listener
document.getElementById("talkToAI").addEventListener("click", function() {
    fetch('/listen', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error("Error:", data.error);
            alert("An error occurred: " + data.error);
        } else {
            console.log("Response:", data.response);
            alert(data.response); // Display the AI's response (can customize as needed)
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
});

function windowLoadHandler() {
    // Initialize canvas only if required
    if (canvasSupport()) {
        canvasApp();
    }
}

function canvasSupport() {
    return Modernizr.canvas;
}

function canvasApp() {
    var theCanvas = document.getElementById("canvasOne");
    var context = theCanvas.getContext("2d");

    var displayWidth;
    var displayHeight;
    var timer;
    var count;
    var numToAddEachFrame;
    var particleList;
    var recycleBin;
    var particleAlpha;
    var r, g, b;
    var fLen;
    var projCenterX;
    var projCenterY;
    var zMax;
    var turnAngle;
    var turnSpeed;
    var sphereCenterX, sphereCenterY, sphereCenterZ;
    var particleRad;
    var zeroAlphaDepth;
    var randAccelX, randAccelY, randAccelZ;
    var gravity;
    var rgbString;
    var p;
    var nextParticle;
    var sinAngle;
    var cosAngle;
    var rotX, rotZ;
    var depthAlphaFactor;
    var i;
    var theta, phi;
    var x0, y0, z0;

    init();

    function init() {
        count = 0;
        numToAddEachFrame = 8;

        // Particle color
        r = 0;
        g = 72;
        b = 255;
        rgbString = "rgba(" + r + "," + g + "," + b + ","; // Partial string for color

        particleAlpha = 1; // Maximum alpha

        displayWidth = theCanvas.width;
        displayHeight = theCanvas.height;

        fLen = 320; // Distance from viewer to z=0 depth

        // Projection center coordinates
        projCenterX = displayWidth / 2;
        projCenterY = displayHeight / 2;

        zMax = fLen - 2;

        particleList = {};
        recycleBin = {};

        randAccelX = 0.1;
        randAccelY = 0.1;
        randAccelZ = 0.1;

        gravity = -0;

        particleRad = 1.8;

        sphereCenterX = 0;
        sphereCenterY = 0;
        sphereCenterZ = -3 - 140; // sphereRad

        zeroAlphaDepth = -750;

        turnSpeed = 2 * Math.PI / 1200;
        turnAngle = 0;

        timer = setInterval(onTimer, 10 / 24);
    }

    function onTimer() {
        count++;
        if (count >= 1) {
            count = 0;
            for (i = 0; i < numToAddEachFrame; i++) {
                theta = Math.random() * 2 * Math.PI;
                phi = Math.acos(Math.random() * 2 - 1);
                x0 = 140 * Math.sin(phi) * Math.cos(theta); // sphereRad
                y0 = 140 * Math.sin(phi) * Math.sin(theta); // sphereRad
                z0 = 140 * Math.cos(phi); // sphereRad

                var p = addParticle(x0, sphereCenterY + y0, sphereCenterZ + z0, 0.002 * x0, 0.002 * y0, 0.002 * z0);

                p.attack = 50;
                p.hold = 50;
                p.decay = 100;
                p.initValue = 0;
                p.holdValue = particleAlpha;
                p.lastValue = 0;
                p.stuckTime = 90 + Math.random() * 20;
                p.accelX = 0;
                p.accelY = gravity;
                p.accelZ = 0;
            }
        }

        turnAngle = (turnAngle + turnSpeed) % (2 * Math.PI);
        sinAngle = Math.sin(turnAngle);
        cosAngle = Math.cos(turnAngle);

        context.fillStyle = "#000000";
        context.fillRect(0, 0, displayWidth, displayHeight);

        p = particleList.first;
        while (p != null) {
            nextParticle = p.next;

            p.age++;
            if (p.age > p.stuckTime) {
                p.velX += p.accelX + randAccelX * (Math.random() * 2 - 1);
                p.velY += p.accelY + randAccelY * (Math.random() * 2 - 1);
                p.velZ += p.accelZ + randAccelZ * (Math.random() * 2 - 1);

                p.x += p.velX;
                p.y += p.velY;
                p.z += p.velZ;
            }

            rotX = cosAngle * p.x + sinAngle * (p.z - sphereCenterZ);
            rotZ = -sinAngle * p.x + cosAngle * (p.z - sphereCenterZ) + sphereCenterZ;
            var m = 1 * fLen / (fLen - rotZ); // radius_sp
            p.projX = rotX * m + projCenterX;
            p.projY = p.y * m + projCenterY;

            if (p.age < p.attack + p.hold + p.decay) {
                if (p.age < p.attack) {
                    p.alpha = (p.holdValue - p.initValue) / p.attack * p.age + p.initValue;
                } else if (p.age < p.attack + p.hold) {
                    p.alpha = p.holdValue;
                } else if (p.age < p.attack + p.hold + p.decay) {
                    p.alpha = (p.lastValue - p.holdValue) / p.decay * (p.age - p.attack - p.hold) + p.holdValue;
                }
            } else {
                p.dead = true;
            }

            if ((p.projX > displayWidth) || (p.projX < 0) || (p.projY < 0) || (p.projY > displayHeight) || (rotZ > zMax)) {
                outsideTest = true;
            } else {
                outsideTest = false;
            }

            if (outsideTest || p.dead) {
                recycle(p);
            } else {
                depthAlphaFactor = (1 - rotZ / zeroAlphaDepth);
                depthAlphaFactor = (depthAlphaFactor > 1) ? 1 : ((depthAlphaFactor < 0) ? 0 : depthAlphaFactor);
                context.fillStyle = rgbString + depthAlphaFactor * p.alpha + ")";
                context.beginPath();
                context.arc(p.projX, p.projY, m * particleRad, 0, 2 * Math.PI, false);
                context.closePath();
                context.fill();
            }

            p = nextParticle;
        }
    }

    function addParticle(x0, y0, z0, vx0, vy0, vz0) {
        var newParticle;
        if (recycleBin.first != null) {
            newParticle = recycleBin.first;
            if (newParticle.next != null) {
                recycleBin.first = newParticle.next;
                newParticle.next.prev = null;
            } else {
                recycleBin.first = null;
            }
        } else {
            newParticle = {};
        }

        if (particleList.first == null) {
            particleList.first = newParticle;
            newParticle.prev = null;
            newParticle.next = null;
        } else {
            newParticle.next = particleList.first;
            particleList.first.prev = newParticle;
            particleList.first = newParticle;
            newParticle.prev = null;
        }

        newParticle.x = x0;
        newParticle.y = y0;
        newParticle.z = z0;
        newParticle.velX = vx0;
        newParticle.velY = vy0;
        newParticle.velZ = vz0;
        newParticle.age = 0;
        newParticle.dead = false;
        newParticle.right = Math.random() < 0.5;
        return newParticle;
    }

    function recycle(p) {
        if (p.prev != null) {
            p.prev.next = p.next;
        } else {
            particleList.first = p.next;
        }

        if (p.next != null) {
            p.next.prev = p.prev;
        }

        if (recycleBin.first == null) {
            recycleBin.first = p;
            p.prev = null;
            p.next = null;
        } else {
            p.next = recycleBin.first;
            recycleBin.first.prev = p;
            recycleBin.first = p;
            p.prev = null;
        }
    }
}
