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
    constructor(rect, velocity) {
        this.rect = rect;
        this.velocity = velocity;
    }

    // Method to update the position of the object
    updatePosition() {
        this.rect.x += this.velocity.x.value;
        this.rect.y += this.velocity.y.value;
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

// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Get the centre of the canvas
const centreX = canvas.width / 2;
const centreY = canvas.height / 2;

// Set scores
let leftPlayerScore = 0;
let rightPlayerScore = 0;

// Define the ball object
const ballRect = { x: centreX, y: centreY, w: 10, h: 10 };
const ballVelocity = { x: new Velocity(3), y: new Velocity(0) };
const ball = new GameObject(ballRect, ballVelocity);

// Define the left paddle
const leftPaddleRect = { x: 10, y: centreY - 40, w: 10, h: 80 };
const leftPaddleVelocity = { y: new Velocity(0) };
const leftPaddle = new GameObject(leftPaddleRect, leftPaddleVelocity);

// Define the right paddle
const rightPaddleRect = { x: canvas.width - 20, y: centreY - 40, w: 10, h: 80 };
const rightPaddleVelocity = { y: new Velocity(0) };
const rightPaddle = new GameObject(rightPaddleRect, rightPaddleVelocity);

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

// Rect edge functions
const topEdge = (object) => object.getRect().y;
const bottomEdge = (object) => object.getRect().y + object.getRect().h;
const leftEdge = (object) => object.getRect().x;
const rightEdge = (object) => object.getRect().x + object.getRect().w;

// Bounce randomness
function randomness() {
    // Range -0.5 and 0.5
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
    if (topEdge(ball) < 0 || bottomEdge(ball) > canvas.height) {
        ball.velocity.y.bounce();
        ball.velocity.x.add(randomness());
    }
}

// Function to handle paddle collisions
function handlePaddleCollisions() {
    if (intersect(ball, leftPaddle)) {
        ball.velocity.x.bounce();
        ball.velocity.y.add(randomness());
    }

    if (intersect(ball, rightPaddle)) {
        ball.velocity.x.bounce();
        ball.velocity.y.add(randomness());
    }
}

// Function to check for scoring and reset the ball's position
function checkScoring() {
    if (leftEdge(ball) < 0) {
        resetBallPosition(3, -1); // Right player scores a point
        ball.velocity.y.add(randomness());
        rightPlayerScore++;
    }

    if (rightEdge(ball) > canvas.width) {
        resetBallPosition(-3, 1); // Left player scores a point
        ball.velocity.y.add(randomness());
        leftPlayerScore++;
    }
}

// Function to reset the ball's position
function resetBallPosition(velX, velY) {
    ball.getRect().x = centreX;
    ball.getRect().y = centreY;
    ball.velocity.x.set(velX);
    ball.velocity.y.set(velY);
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
    if (event.key === "w" && topEdge(leftPaddle) > 0) {
        leftPaddle.rect.y -= 10;
    } else if (event.key === "s" && bottomEdge(leftPaddle) < canvas.height) {
        leftPaddle.rect.y += 10;
    }

    // Right paddle controls
    if (event.key === "ArrowUp" && topEdge(rightPaddle) > 0) {
        rightPaddle.rect.y -= 10;
    } else if (event.key === "ArrowDown" && bottomEdge(rightPaddle) < canvas.height) {
        rightPaddle.rect.y += 10;
    }
});

// Initial draw of the game
update();
