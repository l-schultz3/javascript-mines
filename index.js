var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var id = setInterval(frame, 10);

let scale = 40; //size of each cell
let size = 640; //side length of grid
let cells = size / scale; //number of cells on side

let numberOfMines = 40; //the total number of mines that need to placed on board
let currentNumberOfMines = 0; //the current number of mines placed on board

let masterCellArray = [];
let playerCellArray = [];

var one = new Image();
var two = new Image();
var three = new Image();
var four = new Image();
var five = new Image();
var six = new Image();
var seven = new Image();
var eight = new Image();

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
				if (Math.random() < 0.1) {
					masterCellArray[i][j] = 9;
					currentNumberOfMines++;
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

initializeArray(masterCellArray, cells);
initializeArray(playerCellArray, cells);
placeMines();
checkAdjacent();

console.log(masterCellArray);

playerCellArray = masterCellArray;

showArray();

function showArray() {
	let img = new Image();
	img.onload = function () {
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
				} else if (playerCellArray[i][j] === 9) {
					ctx.drawImage(img, j*scale, i*scale, scale, scale);
				}
			}
		}
	}
	img.src = "images/mine.png";

	showNumber(one, 1, "images/1.png");
	showNumber(two, 2, "images/2.png");
	showNumber(three, 3, "images/3.png");
	showNumber(four, 4, "images/4.png");
	showNumber(five, 5, "images/5.png");
	showNumber(six, 6, "images/6.png");
	showNumber(seven, 7, "images/7.png");
	showNumber(eight, 8, "images/8.png");
}

function showNumber(image, num, source) {
	image.onload = function() {
		for (i = 0; i < playerCellArray.length; i++) {
			for (j = 0; j < playerCellArray[i].length; j++) {
				if (playerCellArray[i][j] === num) {
					ctx.drawImage(image, j*scale, i*scale, scale, scale);
				}
			}
		}
	}
	image.src = source;
}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: Math.round(evt.clientY - rect.top)
  };
}

canvas.addEventListener('mousemove', function(evt) {
  var mousePos = getMousePos(canvas, evt);
  //console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
}, false);

function frame() {
//location.reload();
}

//hi luke, it's maher, I helped you in this project, better give me credit when you hand it in. Mercer you're gonna read this sooo you're a witness.