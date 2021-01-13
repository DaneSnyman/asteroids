const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

// * Helpers
// Key presses
const key = {};
let deg = 0;
addEventListener("keydown", (ev) => {
  if (ev.code === "ArrowUp") key.up = true;
  if (ev.code === "ArrowLeft") key.left = true;
  if (ev.code === "ArrowRight") key.right = true;
  if (ev.code === "Space") key.space = true;
});
addEventListener("keyup", (ev) => {
  if (ev.code === "ArrowUp") key.up = false;
  if (ev.code === "ArrowLeft") key.left = false;
  if (ev.code === "ArrowRight") key.right = false;
  if (ev.code === "Space") key.space = false;
});

const getDistance = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const randomizer = (max, isInt, min) => {
  const random = min ? Math.random() * (max - min) + min : Math.random() * max;
  return isInt ? Math.floor(random) : random;
};

const randomPosNeg = (num) => {
  return Math.random() > 0.5 ? num : -num;
};

// * Classes
class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 20;
    this.deg = 0;
    this.rotationSpeed = 4;
    this.friction = 0.0001;
    this.initialThrust = 0.1;
    this.thrust = {
      x: 0,
      y: 0,
    };
  }

  setSpeedAngle(thrust, deg, sin) {
    return sin
      ? thrust * Math.sin((deg * Math.PI) / 180)
      : thrust * Math.cos((deg * Math.PI) / 180);
  }

  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((this.deg * Math.PI) / 180);
    ctx.moveTo(this.width / 2, 0);
    ctx.lineTo(-this.width / 2, this.height / 2);
    ctx.lineTo(-this.width / 2, -this.height / 2);
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.restore();
  }

  update() {
    // Ship Movement
    if (key.up) {
      this.thrust.x += this.setSpeedAngle(this.initialThrust, this.deg);
      this.thrust.y += this.setSpeedAngle(this.initialThrust, this.deg, true);
    } else {
      this.thrust.x -= this.friction * this.thrust.x;
      this.thrust.y -= this.friction * this.thrust.y;
    }
    if (key.left) this.deg -= this.rotationSpeed;
    if (key.right) this.deg += this.rotationSpeed;

    this.x += this.thrust.x;
    this.y += this.thrust.y;

    // Boundary handling
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
    this.draw();
  }
}

class Asteroid {
  constructor(x, y, r, xSpeed, ySpeed) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  update() {
    // Asteroid Movement
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    console.log("lol");
    // Ship go boom
    console.log(ship.x);

    if (getDistance(this.x, this.y, ship.x, ship.y) > this.r * 3) {
      startGame();
    }

    // Boundary handling
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
    this.draw();
  }
}

// * Animation loop and init
let ship;
let asteroids = [];
const animate = () => {
  if (canvas.width !== innerWidth || canvas.height !== innerHeight) {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  }
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ship.update();

  asteroids.forEach((asteroid) => {
    asteroid.update();
  });
};

const startGame = () => {
  ship = new Ship(canvas.width / 2, canvas.height / 2);
  asteroids = [];
  const asteroidNum = 5;
  for (let i = 0; i < asteroidNum; i++) {
    const r = randomizer(50, true, 10);
    const x = randomizer(canvas.width - r, true, 0 + r);
    const y = randomizer(canvas.height - r, true, 0 + r);
    const xSpeed = randomPosNeg(randomizer(3));
    const ySpeed = randomPosNeg(randomizer(3));
    asteroids.push(new Asteroid(x, y, r, xSpeed, ySpeed));
  }
};

const init = () => {
  startGame();
  animate();
};

init();
