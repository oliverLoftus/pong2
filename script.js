// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get the centre of the canvas
const centreX = canvas.width / 2;
const centreY = canvas.height / 2;

// Set scores
let leftPlayerScore = 0;
let rightPlayerScore = 0;

// Define a class for managing velocity
class Velocity {
    constructor(initialValue) {
        this.value = initialValue;
    }

    // Method to change the velocity component
    set(value) {
        this.value = value;
    }

    // Method to add a value to the velocity component
    add(value) {
        this.value += value;
    }

    // Method to bounce the velocity component
    bounce() {
        this.value = -this.value;
    }
}

// Define a class for game objects
class GameObject {
    constructor(rect, velocities) {
        this.rect = rect;
        this.velocities = velocities;
    }

    // Method to update the position of the object
    updatePosition() {
        this.rect.x += this.velocities.x.value;
        this.rect.y += this.velocities.y.value;
    }

    // Method to draw the object on the canvas
    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    }

    // Method to get the rectangle of the object
    getRect() {
        return this.rect;
    }
}

// Define the ball object
const ballRect = { x: centreX, y: centreY, w: 10, h: 10 };
const ballVelocities = { x: new Velocity(3), y: new Velocity(0) };
const ball = new GameObject(ballRect, ballVelocities);

// Define the left paddle
const leftPaddleRect = { x: 10, y: centreY - 40, w: 10, h: 80 };
const leftPaddleVelocities = { y: new Velocity(0) };
const leftPaddle = new GameObject(leftPaddleRect, leftPaddleVelocities);

// Define the right paddle
const rightPaddleRect = { x: canvas.width - 20, y: centreY - 40, w: 10, h: 80 };
const rightPaddleVelocities = { y: new Velocity(0) };
const rightPaddle = new GameObject(rightPaddleRect, rightPaddleVelocities);

// Function to check if two game objects intersect
function intersect(object1, object2) {
    const rect1 = object1.getRect();
    const rect2 = object2.getRect();

    return (
        rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y
    );
}

// Bounce randomness
function randomizeBounce() {
    // range -0.5 and 0.5
    return Math.random() - 0.5;
}

// Function to update the game state
function update() {
    moveBall();
    handleBallCollisions();
    checkScoring();
    drawGameElements();
    requestAnimationFrame(update);
}

// Function to update the ball's position
function moveBall() {
    ball.updatePosition();
}

// Function to handle ball collisions
function handleBallCollisions() {
    handleBoundaryCollisions();
    handlePaddleCollisions();
}

// Function to handle boundary collisions
function handleBoundaryCollisions() {
    if (ball.getRect().y < 0 || ball.getRect().y + ball.getRect().h > canvas.height) {
        ball.velocities.y.bounce();
        ball.velocities.x.add(randomizeBounce());
    }
}

// Function to handle paddle collisions
function handlePaddleCollisions() {
    if (intersect(ball, leftPaddle)) {
        ball.velocities.x.bounce();
        ball.velocities.y.add(randomizeBounce());
    }

    if (intersect(ball, rightPaddle)) {
        ball.velocities.x.bounce();
        ball.velocities.y.add(randomizeBounce());
    }
}

// Function to check for scoring and reset the ball's position
function checkScoring() {
    if (ball.getRect().x < 0) {
        resetBallPosition(3, -1); // Right player scores a point
        ball.velocities.y.add(randomizeBounce());
        rightPlayerScore++;
    }

    if (ball.getRect().x + ball.getRect().w > canvas.width) {
        resetBallPosition(-3, 1); // Left player scores a point
        ball.velocities.y.add(randomizeBounce());
        leftPlayerScore++;
    }
}

// Function to reset the ball's position
function resetBallPosition(velX, velY) {
    ball.getRect().x = centreX;
    ball.getRect().y = centreY;
    ball.velocities.x.set(velX);
    ball.velocities.y.set(velY);
}

// Function to draw game elements on the canvas
function drawGameElements() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    leftPaddle.draw();
    rightPaddle.draw();

    // Draw the scores in the middle
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    const scores = `${leftPlayerScore} : ${rightPlayerScore}`;
    const textWidth = ctx.measureText(scores).width;
    const x = (canvas.width - textWidth) / 2;
    const y = 48;
    ctx.fillText(scores, x, y);
}

// Event listeners to control the left paddle with arrow keys
document.addEventListener("keydown", (event) => {
    if (event.key === "w" && leftPaddle.rect.y > 0) {
        leftPaddle.rect.y -= 10;
    } else if (event.key === "s" && leftPaddle.rect.y + leftPaddle.rect.h < canvas.height) {
        leftPaddle.rect.y += 10;
    }

    // Right paddle controls
    if (event.key === "ArrowUp" && rightPaddle.rect.y > 0) {
        rightPaddle.rect.y -= 10;
    } else if (event.key === "ArrowDown" && rightPaddle.rect.y + rightPaddle.rect.h < canvas.height) {
        rightPaddle.rect.y += 10;
    }
});

// Initial draw of the game
update();
