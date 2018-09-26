var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

function initialize() {

let scale = 20;
let maxMines = 40;
let currentMines = 0;

let segArray = [];

var i;
var j;
for (i = 0; i < 16; i++) {
  segArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
}

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
ctx.clearRect(0,0,canvas.width,canvas.height);
var img = new Image();
img.onload = function () {
  for (i = 0; i < segArray.length; i++) {
    for (j = 0; j < segArray[i].length; j++) {
      if (segArray[i][j] < 9) {
              checkAdjacent(i, j);
      }

      if (segArray[i][j] === 0) {
        ctx.beginPath();
        ctx.fillStyle = 'gray';
        ctx.fillRect(j*scale,i*scale,scale,scale);
        ctx.stroke();
      } else if (segArray[i][j] === 9) {
        ctx.drawImage(img, j*scale, i*scale, scale, scale);
      }
    }
  }
}
img.src = "mine.png";

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

  //the reason for all of these if statement is because if the segment is on an edge the program crashes because it called an array out of bounds
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
  console.log('Mouse position: ' + mousePos.x + ',' + mousePos.y);
}, false);

console.log(currentMines);

}
