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

  let segArray = [];
  let shownArray = [];

  var i;
  var j;
  for (i = 0; i < 16; i++) {
    segArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    shownArray.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
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
            ctx.strokeStyle = 'black';
            ctx.fillRect(j*scale,i*scale,scale,scale);
          } else if (shownArray[i][j] === 13) {
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.fillRect(j*scale,i*scale,scale,scale);
          } else if (shownArray[i][j] === 9) {
            ctx.drawImage(img, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    img.src = "images/mine.png";

    var one = new Image();
    one.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 1) {
            ctx.drawImage(one, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    one.src = "images/1.png";

    var two = new Image();
    two.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 2) {
            ctx.drawImage(two, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    two.src = "images/2.png";

    var three = new Image();
    three.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 3) {
            ctx.drawImage(three, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    three.src = "images/3.png";

    var four = new Image();
    four.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 4) {
            ctx.drawImage(four, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    four.src = "images/4.png";

    var five = new Image();
    five.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 5) {
            ctx.drawImage(five, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    five.src = "images/5.png";

    var six = new Image();
    six.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 6) {
            ctx.drawImage(six, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    six.src = "images/6.png";

    var seven = new Image();
    seven.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 7) {
            ctx.drawImage(seven, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    seven.src = "images/7.png";

    var eight = new Image();
    eight.onload = function () {
      for (i = 0; i < shownArray.length; i++) {
        for (j = 0; j < shownArray[i].length; j++) {
          if (shownArray[i][j] === 8) {
            ctx.drawImage(eight, j*scale, i*scale, scale, scale);
          }
        }
      }
    }
    eight.src = "images/8.png";
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
  console.log('Mouse position: ' + (mousePos.x) + ',' + (mousePos.y));
  console.log('Seg position: ' + Math.floor(mousePos.x / scale) + ',' + Math.floor(mousePos.y / scale));
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

//canvas.addEventListener('mousemove', , false);

console.log(currentMines);

}
