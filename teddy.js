var canvas;
var context;
var skeletonPromise = getSkeleton();

canvas = document.getElementById('myCanvas')
context = canvas.getContext('2d')

Promise.all([getPolygon(), getMesh()])
  .spread(function(data, position) {
    return drawPolygon(data, position)
  }).then(function() {
    return skeletonPromise
  }).then(function(data) {
    return drawSkeleton(data)
  })

function getMesh() {
  return $.ajax({
    url: './teddy.json',
    type: "GET"
  }).then(function(data) {
    var position = [];
    var i;
    for (i = 0; i < data.length; i++) {
      position[i] = [];
      position[i][0] = data[i]['pos'][0] *= 500;
      position[i][1] = data[i]['pos'][1] *= 500;
    }
    return position
  })
}

function getPolygon(position) {
  return $.ajax({
    url: './teddy_poly.json',
    type: "GET"
  })
}

function drawPolygon(data, position) {
  return new Promise(function(resolve) {
    var i = 0
    var iv

    function _draw() {
      if (i >= data.length) {
        clearTimeout(iv);
        resolve();
        return;
      }
      context.beginPath();
      context.moveTo(position[data[i]][0], position[data[i]][1]);
      context.lineTo(position[data[i + 1]][0], position[data[i + 1]][1]);
      context.moveTo(position[data[i + 1]][0], position[data[i + 1]][1]);
      context.lineTo(position[data[i + 2]][0], position[data[i + 2]][1]);
      context.moveTo(position[data[i + 2]][0], position[data[i + 2]][1]);
      context.lineTo(position[data[i]][0], position[data[i]][1]);
      context.lineWidth = 1;
      context.strokeStyle = '#000000';
      context.stroke();
      i = i + 3;
    }
    iv = setInterval(_draw, 1)
  })
}

function getSkeleton() {
  return $.ajax({
    url: './skeleton.json',
    type: "GET"
  });
}

function drawSkeleton(data) {
  return new Promise(function(resolve) {
    var iv;
    var position = [];
    var i = 0;

    function _draw() {
      if (i >= data.length) {
        clearTimeout(iv);
        resolve();
        return;
      }
      context.beginPath();
      context.strokeStyle = '#00ff00';
      context.lineWidth = 10;

      data[i][1] *= 500;
      data[i][2] *= 500;

      position[data[i][0]] = [];
      position[data[i][0]][0] = data[i][1];
      position[data[i][0]][1] = data[i][2];

      if (i == 0) {
        context.moveTo(400, 250);
      } else {
        context.moveTo(position[data[i][4]][0], position[data[i][4]][1]);
        context.lineTo(data[i][1], data[i][2]);
        context.stroke();
      }
      i++;
    }
    iv = setInterval(_draw, 300);
  })
}
