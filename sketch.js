var nodeX = 0,
	amp = 0,
	held = false;

var node1 = {x:50, y:200},
  node2 = {x:350, y:200};


function setup() {
	let canvas = createCanvas(400, 400);
	canvas.parent("stringDiv")
}

function draw() {
	background(220);
	updateLabels(mouseX, mouseY);
	noFill();
	beginShape();
	vertex(node1.x, node1.y);
	vertex(mouseX, mouseY);
	vertex(node2.x, node2.y);
	endShape();
}

function updateLabels(x, y){
  var xLabel = document.getElementById('x-label');
	xLabel.innerHTML = 'X: ' + x;

	var yLabel = document.getElementById('y-label');
	yLabel.innerHTML = 'Y: ' + y;
}