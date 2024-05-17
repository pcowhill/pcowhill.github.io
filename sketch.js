let canv = document.getElementById('myCanvas').getContext("2d");
let isLeft = false;
let isUp = false;
let isRight = false;
let isDown = false;

// Classes

class Player {
  constructor() {
    this.px = 280;
    this.py = 290;
    this.width = 40;
    this.height = 60;
    this.vy = 0;
    this.ay = .5;
  }
  
  move() {
    this.vy += this.ay;
    this.py += this.vy;
    if(this.py>=290) {
      this.py = 290;
      this.vy = 0;
    }
  }
}
let you = new Player;

class Cloud {
  constructor(x,y,w,h,v) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.v = v;
  }
  moveRight() {
    this.x -= this.v;
  }
  moveLeft() {
    this.x += this.v;
  }
}

class Spike {
  constructor(x) {
    this.y = 330;
    this.x = x;
    this.w = 40;
    this.h = 20;
    this.v = 5;
  }
  moveRight() {
    this.x -= this.v;
  }
  moveLeft() {
    this.x += this.v;
  }
}

class Goal {
  constructor(x) {
    this.x = x;
    this.y = 310;
    this.w = 40;
    this.h = 40;
    this.v = 5;
  }
  moveRight() {
    this.x -= this.v;
  }
  moveLeft() {
    this.x += this.v;
  }
}

// Document Listeners

document.addEventListener('keydown', function(event) {
  if(event.keyCode == 37) {
    isLeft = true;
  } else if(event.keyCode == 38) {
    isUp = true;
  } else if(event.keyCode == 39) {
    isRight = true;
  } else if(event.keyCode == 40) {
    isDown = true;
  }
}, true);

document.addEventListener('keyup', function(event) {
  if(event.keyCode == 37) {
    isLeft = false;
  } else if(event.keyCode == 38) {
    isUp = false;
  } else if(event.keyCode == 39) {
    isRight = false;
  } else if(event.keyCode == 40) {
    isDown = false;
  }
}, true);

// Functions

function draw() {
  // Background
  canv.fillStyle = "rgb(0,191,255)";
  canv.fillRect(0,0,600,400);
  // Floor
  canv.fillStyle = "black";
  canv.fillRect(0,350,600,50);
  // Clouds
  canv.fillStyle = "white";
  for(let i = 0; i < clouds.length; i++) {
    canv.fillRect(clouds[i].x, clouds[i].y, clouds[i].w, clouds[i].h);
  }
  // Spikes
  canv.fillStyle = "rgb(200,0,100)";
  for(let i = 0; i < spikes.length; i++) {
    canv.fillRect(spikes[i].x, spikes[i].y, spikes[i].w, spikes[i].h);
  }
  // Goal
  canv.fillStyle = "rgb(0,173,0)";
  canv.fillRect(goal.x, goal.y, goal.w, goal.h);
  // Player
  canv.fillStyle = "red";
  canv.fillRect(you.px, you.py, you.width, you.height);
}

// Level Creation

let clouds = new Array(100);
for(let i = 0; i < clouds.length; i++) {
  clouds[i] = new Cloud(Math.random()*10000, Math.random()*200, 100+Math.random()*150, 50+Math.random()*50, 1+Math.random()*2);
}

let spikes = new Array(20);
for(let i = 0; i < spikes.length; i++) {
  spikes[i] = new Spike(600+i*300+Math.random()*100);
}

let goal = new Goal(7000);

// Timer

let timer = setInterval(function() {
  
  for(let i = 0; i < spikes.length; i++) {
    if(spikes[i].x < 320 && spikes[i].x > 240) {
      if(you.py > 270) {
        alert('Ouch!');
        location.reload();
      }
    }
  }
  if(goal.x < 320 && goal.x > 240) {
    if(you.py > 250) {
      alert('You made it to the Goal!');
      location.reload();
    }
  }
  if(isUp && you.py==290) {
    you.vy = -15;
  }
  you.move();
  if(isRight) {
    for(let i = 0; i < clouds.length; i++) {
      clouds[i].moveRight();
    }
    for(let i = 0; i < spikes.length; i++) {
      spikes[i].moveRight();
    }
    goal.moveRight();
  }
  if(isLeft) {
    for(let i = 0; i < clouds.length; i++) {
      clouds[i].moveLeft();
    }
    for(let i = 0; i < spikes.length; i++) {
      spikes[i].moveLeft();
    }
    goal.moveLeft();
  }
  draw();
  
}, 10)
draw();