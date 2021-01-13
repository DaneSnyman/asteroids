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

// * Classes
// Ship
class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = canvas.width / 50;
    this.height = canvas.height / 100;
    this.deg = 0;
    this.currentDeg = 0;
    this.inertiaDeg = 0;
    this.speed = 0;
    this.currentSpeed = 0;
    this.inertiaSpeed = 0;
    this.drifting = false;
  }

  setSpeedAngle(speed, deg, sin) {
    return sin
      ? speed * Math.sin((deg * Math.PI) / 180)
      : speed * Math.cos((deg * Math.PI) / 180);
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
    // Key bindings
    if (key.up) {
      if (this.inertiaSpeed > 0) {
        this.inertiaSpeed -= 0.05;
        this.currentSpeed = this.inertiaSpeed;
        this.x += this.setSpeedAngle(this.inertiaSpeed, this.currentDeg);
        this.y += this.setSpeedAngle(this.inertiaSpeed, this.currentDeg, true);
      } else {
        if (this.speed < 10) this.speed += 0.05;
        this.x += this.setSpeedAngle(this.speed, this.deg);
        this.y += this.setSpeedAngle(this.speed, this.deg, true);
        this.currentDeg = this.deg;
        this.currentSpeed = this.speed;
      }
    } else {
      if (this.currentSpeed > 0) {
        this.speed = 0;
        this.x += this.setSpeedAngle(this.currentSpeed, this.currentDeg);
        this.y += this.setSpeedAngle(this.currentSpeed, this.currentDeg, true);
        this.inertiaSpeed = this.currentSpeed;
      }
    }
    if (key.left) this.deg -= 2;
    if (key.right) this.deg += 2;

    // Boundary handling
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
    this.draw();
  }
}

class Asteroid {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 30;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = "white";
    ctx.stroke();
  }

  update() {
    this.draw();
  }
}

// * Animation loop and init
const ship = new Ship(canvas.width / 2, canvas.height / 2);
const asteroids = [];
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

const init = () => {
  for (let i = 0; i < 1; i++) {
    asteroids.push(new Asteroid(500, 500));
  }
  animate();
};

init();
