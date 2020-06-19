var nodeX = 0,
	amp = 100,
	a = 0.5,
	L = 300,
	Ns = 1,
	held = false;

var node1 = {x:50, y:200},
  node2 = {x:50+L, y:200};

var colours = [
	"#000000",
	"#3c3c3c",
	"#c80212",
	"#8e4c19",
	"#c8bf24",
	"#5bb600",
	"#5ba6ff",
	"#304dc2",
	"#9d4dff"
];

function setup() {
	let canvas = createCanvas(400, 400);
	canvas.parent("stringDiv")
}

function draw() {
	background(220);
	const slider = document.getElementById("numFourier");
	Ns = parseInt(slider.value, 10);
	console.log(Ns);

	const aMax = 0.99,
		aMin = 0.01;

	a = (mouseX - node1.x) / L;
	if (a > aMax) {
		a = aMax
	} else if (a < aMin) {
		a = aMin
	}
	amp = (mouseY - node1.y);

	// draw string
	noFill();
	strokeWeight(4);
	stroke(colours[0]);
	beginShape();
	vertex(node1.x, node1.y);
	vertex(node1.x + a * L, mouseY);
	vertex(node2.x, node2.y);
	endShape();

	const xs = tf.linspace(0, L, 50),
		xsArray = xs.dataSync();
	let sinSum = tf.zerosLike(xs);

	// draw each fourier term as a separate sine wave
	strokeWeight(2);
	for (n = 1; n < Ns + 1; n++) {
		const ys = getSin(n, xs),
			ysArray = ys.dataSync();
		sinSum = sinSum.add(ys);
		stroke(colours[n+1]);
		beginShape();
		for (i = 0; i < xs.shape[0]; i++) {
			vertex(node1.x + xsArray[i], node1.y + ysArray[i]);
		}
		endShape();
		console.log(n, Ns + 1)
	}

	const sinSumArray = sinSum.dataSync();

	// plot fourier approximation of curve
	stroke(colours[1]);
	beginShape();
	for (i = 0; i < xs.shape[0]; i++) {
		vertex(node1.x + xsArray[i], node1.y + sinSumArray[i]);
	}
	endShape();
}


function getSin(n, xs) {
	let a_n = tf.scalar(2 * amp / ((n * PI) ** 2 * a * (1-a)));
	a_n = a_n.mul(tf.sin(n * PI * a));
	let sins = tf.mul(xs, n * PI / L).sin();
	return tf.mul(a_n, sins)
}

function updateLabels(x, y){
  var xLabel = document.getElementById('x-label');
	xLabel.innerHTML = 'X: ' + x;

	var yLabel = document.getElementById('y-label');
	yLabel.innerHTML = 'Y: ' + y;
}