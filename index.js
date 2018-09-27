var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function initialize() {

	ctx.clearRect(0,0,canvas.width,canvas.height);

	document.getElementById("canvas").addEventListener("mousedown", function(evt) {
		var mousePos = getMousePos(canvas, evt);
		mouseDown(mousePos);
	});

	let scale = 20;
	let maxMines = 40;
	let currentMines = 0;

	var one = new Image();
	var two = new Image();
	var three = new Image();
	var four = new Image();
	var five = new Image();
	var six = new Image();
	var seven = new Image();
	var eight = new Image();

	let segArray = [];
	let shownArray = [];

	var i;
	var j;
	for (i = 0; i < 16; i++) {
		segArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		shownArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	}

	showArray();

	while (currentMines < maxMines) {
		for (i = 0; i < segArray.length; i++) {
			for (j = 0; j < segArray[i].length; j++) {
				if (segArray[i][j] === 0) {
					let posMines = Math.random();
					if (posMines < 0.1 && currentMines < maxMines) {
						segArray[i][j] = 9;
						currentMines += 1;
					}
				}
			}
		}
	}

	for (i = 0; i < segArray.length; i++) {
		for (j = 0; j < segArray[i].length; j++) {
			if (segArray[i][j] < 9) {
				checkAdjacent(i, j);
			}
		}
	}

	function showArray() {
    //ctx.clearRect(0,0,canvas.width,canvas.height);
    var img = new Image();
    img.onload = function () {
    	for (i = 0; i < shownArray.length; i++) {
    		for (j = 0; j < shownArray[i].length; j++) {
    			if (shownArray[i][j] === 0) {
    				ctx.beginPath();
    				ctx.fillStyle = 'gray';
    				ctx.fillRect(j*scale,i*scale,scale,scale);
    				ctx.fillStyle = 'black';
    				ctx.fillRect(j*scale,i*scale,scale-2,scale-2)
    			} else if (shownArray[i][j] === 13) {
    				ctx.beginPath();
    				ctx.fillStyle = 'white';
    				ctx.fillRect(j*scale,i*scale,scale,scale);
    			} else if (shownArray[i][j] === 9) {
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

console.log(segArray);

function checkAdjacent(tiley, tilex) { //function to check how many mines are around a given segment
	if (tiley - 1 >= 0) {
		if (tilex - 1 >= 0) {
			if (segArray[tiley-1][tilex-1] === 9) {
				segArray[tiley][tilex] += 1;
			}
		}
		if (segArray[tiley-1][tilex] === 9) {
			segArray[tiley][tilex] += 1;
		}
		if (tilex + 1 < 16) {
			if (segArray[tiley-1][tilex+1] === 9) {
				segArray[tiley][tilex] += 1;
			}
		}
	}

	if (tilex - 1 >= 0) {
		if (segArray[tiley][tilex-1] === 9) {
			segArray[tiley][tilex] += 1;
		}
	}

	if (tilex + 1 < 16) {
		if (segArray[tiley][tilex+1] === 9) {
			segArray[tiley][tilex] += 1;
		}
	}

	if (tiley + 1 < 16) {
		if (tilex - 1 >= 0) {
			if (segArray[tiley+1][tilex-1] === 9) {
				segArray[tiley][tilex] += 1;
			}
		}
		if (segArray[tiley+1][tilex] === 9) {
			segArray[tiley][tilex] += 1;
		}
		if (tilex + 1 < 16) {
			if (segArray[tiley+1][tilex+1] === 9) {
				segArray[tiley][tilex] += 1;
			}
		}
	}

	if (segArray[tiley][tilex] === 0) {
		segArray[tiley][tilex] = 13;
	}

  //the reason for all of these if statement is because if the segment is on an edge the program crashes because it called an array out of bounds
}

function mouseDown(mousePos) {
  //console.log('Mouse position: ' + (mousePos.x) + ',' + (mousePos.y));
  //console.log('Seg position: ' + Math.floor(mousePos.x / scale) + ',' + Math.floor(mousePos.y / scale));
  shownArray[Math.floor(mousePos.y / scale)][Math.floor(mousePos.x / scale)] = segArray[Math.floor(mousePos.y / scale)][Math.floor(mousePos.x / scale)]
  showArray();
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: evt.clientX - rect.left,
		y: Math.round(evt.clientY - rect.top)
	};
}

function showNumber(image, num, source) {
	image.onload = function() {
		for (i = 0; i < shownArray.length; i++) {
			for (j = 0; j < shownArray[i].length; j++) {
				if (shownArray[i][j] === num) {
					ctx.drawImage(image, j*scale, i*scale, scale, scale);
				}
			}
		}
	}
	image.src = source;
}
}
