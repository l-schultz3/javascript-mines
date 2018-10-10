var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var id = setInterval(frame, 25);

let slider = document.getElementById("mineSlider");
let output = document.getElementById("numMines");

let size = canvas.width; //side length of grid
let cells = 16; //number of cells on side
let scale = size / cells; //size of each cell

let numberOfMines = 40; //the total number of mines that need to placed on board
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
let loseImage = new Image();
let winImage = new Image();

let mouseDown;
let mousePos;
let mouseX;
let mouseY;
let charCode;

let checkForClosedCells;
let win = false;
let lose = false;
let flagMode = false;

let gameStarted = false;

initializeArray(masterCellArray, cells);
initializeArray(playerCellArray, cells);

showArray();

document.onkeypress = function(evt) {
	evt = evt || window.event;
	charCode = evt.keyCode || evt.which;
	if (charCode === 102) {
		toggleFlagMode();
	} else if (charCode === 114) {
		restart();
	}
};

function loopThroughEveryCell(array) {
	for (let i = 0; i < cells; i++) {
		for (let j = 0; j < cells; j++) {
		}
	}
}

function initializeArray(array, arraySize) { //function used to set arrays to full size needed for game
	for (let i = 0; i < arraySize; i++) {
		array.push([]);
		for (let j = 0; j < cells; j++) {
			array[i].push(0);
		}
	}
}

function placeMines() {
	while (currentNumberOfMines < numberOfMines) {
		for (let i = 0; i < cells; i++) {
			for (let j = 0; j < cells; j++) {
				if (masterCellArray[i][j] != 15) {
					if (Math.random() < 0.1 && currentNumberOfMines < numberOfMines) {
						masterCellArray[i][j] = 9;
						currentNumberOfMines++;
					}
				}
			}
		}
	}
}

function checkAdjacent() {
	for (let i = 0; i < cells; i++) {
		for (let j = 0; j < cells; j++) {
			checkCellsAdjacent(i, j, i-1, j-1);
			checkCellsAdjacent(i, j, i-1, j);
			checkCellsAdjacent(i, j, i-1, j+1);
			checkCellsAdjacent(i, j, i, j-1);
			checkCellsAdjacent(i, j, i, j+1);
			checkCellsAdjacent(i, j, i+1, j-1);
			checkCellsAdjacent(i, j, i+1, j);
			checkCellsAdjacent(i, j, i+1, j+1);

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
				ctx.fillRect(j*scale,i*scale,scale-2,scale-2)
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
			if (playerCellArray[i][j] === 0 && masterCellArray[i][j] != 9) {
				checkForClosedCells = true;
			} else if (playerCellArray[i][j] === 9) {
				lose = true;
			}
		}
	}
	
	if (checkForClosedCells === false && lose === false) {
		win = true;
	}
}

function toggleFlagMode() {
	flagMode = !flagMode;
}

function placeFlag(y, x) {
	if (playerCellArray[y][x] === 12) {
		playerCellArray[y][x] = 0;
		numberOfFlags--;
	} else {
		playerCellArray[y][x] = 12;
		numberOfFlags++;
	}
}

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

			leftPressed(mouseY, mouseX);

			gameStarted = true;
		}
	} else if (mouseDown === 2) {
		placeFlag(mouseY, mouseX);
	}
}

function runHoldPlace(value) {
	holdPlace(mouseY-1, mouseX-1, value);
	holdPlace(mouseY-1, mouseX, value);
	holdPlace(mouseY-1, mouseX+1, value);
	holdPlace(mouseY, mouseX-1, value);
	holdPlace(mouseY, mouseX, value);
	holdPlace(mouseY, mouseX+1, value);
	holdPlace(mouseY+1, mouseX-1, value);
	holdPlace(mouseY+1, mouseX, value);
	holdPlace(mouseY+1, mouseX+1, value);
}

function holdPlace(y, x, value) {
	try {
		masterCellArray[y][x] = value;
	} catch { }
}

function onEmpty(y, x) {
	revealEmpty(y-1, x-1);
	revealEmpty(y-1, x);
	revealEmpty(y-1, x+1);
	revealEmpty(y, x-1);
	revealEmpty(y, x+1);
	revealEmpty(y+1, x-1);
	revealEmpty(y+1, x);
	revealEmpty(y+1, x+1);
}

function revealEmpty(checky, checkx) {
	try {
		leftPressed(checky, checkx);
	} catch { }
}

function frame() {
	document.getElementById("flag").innerHTML = "Number of Flags: " + numberOfFlags;

	if (win) {
		winImage.onload = function() {
			ctx.drawImage(winImage, 0, 0, size, size);
		}
		winImage.src = "images/win.jpg";
	} else if (lose) {
		loseImage.onload = function() {
			ctx.drawImage(loseImage, 0, 0, size, size);
		}
		loseImage.src = "images/lose.jpg";
	} else {
		showArray();
	}
}

function restart() {
	currentNumberOfMines = 0; //the current number of mines placed on board
	numberOfFlags = 0;

	masterCellArray = [];
	playerCellArray = [];
	win = false;
	lose = false;
	flagMode = false;

	console.log(masterCellArray);

	gameStarted = false;

	initializeArray(masterCellArray, cells);
	initializeArray(playerCellArray, cells);

	console.log(masterCellArray);

	showArray();
}

//hi luke, it's maher, I helped you in this project, better give me credit when you hand it in. Mercer you're gonna read this sooo you're a witness.

output.innerHTML = "Number of Mines: " + slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = "Number of Mines: " + this.value;
    numberOfMines = this.value;
}