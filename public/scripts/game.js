"use strict";
// Board variables
let blockSize = 25;
let col = 16;
let row = col;
let board = document.getElementById("board"); // Access board element
let gameOver;
// Snake
let snakeX = blockSize * 5;
let snakeY = blockSize * 5;
let snakeBody = [{ x: snakeX, y: snakeY }];
let segment;
//Generate snake
const snakeHead = document.createElement("div");
snakeHead.id = "snake-head";
snakeHead.className = "snake";
// Snake size
snakeHead.style.height = `${blockSize}px`;
snakeHead.style.width = `${blockSize}px`;
board.appendChild(snakeHead);
// Food
const food = document.createElement("div");
food.id = "food";
let foodX, foodY;
function generateFood() {
    // Specify food height and width
    food.style.height = `${blockSize}px`;
    food.style.width = `${blockSize}px`;
    board.appendChild(food);
    // Generate random coordinates for food
    foodX = Math.floor(Math.random() * col) * blockSize;
    foodY = Math.floor(Math.random() * row) * blockSize;
    // Position food
    food.style.top = `${foodY}px`;
    food.style.left = `${foodX}px`;
    return food;
}
// Change snake direction
let direction = "right";
function changeDirection(e) {
    switch (e.key) {
        case "ArrowUp":
        case "w":
            direction = "up";
            break;
        case "ArrowDown":
        case "s":
            direction = "down";
            break;
        case "ArrowRight":
        case "d":
            direction = "right";
            break;
        case "ArrowLeft":
        case "a":
            direction = "left";
            break;
    }
}
// Instructions to change color mode
console.log("Get current appearance: getCurrent();");
console.log("Change: changeMode();");
// Set current appearance
class Appearance {
    mode;
    light;
    dark;
    constructor(mode, light, dark) {
        this.mode = mode;
        this.light = light;
        this.dark = dark;
    }
    getMode() {
        return this.mode;
    }
    change() {
        if (currentAppearance.light == true) {
            // Turn dark mode on
            currentAppearance.mode = "dark";
            currentAppearance.light = false;
            currentAppearance.dark = true;
            background.style.backgroundColor = "#000c1e";
            board.style.backgroundColor = "#29470c";
        }
        else if (currentAppearance.dark == true) {
            // Switch back to light mode
            currentAppearance.mode = "light";
            currentAppearance.light = true;
            currentAppearance.dark = false;
            background.style.backgroundColor = "";
            board.style.backgroundColor = "";
        }
        localStorage.setItem("save", this.mode);
    }
}
let currentAppearance = new Appearance("light", true, false);
let background = document.body; // Access background
const getCurrent = () => {
    return currentAppearance.getMode();
}; // Get current mode
const changeMode = () => {
    return currentAppearance.change();
}; // Change apperance
// Set up game after window object loads
window.onload = function () {
    let height = row * blockSize;
    board.style.height = `${height}px`;
    let width = col * blockSize;
    board.style.width = `${width}px`;
    generateFood();
    // Save current appearance
    const save = localStorage.getItem("save");
    if (save === "dark") {
        currentAppearance.change();
    }
    document.addEventListener("keydown", changeDirection); // Moving snake
    setInterval(update, 1000 / 10); // Snake speed
};
// Update game
function update() {
    // Game over
    if (gameOver) {
        return;
    }
    // Collisions
    if (snakeX < 0 || snakeX >= col * blockSize || snakeY < 0 || snakeY >= row * blockSize) {
        gameOver = true;
    }
    // Snake hits itself
    for (let i = snakeBody.length - 1; i > 0; i--) {
        if (snakeX == snakeBody[i].x && snakeY == snakeBody[i].y) {
            gameOver = true;
            console.log("Snake hit itself");
        }
    }
    if (gameOver == true) {
        alert("Game Over! Refresh page to start over.");
    }
    // Save previous position of snake head for snake body
    let segmentX = snakeX;
    let segmentY = snakeY;
    // Snake movement
    switch (direction) {
        case "up":
            snakeY -= blockSize;
            break;
        case "down":
            snakeY += blockSize;
            break;
        case "right":
            snakeX += blockSize;
            break;
        case "left":
            snakeX -= blockSize;
            break;
    }
    // Update snake after body moves
    snakeHead.style.top = `${snakeY}px`;
    snakeHead.style.left = `${snakeX}px`;
    function grow() {
        // Grow snake by eating food and adding segments
        if (snakeX == foodX && snakeY == foodY) {
            segment = document.createElement("div");
            segment.className = "snake";
            // Snake block size
            segment.style.height = snakeHead.style.height;
            segment.style.width = snakeHead.style.width;
            // Add new segment to snake body
            board.appendChild(segment);
            snakeBody.push({ x: segmentX, y: segmentY });
            generateFood();
        }
    }
    grow();
    // Move snake body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i].x = snakeBody[i - 1].x;
        snakeBody[i].y = snakeBody[i - 1].y;
    }
    if (snakeBody.length > 0) {
        snakeBody[1].x = segmentX;
        snakeBody[1].y = segmentY;
    }
    for (let i = 1; i < snakeBody.length; i++) {
        segment = document.getElementsByClassName("snake")[i];
        segment.style.top = `${snakeBody[i].y}px`;
        segment.style.left = `${snakeBody[i].x}px`;
    }
}
update();
