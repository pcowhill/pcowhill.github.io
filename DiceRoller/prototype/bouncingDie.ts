export function bouncingDie() {
  // Import the canvas
  const canv = document.getElementById("myCanvas") as HTMLCanvasElement | null;
  if (!canv) {
    throw new Error("Cannot find myCanvas element");
  }
  const context = canv.getContext("2d") as CanvasRenderingContext2D | null;
  if (!context) {
    throw new Error("Cannot acquire 2d context for myCanvas element");
  }

  // Set the height and width
  canv.width = 600;
  canv.height = 600;

  context.fillStyle = "rgb(240,240,240)";
  context.fillRect(0, 0, canv.width, canv.height);

  // Set up the die
  type xy = { x: number, y: number }
  type xyPosVelAcc = { pos: xy, vel: xy, acc: xy }
  type polarPosVelAcc = { pos: number, vel: number, acc: number }
  type Die = {
    cartesian: xyPosVelAcc,
    polar: polarPosVelAcc,
    radius: number,
    mass: number, 
    momentOfInertia: number
  }
  let die: Die = {
    cartesian: {
      pos: { x: 3, y: 3 },
      vel: { x: 0, y: 0 },
      acc: { x: 0, y: -9.8 }
    },
    polar: {
      pos: Math.PI/4,
      vel: 0,
      acc: 0
    },
    radius: 0.5,
    mass: 5,
    momentOfInertia: 1/12*5*(1*1) // https://en.wikipedia.org/wiki/List_of_moments_of_inertia
  }

  function drawDie(theDie: Die, theCanv: HTMLCanvasElement, theContext: CanvasRenderingContext2D) {
    // Draw Background
    theContext.fillStyle = "rgb(240, 240, 240)";
    theContext.fillRect(0, 0, theCanv.width, theCanv.height);

    // Convert 2-D space to image space
    const metersPerPixelScale: number = 0.01;
    const posX: number = die.cartesian.pos.x / metersPerPixelScale;
    const posY: number = die.cartesian.pos.y / metersPerPixelScale;
    const radius: number = die.radius / metersPerPixelScale;

    // Draw Center
    theContext.fillStyle = "red";
    theContext.beginPath();
    theContext.arc(posX, theCanv.height - posY, 10, 0, 2 * Math.PI);
    theContext.fill();
    theContext.stroke();

    // Draw Edges
    for (let edge: number = 0; edge < 4; edge++) {
      let angle1: number = die.polar.pos + edge * Math.PI / 2;
      let xPos1: number = posX + radius * Math.cos(angle1);
      let yPos1: number = posY + radius * Math.sin(angle1);
      let angle2: number = die.polar.pos + (edge + 1) * Math.PI / 2;
      let xPos2: number = posX + radius * Math.cos(angle2);
      let yPos2: number = posY + radius * Math.sin(angle2);
      theContext.strokeStyle = "orange";
      theContext.lineWidth = 10;
      theContext.beginPath();
      theContext.moveTo(xPos1, theCanv.height - yPos1);
      theContext.lineTo(xPos2, theCanv.height - yPos2)
      theContext.stroke();
    }

    // Draw Vertices
    for (let vertex: number = 0; vertex < 4; vertex++) {
      let angle: number = die.polar.pos + vertex * Math.PI / 2;
      let xPos: number = posX + radius * Math.cos(angle);
      let yPos: number = posY + radius * Math.sin(angle);
      theContext.fillStyle = "blue";
      theContext.lineWidth = 1;
      theContext.beginPath();
      theContext.arc(xPos, theCanv.height - yPos, 10, 0, 2 * Math.PI);
      theContext.fill();
    }
  }

  function moveDie(theDie: Die, timeDelta: number, theCanv: HTMLCanvasElement, theContext: CanvasRenderingContext2D) {

    // Update velocity using acceleration
    die.cartesian.vel.x += die.cartesian.acc.x * timeDelta;
    die.cartesian.vel.y += die.cartesian.acc.y * timeDelta;
    die.polar.vel += die.polar.acc * timeDelta;

    // Handle collisions and update position using velocity
    let maximumChecks: number = 10;
    for (let checkNumber: number = 0; checkNumber < maximumChecks; checkNumber++) {
      let partialTimeDeltas: number[] = [timeDelta, timeDelta, timeDelta, timeDelta];
      for (let vertex: number = 0; vertex < 4; vertex++) {
        // Check where this point will move to
        const nextYPosition = getVertexPosY(die, vertex, timeDelta);

        // Check if the vertex will be beyond the boundary
        if (nextYPosition >= 0.0) continue;

        // Use the bisection method to identify the approximate intersection time
        const iterations = 4;
        let fractionalTime = 0.5;
        for (let i: number = 0; i < iterations; i++) {
          const fractionalTimeAdjustment = 2**(-i - 2);
          if (getVertexPosY(die, vertex, timeDelta*fractionalTime) > 0.0) {
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
      if (timeStep >= timeDelta) break;

      // Alter velocity using instant forces for any colliding vertex
      for (let vertex: number = 0; vertex < 4; vertex++) {
        if (partialTimeDeltas[vertex] <= timeStep) { // == should be fine since they should be equal, but <= is more cautious
          const phi: number = die.polar.pos + vertex * Math.PI / 2 - Math.PI;
          const v_i: number = -die.cartesian.vel.y;
          const w_i: number = die.polar.vel;
          const m: number = die.mass;
          const I: number = die.momentOfInertia;

          const cos_phi: number = Math.cos(phi);

          const v_f: number = v_i - 2*(v_i + w_i*cos_phi)/(1 + m*cos_phi*cos_phi/I);
          const w_f: number = w_i - 2*(w_i*cos_phi*cos_phi + v_i*cos_phi)/(I/m + cos_phi*cos_phi);

          die.polar.vel = w_f;
          die.cartesian.vel.y = -v_f;
        }
      }
      
      // Move time forward, and go again
      timeDelta -= timeStep;
    }
  }

  function getVertexPosY(die: Die, vertex: number, timeDelta: number) {
    const cPos = die.cartesian.pos.y;
    const cVel = die.cartesian.vel.y;
    const cAcc = die.cartesian.acc.y;
    const r = die.radius;
    const pPos = die.polar.pos;
    const pVel = die.polar.vel;
    const pAcc = die.polar.acc;
    const t = timeDelta;

    const cPosNew = cPos + cVel*t + cAcc*t*t/2;
    const pPosNew = pPos + pVel*t + pAcc*t*t/2;

    const newVertexPosition = cPosNew + r * Math.sin(pPosNew + vertex*Math.PI/2);
    return newVertexPosition;
  }

  // Setup Time
  let previousTime: number;
  let currentTime: number = performance.now();
  let timeDelta: number;

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
