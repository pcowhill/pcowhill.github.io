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
            pos: { x: 3, y: 3 },
            vel: { x: 0, y: 0 },
            acc: { x: 0, y: -9.8 }
        },
        polar: {
            pos: Math.PI / 4,
            vel: 0,
            acc: 0
        },
        radius: 2,
        mass: 5,
        momentOfInertia: 1 / 3 * ((5)) * Math.pow((((2))), 2) // ((mass)) (((radius))) https://en.wikipedia.org/wiki/List_of_moments_of_inertia
    };
    function drawDie(theDie, theCanv, theContext) {
        // Draw Background
        theContext.fillStyle = "rgb(240, 240, 240)";
        theContext.fillRect(0, 0, theCanv.width, theCanv.height);
        // Convert 2-D space to image space
        const metersPerPixelScale = 0.01;
        const posX = die.cartesian.pos.x / metersPerPixelScale;
        const posY = die.cartesian.pos.y / metersPerPixelScale;
        const radius = die.radius / metersPerPixelScale;
        // Draw Center
        theContext.fillStyle = "red";
        theContext.beginPath();
        theContext.arc(posX, theCanv.height - posY, 10, 0, 2 * Math.PI);
        theContext.fill();
        theContext.stroke();
        // Draw Edges
        for (let edge = 0; edge < 4; edge++) {
            let angle1 = die.polar.pos + edge * Math.PI / 2;
            let xPos1 = posX + radius * Math.cos(angle1);
            let yPos1 = posY + radius * Math.sin(angle1);
            let angle2 = die.polar.pos + (edge + 1) * Math.PI / 2;
            let xPos2 = posX + radius * Math.cos(angle2);
            let yPos2 = posY + radius * Math.sin(angle2);
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
            let xPos = posX + radius * Math.cos(angle);
            let yPos = posY + radius * Math.sin(angle);
            theContext.fillStyle = "blue";
            theContext.lineWidth = 1;
            theContext.beginPath();
            theContext.arc(xPos, theCanv.height - yPos, 10, 0, 2 * Math.PI);
            theContext.fill();
        }
        // Draw Vertex Labels
        for (let vertex = 0; vertex < 4; vertex++) {
            let angle = die.polar.pos + vertex * Math.PI / 2;
            let xPos = posX + radius * Math.cos(angle);
            let yPos = posY + radius * Math.sin(angle);
            theContext.fillStyle = "green";
            theContext.font = "32px serif";
            theContext.fillText(theDie.cartesian.pos.y.toString(), xPos, theCanv.height - yPos);
        }
        // Draw Energy
        const v = theDie.cartesian.vel.y;
        const m = theDie.mass;
        const w = theDie.polar.vel;
        const I = theDie.momentOfInertia;
        const g = theDie.cartesian.acc.y;
        const h = theDie.cartesian.pos.y;
        const Energy = m * v * v / 2 + I * w * w / 2 - 2 * m * g * h;
        theContext.fillStyle = "black";
        theContext.font = "32px serif";
        theContext.fillText("Energy: " + Energy.toString(), 10, 30);
        theContext.fillText("MGH: " + (-m * g * h).toString(), 10, 100);
    }
    function moveDie(theDie, timeDelta, theCanv, theContext) {
        // Update velocity using acceleration
        die.cartesian.vel.x += die.cartesian.acc.x * timeDelta;
        die.cartesian.vel.y += die.cartesian.acc.y * timeDelta;
        die.polar.vel += die.polar.acc * timeDelta;
        // Handle collisions and update position using velocity
        let maximumChecks = 10;
        for (let checkNumber = 0; checkNumber < maximumChecks; checkNumber++) {
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
            if (timeStep >= timeDelta)
                break;
            // Alter velocity using instant forces for any colliding vertex
            for (let vertex = 0; vertex < 4; vertex++) {
                if (partialTimeDeltas[vertex] <= timeStep) { // == should be fine since they should be equal, but <= is more cautious
                    const phi = die.polar.pos + vertex * Math.PI / 2 - Math.PI;
                    const v_i = -die.cartesian.vel.y;
                    const w_i = die.polar.vel;
                    const m = die.mass;
                    const I = die.momentOfInertia;
                    const cos_phi = Math.cos(phi);
                    const v_f = v_i - 2 * (v_i + w_i * cos_phi) / (1 + m * cos_phi * cos_phi / I);
                    const w_f = w_i - 2 * (w_i * cos_phi * cos_phi + v_i * cos_phi) / (I / m + cos_phi * cos_phi);
                    const E_i = v_i * v_i * m / 2 + w_i * w_i * I / 2;
                    const E_f = v_f * v_f * m / 2 + w_f * w_f * I / 2;
                    die.polar.vel = w_f;
                    die.cartesian.vel.y = -v_f;
                }
            }
            // Move time forward, and go again
            timeDelta -= timeStep;
        }
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
        const newVertexPosition = cPosNew + r * Math.sin(pPosNew + vertex * Math.PI / 2);
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
