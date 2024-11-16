export function bouncingDie() {
    // Import the canvas
    const canv = document.getElementById("myCanvas");
    if (!canv) {
        throw new Error("Cannot find myCanvas element");
    }
    const context = canv.getContext("2d");
    if (!context) {
        throw new Error("Cannot acquire 2d context for myCanvas element");
    }
    // Set the height and width
    canv.width = 600;
    canv.height = 600;
    context.fillStyle = "rgb(240,240,240)";
    context.fillRect(0, 0, canv.width, canv.height);
    let die = {
        cartesian: {
            pos: { x: canv.width / 2, y: canv.height / 2 },
            vel: { x: 0, y: 0 },
            acc: { x: 0, y: 0 }
        },
        polar: {
            pos: 0,
            vel: 0.3,
            acc: 0
        },
        radius: 50
    };
    function drawDie(theDie, theCanv, theContext) {
        // Draw Background
        theContext.fillStyle = "rgb(240, 240, 240)";
        theContext.fillRect(0, 0, theCanv.width, theCanv.height);
        // Draw Center
        theContext.fillStyle = "red";
        theContext.beginPath();
        theContext.arc(die.cartesian.pos.x, theCanv.height - die.cartesian.pos.y, 10, 0, 2 * Math.PI);
        theContext.fill();
        theContext.stroke();
        // Draw Edges
        for (let edge = 0; edge < 4; edge++) {
            let angle1 = die.polar.pos + edge * Math.PI / 2;
            let xPos1 = die.cartesian.pos.x + die.radius * Math.cos(angle1);
            let yPos1 = die.cartesian.pos.y + die.radius * Math.sin(angle1);
            let angle2 = die.polar.pos + (edge + 1) * Math.PI / 2;
            let xPos2 = die.cartesian.pos.x + die.radius * Math.cos(angle2);
            let yPos2 = die.cartesian.pos.y + die.radius * Math.sin(angle2);
            theContext.strokeStyle = "orange";
            theContext.lineWidth = 10;
            theContext.beginPath();
            theContext.moveTo(xPos1, theCanv.height - yPos1);
            theContext.lineTo(xPos2, theCanv.height - yPos2);
            theContext.stroke();
        }
        // Draw Vertices
        for (let vertex = 0; vertex < 4; vertex++) {
            let angle = die.polar.pos + vertex * Math.PI / 2;
            let xPos = die.cartesian.pos.x + die.radius * Math.cos(angle);
            let yPos = die.cartesian.pos.y + die.radius * Math.sin(angle);
            theContext.fillStyle = "blue";
            theContext.lineWidth = 1;
            theContext.beginPath();
            theContext.arc(xPos, theCanv.height - yPos, 10, 0, 2 * Math.PI);
            theContext.fill();
        }
    }
    function moveDie(theDie, timeDelta, theCanv, theContext) {
        // Update Velocity
        die.cartesian.vel.x += die.cartesian.acc.x * timeDelta;
        die.cartesian.vel.y += die.cartesian.acc.y * timeDelta;
        die.polar.vel += die.polar.acc * timeDelta;
        // Determine Imminent Collisions and when they will occur
        let goAgain = true;
        while (goAgain) {
            goAgain = false;
            let partialTimeDeltas = [timeDelta, timeDelta, timeDelta, timeDelta];
            for (let vertex = 0; vertex < 4; vertex++) {
                // Check where this point will move to
                const nextYPosition = getVertexPosY(die, vertex, timeDelta);
                // Check if the vertex will be beyond the boundary
                if (nextYPosition >= 0.0)
                    continue;
                // Use the bisection method to identify the approximate intersection time
                const iterations = 4;
                let fractionalTime = 0.5;
                for (let i = 0; i < iterations; i++) {
                    const fractionalTimeAdjustment = Math.pow(2, (-i - 2));
                    if (getVertexPosY(die, vertex, timeDelta * fractionalTime) > 0.0) {
                        fractionalTime += fractionalTimeAdjustment;
                    }
                    else {
                        fractionalTime -= fractionalTimeAdjustment;
                    }
                }
                partialTimeDeltas[vertex] = timeDelta * fractionalTime;
            }
            // Move time forward until timeDelta or next collision
            let timeStep = Math.min(...partialTimeDeltas);
            die.cartesian.pos.x += die.cartesian.vel.x * timeStep + die.cartesian.acc.x * timeStep * timeStep / 2;
            die.cartesian.pos.y += die.cartesian.vel.y * timeStep + die.cartesian.acc.y * timeStep * timeStep / 2;
            die.polar.pos += die.polar.vel * timeStep + die.polar.acc * timeStep * timeStep / 2;
            die.cartesian.vel.x += die.cartesian.acc.x * timeStep;
            die.cartesian.vel.y += die.cartesian.acc.y * timeStep;
            die.polar.vel += die.polar.acc * timeStep;
            // Check if there is more time to simulate
            if (timeStep < timeDelta) {
                // Alter velocity using instant forces
                let mass = 4;
                let momentOfInertia = 4;
                let linerMomentum = die.cartesian.vel.y * mass;
                let linerEnegry = die.cartesian.vel.y * die.cartesian.vel.y * mass / 2;
                let angularMomentum = die.polar.vel * momentOfInertia;
                let angularEnergy = die.polar.vel * die.polar.vel * momentOfInertia / 2;
                let totalMomentum = Math.abs(linerMomentum) + Math.abs(angularMomentum);
                let totalEnergy = linerEnegry + angularEnergy;
                // Move time forward, and go again
                timeDelta -= timeStep;
                goAgain = true;
            }
        }
        // Update Position
        die.cartesian.pos.x += die.cartesian.vel.x * timeDelta;
        die.cartesian.pos.y += die.cartesian.vel.y * timeDelta;
        die.polar.pos += die.polar.vel * timeDelta;
    }
    function getVertexPosY(die, vertex, timeDelta) {
        const cPos = die.cartesian.pos.y;
        const cVel = die.cartesian.vel.y;
        const cAcc = die.cartesian.acc.y;
        const r = die.radius;
        const pPos = die.polar.pos;
        const pVel = die.polar.vel;
        const pAcc = die.polar.acc;
        const t = timeDelta;
        const cPosNew = cPos + cVel * t + cAcc * t * t / 2;
        const pPosNew = pPos + pVel * t + pAcc * t * t / 2;
        const newVertexPosition = cPosNew + r * Math.cos(pPosNew + vertex * Math.PI / 2);
        return newVertexPosition;
    }
    // Setup Time
    let previousTime;
    let currentTime = performance.now();
    let timeDelta;
    function animate() {
        // Confirm canvas and context are not null
        if (!canv) {
            throw new Error("Cannot find myCanvas element");
        }
        if (!context) {
            throw new Error("Cannot acquire 2d context for myCanvas element");
        }
        // Update Time
        previousTime = currentTime;
        currentTime = performance.now();
        timeDelta = (currentTime - previousTime) / 1000;
        // Move die
        moveDie(die, timeDelta, canv, context);
        // Draw die
        drawDie(die, canv, context);
        window.requestAnimationFrame(animate);
    }
    window.requestAnimationFrame(animate);
}
