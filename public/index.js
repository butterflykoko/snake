'use strict';

const cellSize = 25;
const gridSize = 16;
let board = document.getElementById('board');

// Initalize score variables
let score;
let scoreText = document.getElementById('score');
let bestScore = localStorage.getItem('bestScore');
let bestScoreText = document.getElementById('bestScore');

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

class Appearance {
	mode;

	constructor(mode) {
		this.mode = mode;
	}

	apply() {
		if (this.mode === 'dark') {
			background.style.backgroundColor = '#000c1e';
			board.style.backgroundColor = '#29470c';
			document.body.style.color = '#ffffff';
		} else {
			background.style.backgroundColor = '';
			board.style.backgroundColor = '';
			document.body.style.color = '';
		}
	}

	change() {
		if (this.mode === 'light') {
			this.mode = 'dark';
		} else {
			this.mode = 'light';
		}

		localStorage.setItem('theme', this.mode);
		this.apply();
	}
}

let background = document.body;
let currentAppearance = new Appearance(localStorage.getItem('theme') || 'light');
currentAppearance.apply();
const changeMode = () => currentAppearance.change();

let gameLoop;

window.onload = function () {
	let size = gridSize * cellSize;
	board.style.height = `${size}px`;
	board.style.width = `${size}px`;
	generateFood();

	bestScoreText.textContent = 'Best: ' + `${bestScore}`;
	document.addEventListener('keydown', changeDirection);
	gameLoop = setInterval(update, 100); // Snake speed
};

function update() {
	// Save previous postion
	let segmentX = snakeX;
	let segmentY = snakeY;

	let nextX = snakeX;
	let nextY = snakeY;

	// Snake movement
	switch (direction) {
		case 'up':
			nextY -= cellSize;
			break;
		case 'down':
			nextY += cellSize;
			break;
		case 'right':
			nextX += cellSize;
			break;
		case 'left':
			nextX -= cellSize;
			break;
	}

	// Wall check
	if (
		nextX < 0 ||
		nextX >= gridSize * cellSize ||
		nextY < 0 ||
		nextY >= gridSize * cellSize
	) {
		endGame();
		return;
	}

	snakeX = nextX;
	snakeY = nextY;

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
	function endGame() {
		let gameOver = true;

		for (let i = snakeBody.length - 1; i > 0; i--) {
			if (snakeX == snakeBody[i].x && snakeY == snakeBody[i].y) {
				gameOver = true;
			}
		}

		if (gameOver == true) {
			clearInterval(gameLoop);
			alert('Game Over!');
		}
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

			// Active score changes
			score = snakeBody.length - 1;
			scoreText.textContent = 'Score: ' + score;

			if (score > bestScore) {
				bestScore = score;
				localStorage.setItem('bestScore', bestScore);
				bestScoreText.textContent = 'Best: ' + bestScore;
			}
		}
	}

	grow();
}
