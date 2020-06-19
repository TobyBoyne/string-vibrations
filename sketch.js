var nodeX = 0,
	amp = 100,
	a = 0.5,
	L = 300,
	Ns = 5,
	held = false;

var node1 = {x:50, y:200},
  node2 = {x:50+L, y:200};


function setup() {
	let canvas = createCanvas(400, 400);
	canvas.parent("stringDiv")
}

function draw() {
	background(220);
	// updateLabels(mouseX, mouseY);

	const aMax = 0.99,
		aMin = 0.01;

	a = (mouseX - node1.x) / L;
	if (a > aMax) {
		a = aMax
	} else if (a < aMin) {
		a = aMin
	}
	amp = (mouseY - node1.y);
	noFill();
	beginShape();
	vertex(node1.x, node1.y);
	vertex(node1.x + a * L, mouseY);
	vertex(node2.x, node2.y);
	endShape();

	const xs = tf.linspace(0, L, 50);
	for (n = 1; n < Ns + 1; n++) {
		let xsArray = xs.dataSync(),
		 ys = getSin(n, xs).dataSync();
		beginShape();
		for (i = 0; i < xs.shape[0]; i++) {
			vertex(node1.x + xsArray[i], node1.y + ys[i]);
		}
		endShape()
	}
}


function getSin(n, xs) {
	let a_n = tf.scalar(2 * amp / ((n * PI) ** 2 * a * (1-a)));
	a_n.mul(tf.sin(n * PI * a));
	let sins = tf.mul(xs, n * PI / L).sin();
	return tf.mul(a_n, sins)
}

function updateLabels(x, y){
  var xLabel = document.getElementById('x-label');
	xLabel.innerHTML = 'X: ' + x;

	var yLabel = document.getElementById('y-label');
	yLabel.innerHTML = 'Y: ' + y;
}