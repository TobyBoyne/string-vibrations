var nodeX = 0,
	amp = 1,
	a = 0.5,
	L = 300,
	held = false;

var node1 = {x:50, y:200},
  node2 = {x:50+L, y:200};


function setup() {
	let canvas = createCanvas(400, 400);
	canvas.parent("stringDiv");
	const ts = tf.linspace(0, L, 100);
	var x = getSin(5, ts);
	console.log(x.array());
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


function getSin(n, ts) {
	let a_n = tf.scalar(2 * amp / ((n * PI) ** 2 * a * (1-a)));
	console.log("a=", a_n);
	a_n.mul(tf.sin(n * PI * a));
	let sins = tf.mul(ts, n * PI / L).sin();
	return tf.mul(a_n, sins)
}

function updateLabels(x, y){
  var xLabel = document.getElementById('x-label');
	xLabel.innerHTML = 'X: ' + x;

	var yLabel = document.getElementById('y-label');
	yLabel.innerHTML = 'Y: ' + y;
}