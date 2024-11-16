export function bouncingDot() {
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

  type xyCoordinate = { x: number; y: number; };

  let dotPos: xyCoordinate = { x: 100, y: 400 };
  let dotVel: xyCoordinate = { x: 0, y: 0 };
  let dotAcc: xyCoordinate = { x: 0, y: -400 };

  let previousTime: number;
  let currentTime: number = performance.now();
  let timeDelta: number;

  function animate() {
    // Confirm canvas and context are not null
    if (!canv) {
      throw new Error("Cannot find myCanvas element");
    }
    const context = canv.getContext("2d") as CanvasRenderingContext2D | null;
    if (!context) {
      throw new Error("Cannot acquire 2d context for myCanvas element");
    }

    // Update Time
    previousTime = currentTime;
    currentTime = performance.now();
    timeDelta = (currentTime - previousTime) / 1000;

    // Update dot
    dotPos.x += dotVel.x * timeDelta;
    dotPos.y += dotVel.y * timeDelta;
    dotVel.x += dotAcc.x * timeDelta;
    dotVel.y += dotAcc.y * timeDelta;
    if (dotPos.y < 0) {
      dotVel.y = -0.9 * dotVel.y;
      dotPos.y = 0;
      dotAcc.y = 0;
      if (Math.abs(dotVel.y) < 0.001) {
        console.log("Done!");
        return;
      }
    } else {
      dotAcc.y = -400;
    }

    // Draw dot
    context.fillStyle = "rgb(240,240,240)";
    context.fillRect(0, 0, canv.width, canv.height);
    context.fillStyle = "green";
    context.beginPath();
    context.arc(dotPos.x, canv.height - dotPos.y, 10, 0, 2 * Math.PI);
    context.fill();
    context.stroke();

    if (dotPos.x > 2 * canv.width || dotPos.x < -canv.width || dotPos.y > 2 * canv.height || dotPos.y < -canv.height) {
      console.log("Done!");
      return;
    }

    window.requestAnimationFrame(animate);
  }

  window.requestAnimationFrame(animate);

}