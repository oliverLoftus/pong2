// Get the canvas element and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

class GameObject {
    constructor(x, y, width, height, velocities) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocities = velocities;
    }

    // Method to draw the object
    draw() {
        ctx.fillStyle = "white";
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Create ball and paddle objects from the GameObject class
const ball = new GameObject(canvas.width / 2, canvas.height / 2, 10, 10, { x: new Velocity(3), y: new Velocity(0) });
const leftPaddle = new GameObject(10, canvas.height / 2 - 40, 10, 80, { x: new Velocity(0) });
const rightPaddle = new GameObject(canvas.width - 20, canvas.height / 2 - 40, 10, 80, { x: new Velocity(0) });

// Function to update the game
function update() {
    // Update ball position
    ball.x += ball.velocities.x.value;
    ball.y += ball.velocities.y.value;

    // Ball collision with top and bottom boundaries
    if (ball.y - ball.height / 2 < 0 || ball.y + ball.height / 2 > canvas.height) {
        ball.velocities.y.bounce(); // Use the bounce method
    }
// Ball collision with paddles
if (
    (ball.x < leftPaddle.x + leftPaddle.width) &&
    (ball.x + ball.width > leftPaddle.x) &&
    (ball.y - ball.height / 2 < leftPaddle.y + leftPaddle.height) &&
    (ball.y + ball.height / 2 > leftPaddle.y)
) {
    ball.velocities.x.bounce(); // Use the bounce method
}

if (
    (ball.x + ball.width > rightPaddle.x) &&
    (ball.x < rightPaddle.x + rightPaddle.width) &&
    (ball.y - ball.height / 2 < rightPaddle.y + rightPaddle.height) &&
    (ball.y + ball.height / 2 > rightPaddle.y)
) {
    ball.velocities.x.bounce(); // Use the bounce method
}


    // Ball out of bounds (scoring)
    if (ball.x - ball.width / 2 < 0) {
        // Reset the ball's position
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.velocities.x.set(3); // Use the set method
        ball.velocities.y.set(1); // Use the set method

        // Right player scores a point
        // Handle scoring logic here
    }

    if (ball.x + ball.width / 2 > canvas.width) {
        // Reset the ball's position
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.velocities.x.set(-3); // Use the set method
        ball.velocities.y.set(-1); // Use the set method

        // Left player scores a point
        // Handle scoring logic here
    }

    // Draw the game elements
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    leftPaddle.draw();
    rightPaddle.draw();

    // Request animation frame for the next frame update
    requestAnimationFrame(update);
}

// Event listeners to control the left paddle with arrow keys
document.addEventListener("keydown", (event) => {
    if (event.key === "w" && leftPaddle.y > 0) {
        leftPaddle.y -= 10;
    } else if (event.key === "s" && leftPaddle.y + leftPaddle.height < canvas.height) {
        leftPaddle.y += 10;
    }

    // Right paddle controls
    if (event.keyCode === 38 && rightPaddle.y > 0) {
        rightPaddle.y -= 10;
    } else if (event.keyCode === 40 && rightPaddle.y + rightPaddle.height < canvas.height) {
        rightPaddle.y += 10;
    }
});

// Initial draw of the game
update();