let canv = document.getElementById("myCanvas").getContext("2d");

// Verticies in Cartesian Coordinates
// x,y,z
s = 200; // Half of one side
pi = Math.PI;
let vert = new Array(8);
vert[0] = [s, s,s]
vert[1] = [s, s,-s]
vert[2] = [s, -s,s]
vert[3] = [s, -s,-s]
vert[4] = [-s, s,s]
vert[5] = [-s, s,-s]
vert[6] = [-s, -s,s]
vert[7] = [-s, -s,-s]


function draw() {
  canv.fillStyle = "rgb(99,99,99)";
  canv.fillRect(0,0,400,400);
  canv.fillStyle = "rgb(0,0,0)";
  let spot = new Array(8);
  for(let i = 0; i<spot.length;i++) {
    spot[i] = vert[i].slice();
    spot[i][2] +=1000;
    spot[i][0] = spot[i][0]/spot[i][2]*300;
    spot[i][1] = spot[i][1]/spot[i][2]*300;
  }
  for(let i = 0; i<spot.length;i++) {
    canv.beginPath();
    canv.arc(spot[i][0]+200,spot[i][1]+200, 5, 0, 2*Math.PI, true);
    canv.stroke();
  }
  canv.beginPath();
  canv.moveTo(spot[0][0]+200,spot[0][1]+200);
  canv.lineTo(spot[1][0]+200,spot[1][1]+200);
  canv.lineTo(spot[3][0]+200,spot[3][1]+200);
  canv.lineTo(spot[2][0]+200,spot[2][1]+200);
  canv.lineTo(spot[0][0]+200,spot[0][1]+200);
  canv.lineTo(spot[4][0]+200,spot[4][1]+200);
  canv.lineTo(spot[5][0]+200,spot[5][1]+200);
  canv.lineTo(spot[7][0]+200,spot[7][1]+200);
  canv.lineTo(spot[6][0]+200,spot[6][1]+200);
  canv.lineTo(spot[4][0]+200,spot[4][1]+200);
  canv.stroke();
  canv.moveTo(spot[1][0]+200,spot[1][1]+200);
  canv.lineTo(spot[5][0]+200,spot[5][1]+200);
  canv.stroke();
  canv.moveTo(spot[2][0]+200,spot[2][1]+200);
  canv.lineTo(spot[6][0]+200,spot[6][1]+200);
  canv.stroke();
  canv.moveTo(spot[3][0]+200,spot[3][1]+200);
  canv.lineTo(spot[7][0]+200,spot[7][1]+200);
  canv.stroke();
}

function rotatePhi() { //Clockwise
  for(let i = 0; i<vert.length;i++) {
    radius = Math.sqrt(vert[i][0]**2+vert[i][1]**2)
    angle = Math.acos(vert[i][0]/radius);
    if(vert[i][1]<0) {
      angle = Math.PI*2-angle;
    }
    angle += .1;
    vert[i][0] = radius*Math.cos(angle);
    vert[i][1] = radius*Math.sin(angle);
    draw();
  }
}

function rotatePhi2() { //CounterClockwise
  for(let i = 0; i<vert.length;i++) {
    radius = Math.sqrt(vert[i][0]**2+vert[i][1]**2)
    angle = Math.acos(vert[i][0]/radius);
    if(vert[i][1]<0) {
      angle = Math.PI*2-angle;
    }
    angle -= .1;
    vert[i][0] = radius*Math.cos(angle);
    vert[i][1] = radius*Math.sin(angle);
    draw();
  }
}

function rotateTheta() { //Up
  for(let i = 0; i<vert.length;i++) {
    radius = Math.sqrt(vert[i][1]**2+vert[i][2]**2)
    angle = Math.acos(vert[i][1]/radius);
    if(vert[i][2]<0) {
      angle = Math.PI*2-angle;
    }
    angle -= .1;
    vert[i][1] = radius*Math.cos(angle);
    vert[i][2] = radius*Math.sin(angle);
    draw();
  }
}

function rotateTheta2() { //Down
  for(let i = 0; i<vert.length;i++) {
    radius = Math.sqrt(vert[i][1]**2+vert[i][2]**2)
    angle = Math.acos(vert[i][1]/radius);
    if(vert[i][2]<0) {
      angle = Math.PI*2-angle;
    }
    angle += .1;
    vert[i][1] = radius*Math.cos(angle);
    vert[i][2] = radius*Math.sin(angle);
    draw();
  }
}

function rotateRight() { //Right
  for(let i = 0; i<vert.length;i++) {
    radius = Math.sqrt(vert[i][0]**2+vert[i][2]**2)
    angle = Math.acos(vert[i][0]/radius);
    if(vert[i][2]<0) {
      angle = Math.PI*2-angle;
    }
    angle += .1;
    vert[i][0] = radius*Math.cos(angle);
    vert[i][2] = radius*Math.sin(angle);
    draw();
  }
}

function rotateLeft() { //Left
  for(let i = 0; i<vert.length;i++) {
    radius = Math.sqrt(vert[i][0]**2+vert[i][2]**2)
    angle = Math.acos(vert[i][0]/radius);
    if(vert[i][2]<0) {
      angle = Math.PI*2-angle;
    }
    angle -= .1;
    vert[i][0] = radius*Math.cos(angle);
    vert[i][2] = radius*Math.sin(angle);
    draw();
  }
}

draw();