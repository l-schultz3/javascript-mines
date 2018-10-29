var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var id = setInterval(frame, 10);

let date = new Date();
let startTime;

let help = false;

let mineSlider = document.getElementById("mineSlider");
let mineOutput = document.getElementById("numMines");
let scaleSlider = document.getElementById("scaleSlider");
let scaleOutput = document.getElementById("numScale");
let widthSlider = document.getElementById("widthSlider");
let widthOutput = document.getElementById("numWidth");
let heightSlider = document.getElementById("heightSlider");
let heightOutput = document.getElementById("numHeight");
let gameModeDisplay = document.getElementById("gameModeDisplay");

let scale = scaleSlider.value; //size of each cell
let cellWidth = 9;
let cellHeight = 9;

let width = scale * cellWidth;
let height = scale * cellHeight;

canvas.width = width;
canvas.height = height;

let numberOfMines = 10; //the total number of mines that need to placed on board
let currentNumberOfMines = 0; //the current number of mines placed on board
let numberOfFlags = 0;

let masterCellArray = [];
let playerCellArray = [];

let one = new Image();
let two = new Image();
let three = new Image();
let four = new Image();
let five = new Image();
let six = new Image();
let seven = new Image();
let eight = new Image();
let mine = new Image();
let flag = new Image();

let mouseDown;
let mousePos;
let mouseX;
let mouseY;
let charCode;

let checkForClosedCells;
let win = false;
let lose = false;
let flagMode = false;

let gameMode = 0; //0 - classic, 1 - knights
let numberOfGameModes = 2;
let gameModeNames = ["Classic", "Knights Paths"];
let gameStarted = false;

initializeArray(masterCellArray);
initializeArray(playerCellArray);

showArray();

function toggleHelp() { //MAHER'S IDEA
	help = !help;
}

gameModeDisplay.innerHTML = "Game Mode: " + gameModeNames[gameMode];

function switchGameMode() {
	if (gameMode < numberOfGameModes - 1) { //subtract one because gameMode variable starts at zero
		gameMode++;
	} else {
		gameMode = 0;
	}

	gameModeDisplay.innerHTML = "Game Mode: " + gameModeNames[gameMode];

	restart();
}

document.onkeypress = function(evt) {
	evt = evt || window.event;
	charCode = evt.keyCode || evt.which;
	if (charCode === 102) {
		toggleFlagMode();
	} else if (charCode === 114) {
		restart();
	} else if (charCode === 87) {
		document.getElementById("body").style.backgroundColor = "#0f0";
		win = true;	
	}
};

function initializeArray(array) { //function used to set arrays to full size needed for game
	for (let i = 0; i < cellHeight; i++) {
		array.push([]);
		for (let j = 0; j < cellWidth; j++) {
			array[i].push(0);
		}
	}
}

function placeMines() {
	while (currentNumberOfMines <= numberOfMines) {
		for (let i = 0; i < cellHeight; i++) {
			for (let j = 0; j < cellWidth; j++) {
				if (masterCellArray[i][j] != 15) {
					if (Math.random() < 0.001 && currentNumberOfMines <= numberOfMines) {
						masterCellArray[i][j] = 9;
						currentNumberOfMines++;
					}
				}
			}
		}
	}
}

function checkAdjacent() {
	for (let i = 0; i < cellHeight; i++) {
		for (let j = 0; j < cellWidth; j++) {
			if (gameMode === 0) {
				checkCellsAdjacent(i, j, i-1, j-1);
				checkCellsAdjacent(i, j, i-1, j);
				checkCellsAdjacent(i, j, i-1, j+1);
				checkCellsAdjacent(i, j, i, j-1);
				checkCellsAdjacent(i, j, i, j+1);
				checkCellsAdjacent(i, j, i+1, j-1);
				checkCellsAdjacent(i, j, i+1, j);
				checkCellsAdjacent(i, j, i+1, j+1);
			} else {
				checkCellsAdjacent(i, j, i-1, j-2);
				checkCellsAdjacent(i, j, i-1, j+2);
				checkCellsAdjacent(i, j, i+1, j-2);
				checkCellsAdjacent(i, j, i+1, j+2);
				checkCellsAdjacent(i, j, i+2, j-1);
				checkCellsAdjacent(i, j, i+2, j+1);
				checkCellsAdjacent(i, j, i-2, j-1);
				checkCellsAdjacent(i, j, i-2, j+1);
			}

			if (masterCellArray[i][j] === 0) masterCellArray[i][j] = 13;
		}
	}
}

function checkCellsAdjacent(y, x, checky, checkx) {
	try {
		if (masterCellArray[y][x] != 9) {
			if (masterCellArray[checky][checkx] === 9) {
				masterCellArray[y][x]++;
			}
		}
	} catch { }
}

function showArray() {
	showImageOnCell(one, 1, "images/1.png");
	showImageOnCell(two, 2, "images/2.png");
	showImageOnCell(three, 3, "images/3.png");
	showImageOnCell(four, 4, "images/4.png");
	showImageOnCell(five, 5, "images/5.png");
	showImageOnCell(six, 6, "images/6.png");
	showImageOnCell(seven, 7, "images/7.png");
	showImageOnCell(eight, 8, "images/8.png");
	showImageOnCell(mine, 9, "images/mine.png");
	showImageOnCell(flag, 12, "images/flag.png");

	for (i = 0; i < playerCellArray.length; i++) {
		for (j = 0; j < playerCellArray[i].length; j++) {
			if (playerCellArray[i][j] === 0) {
				ctx.beginPath();
				ctx.fillStyle = 'gray';
				ctx.fillRect(j*scale,i*scale,scale,scale);
				ctx.fillStyle = 'black';
				ctx.fillRect(j*scale + 1,i*scale + 1,scale-2,scale-2);
			} else if (playerCellArray[i][j] === 13) {
				ctx.beginPath();
				ctx.fillStyle = 'white';
				ctx.fillRect(j*scale,i*scale,scale,scale);
				onEmpty(i, j);
			}
		}
	}
}

function showImageOnCell(image, cellValue, source) {
	image.onload = function() {
		for (i = 0; i < playerCellArray.length; i++) {
			for (j = 0; j < playerCellArray[i].length; j++) {
				if (playerCellArray[i][j] === cellValue) {
					ctx.drawImage(image, j*scale, i*scale, scale, scale);
				}
			}
		}

		drawPaths();
	}
	image.src = source;
}

function leftPressed(y, x, checkFlag) {
	playerCellArray[y][x] = masterCellArray[y][x];
	checkWin();
}

function checkWin() {
	checkForClosedCells = false;

	for (let i = 0; i < playerCellArray.length; i++) {
		for (let j = 0; j < playerCellArray[i].length; j++) {
			if ((playerCellArray[i][j] === 0 && masterCellArray[i][j] != 9) || (playerCellArray[i][j] === 12 && masterCellArray[i][j] != 9))  {
				checkForClosedCells = true;
			} else if (playerCellArray[i][j] === 9 && !(win) && !(lose)) {
				document.getElementById("body").style.backgroundColor = "#f00";

				lose = true;
			}
		}
	}
	
	if (checkForClosedCells === false && lose === false) {
		document.getElementById("body").style.backgroundColor = "#0f0";
		win = true;
	}
}

function toggleFlagMode() {
	flagMode = !flagMode;
}

function placeFlag(y, x) {
	if (playerCellArray[y][x] === 0 || playerCellArray[y][x] === 12) {
		if (playerCellArray[y][x] === 12) {
			playerCellArray[y][x] = 0;
			numberOfFlags--;
		} else {
			playerCellArray[y][x] = 12;
			numberOfFlags++;
		}
	}
}

document.onmousemove = function(evt) {
	mousePos = getMousePos(evt);

	mouseX = Math.floor(mousePos.x / scale);
	mouseY = Math.floor(mousePos.y / scale);
};

function getMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	return {
    	x: Math.round(evt.clientX - rect.left),
    	y: Math.round(evt.clientY - rect.top)
  	};
}

document.body.onmousedown = function(evt) {
	mouseDown = evt.button;
	mousePos = getMousePos(evt);
	if ((mousePos.x >= 0 && mousePos.y >= 0) && (mousePos.x <= width && mousePos.y <= height)) {
		mouseX = Math.floor(mousePos.x / scale);
		mouseY = Math.floor(mousePos.y / scale);
		if (mouseDown === 0) {
			if (gameStarted) {
				if (flagMode) {
					placeFlag(mouseY, mouseX);
				} else {
					if (playerCellArray[mouseY][mouseX] != 12) {
						leftPressed(mouseY, mouseX);
					}
				}
			} else {
				runHoldPlace(15);
				placeMines();
				runHoldPlace(0);
				checkAdjacent();

				startTime = date.getTime();

				leftPressed(mouseY, mouseX);

				gameStarted = true;
			}
		} else if (mouseDown === 2) {
			placeFlag(mouseY, mouseX);
		}
	}
}

function runHoldPlace(value) {
	if (gameMode === 0) {
		holdPlace(mouseY-1, mouseX-1, value);
		holdPlace(mouseY-1, mouseX, value);
		holdPlace(mouseY-1, mouseX+1, value);
		holdPlace(mouseY, mouseX-1, value);
		holdPlace(mouseY, mouseX, value);
		holdPlace(mouseY, mouseX+1, value);
		holdPlace(mouseY+1, mouseX-1, value);
		holdPlace(mouseY+1, mouseX, value);
		holdPlace(mouseY+1, mouseX+1, value);
	} else {
		holdPlace(mouseY-1, mouseX-2, value);
		holdPlace(mouseY-1, mouseX+2, value);
		holdPlace(mouseY+1, mouseX-2, value);
		holdPlace(mouseY+1, mouseX+2, value);
		holdPlace(mouseY, mouseX, value);
		holdPlace(mouseY-2, mouseX-1, value);
		holdPlace(mouseY+2, mouseX-1, value);
		holdPlace(mouseY-2, mouseX+1, value);
		holdPlace(mouseY+2, mouseX+1, value);
	}
}

function holdPlace(y, x, value) {
	try {
		masterCellArray[y][x] = value;
	} catch { }
}

function onEmpty(y, x) {
	if (gameMode === 0) {
		revealEmpty(y-1, x-1);
		revealEmpty(y-1, x);
		revealEmpty(y-1, x+1);
		revealEmpty(y, x-1);
		revealEmpty(y, x+1);
		revealEmpty(y+1, x-1);
		revealEmpty(y+1, x);
		revealEmpty(y+1, x+1);
	} else {
		revealEmpty(y-1, x-2);
		revealEmpty(y-1, x+2);
		revealEmpty(y+1, x-2);
		revealEmpty(y+1, x+2);
		revealEmpty(y-2, x-1);
		revealEmpty(y+2, x-1);
		revealEmpty(y-2, x+1);
		revealEmpty(y+2, x+1);
	}
}

function revealEmpty(checky, checkx) {
	try {
		leftPressed(checky, checkx);
	} catch { }
}

function frame() {
	date = new Date();
	document.getElementById("timer").innerHTML = "Timer: " + (date.getTime() - startTime) / 1000;

	document.getElementById("flag").innerHTML = "Number of Flags: " + numberOfFlags;

	if (win) {

		alert("YOU WIN\n\nClick OK to play again\n\nBeat in " + (date.getTime() - startTime) / 1000 + " seconds");

		document.getElementById("body").style.backgroundColor = "#000";

		restart();
	} else if (lose) {
		playerCellArray = masterCellArray;
		showArray();

		alert("YOU LOSE\n\nClick OK to play again");

		document.getElementById("body").style.backgroundColor = "#000";

		restart();
	} else {
		showArray();
	}

	drawPaths();
}

function drawPaths() {
	if (help) {
		if (gameMode === 0) {
			ctx.beginPath();
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) - (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) - (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) - (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) + (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) - (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) - (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) + (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) - (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) + (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) + (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) + (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) + (scale * 1)), scale / 3);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#00ffff';
			ctx.stroke();

		} else if (gameMode === 1) {
			ctx.beginPath();
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) - (scale * 2)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) - (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) - (scale * 2)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) + (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) + (scale * 2)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) - (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) + (scale * 2)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) + (scale * 1)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) - (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) - (scale * 2)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) - (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) + (scale * 2)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) + (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) - (scale * 2)), scale / 3);
			drawCircles((mousePos.x - (mousePos.x%scale) + (scale * 0.5) + (scale * 1)), (mousePos.y - (mousePos.y%scale) + (scale * 0.5) + (scale * 2)), scale / 3);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#00ffff';
			ctx.stroke();
		}

    	ctx.beginPath();
		ctx.arc(mousePos.x - (mousePos.x%scale) + (scale * 0.5), mousePos.y - (mousePos.y%scale) + (scale * 0.5), scale / 3, 0, 2 * Math.PI, false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#ff0000';
		ctx.stroke();
	}
}

function drawCircles(x, y, size) {
	ctx.beginPath();
	ctx.arc(x, y, size, 0, 2 * Math.PI, false);
	ctx.lineWidth = 2;
	ctx.strokeStyle = '#00ffff';
	ctx.stroke();
}

function restart() { //restarts the game
	startTime = undefined;

	currentNumberOfMines = 0; //the current number of mines placed on board
	numberOfFlags = 0;

	masterCellArray = [];
	playerCellArray = [];
	win = false;
	lose = false;
	flagMode = false;

	width = scale * cellWidth;
	height = scale * cellHeight;

	canvas.width = width;
	canvas.height = height;

	gameStarted = false;

	initializeArray(masterCellArray);
	initializeArray(playerCellArray);

	showArray();
}

//hi luke, it's maher, I helped you in this project, better give me credit when you hand it in. Mercer you're gonna read this sooo you're a witness.

mineOutput.innerHTML = "Number of Mines: " + mineSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
mineSlider.oninput = function() {
    mineOutput.innerHTML = "Number of Mines: " + this.value;
    numberOfMines = this.value;

    restart();
}

scaleOutput.innerHTML = "Scale: " + scaleSlider.value;

scaleSlider.oninput = function() {
	scale = this.value;

	width = scale * cellWidth;
	height = scale * cellHeight;

	canvas.width = width;
	canvas.height = height;

	scaleOutput.innerHTML = "Scale: " + scaleSlider.value;
}

widthOutput.innerHTML = "Width of Play Area: " + widthSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
widthSlider.oninput = function() {
    widthOutput.innerHTML = "Width of Play Area: " + this.value;
    cellWidth = this.value;

    restart();
}

heightOutput.innerHTML = "Height of Play Area: " + heightSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
heightSlider.oninput = function() {
    heightOutput.innerHTML = "Height of Play Area: " + this.value;
    cellHeight = this.value;

    restart();
}

