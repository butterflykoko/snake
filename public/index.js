'use strict';

const cellSize = 25;
const gridSize = 16;
let board = document.getElementById('board');

// Snake
let snakeX = cellSize * 5;
let snakeY = cellSize * 5;
let snakeBody = [{ x: snakeX, y: snakeY }];

let snakeHead = document.getElementById('snake-head');
snakeHead.style.height = `${cellSize}px`;
snakeHead.style.width = `${cellSize}px`;
board.appendChild(snakeHead);

// Food
let food = document.getElementById('food');
let foodX, foodY;

function generateFood() {
	food.style.height = `${cellSize}px`;
	food.style.width = `${cellSize}px`;
	board.appendChild(food);

	foodX = Math.floor(Math.random() * gridSize) * cellSize;
	foodY = Math.floor(Math.random() * gridSize) * cellSize;

	food.style.left = `${foodX}px`;
	food.style.top = `${foodY}px`;
	return food;
}

let direction = 'right';

function changeDirection(e) {
	switch (e.key) {
		case 'ArrowUp':
		case 'w':
			direction = 'up';
			break;
		case 'ArrowDown':
		case 's':
			direction = 'down';
			break;
		case 'ArrowRight':
		case 'd':
			direction = 'right';
			break;
		case 'ArrowLeft':
		case 'a':
			direction = 'left';
			break;
	}
}

let titleText = document.getElementById('title');
let scoreText = document.getElementById('score');

class Appearance {
	light;
	dark;

	constructor(save, light, dark) {
		this.light = light;
		this.dark = dark;
	}

	change() {
		if (currentAppearance.light == true) {
			currentAppearance.mode = 'dark';
			currentAppearance.light = false;
			currentAppearance.dark = true;

			background.style.backgroundColor = '#000c1e';
			board.style.backgroundColor = '#29470c';
			titleText.style.color = '#ffffff';
			scoreText.style.color = '#ffffff';
		} else if (currentAppearance.dark == true) {
			currentAppearance.mode = 'light';
			currentAppearance.light = true;
			currentAppearance.dark = false;

			background.style.backgroundColor = '';
			board.style.backgroundColor = '';
			titleText.style.color = '';
			scoreText.style.color = '';
		}
	}
}

let currentAppearance = new Appearance('light', true, false);
let background = document.body;
const changeMode = () => {
	return currentAppearance.change();
};

let gameLoop;

window.onload = function () {
	let size = gridSize * cellSize;
	board.style.height = `${size}px`;
	board.style.width = `${size}px`;
	generateFood();

	document.addEventListener('keydown', changeDirection);
	gameLoop = setInterval(update, 100); // Snake speed
};

function update() {
	// Save previous postion
	let segmentX = snakeX;
	let segmentY = snakeY;

	// Snake movement
	switch (direction) {
		case 'up':
			snakeY -= cellSize;
			break;
		case 'down':
			snakeY += cellSize;
			break;
		case 'right':
			snakeX += cellSize;
			break;
		case 'left':
			snakeX -= cellSize;
			break;
	}

	// Snake body movement
	let segment;

	for (let i = snakeBody.length - 1; i > 0; i--) {
		snakeBody[i].x = snakeBody[i - 1].x;
		snakeBody[i].y = snakeBody[i - 1].y;
	}

	if (snakeBody.length > 1) {
		snakeBody[1].x = segmentX;
		snakeBody[1].y = segmentY;
	}

	for (let i = 1; i < snakeBody.length; i++) {
		segment = document.getElementsByClassName('snake')[i];
		segment.style.left = `${snakeBody[i].x}px`;
		segment.style.top = `${snakeBody[i].y}px`;
	}

	snakeHead.style.left = `${snakeX}px`;
	snakeHead.style.top = `${snakeY}px`;

	// Collisions
	let gameOver = false;

	if (snakeX < 0 || snakeX >= gridSize * cellSize || snakeY < 0 || snakeY >= gridSize * cellSize) {
		gameOver = true;
	}

	for (let i = snakeBody.length - 1; i > 0; i--) {
		if (snakeX == snakeBody[i].x && snakeY == snakeBody[i].y) {
			gameOver = true;
		}
	}

	if (gameOver == true) {
		clearInterval(gameLoop);
		alert('Game Over!');

		let score = snakeBody.length - 1;
		document.getElementById('score').textContent = "Score: " + `${score}`;
	}

	function grow() {
		if (snakeX == foodX && snakeY == foodY) {
			segment = document.createElement('div');
			segment.className = 'snake';

			segment.style.height = snakeHead.style.height;
			segment.style.width = snakeHead.style.width;

			board.appendChild(segment);
			snakeBody.push({ x: segmentX, y: segmentY });
			generateFood();
		}
	}

	grow();
}

update();
