var nodeX = 0,
	amp = 100,
	a = 0.5,
	L = 300,
	Ns = 1,
	t = 0,
	timeScale = 2,
	damping = 0.005,
	held = false;

const aMax = 0.99,
	aMin = 0.01;

const node1 = {x:50, y:200},
  node2 = {x:50+L, y:200};

const colours = [
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

	// start counting time since string was released
	held = mouseIsPressed && (mouseButton === LEFT);
	if (held) {t = 0}


	// draw string if being held
	if (held) {
		noFill();
		strokeWeight(4);
		stroke(colours[0]);
		beginShape();
		vertex(node1.x, node1.y);
		vertex(node1.x + a * L, node1.y + amp);
		vertex(node2.x, node2.y);
		endShape();
	}

	const xs = tf.linspace(0, L, 50),
		xsArray = xs.dataSync();
	let sinSum = tf.zerosLike(xs);

	// draw each fourier term as a separate sine wave
  // if released, multiply by time dependency

	strokeWeight(2);
	for (n = 1; n < Ns + 1; n++) {
		let ys = getSin(n, xs);
		const freq = 2 * n / L;
		let timeArray = tf.mul(2 * PI * n * timeScale * t * freq, tf.onesLike(ys));
		timeArray = tf.mul(tf.exp(-damping * timeScale * t), tf.cos(timeArray));

		if (!held) {
			ys = ys.mul(timeArray)
		}
		const ysArray = ys.dataSync();
		sinSum = sinSum.add(ys);
		stroke(colours[n+1]);
		beginShape();
		for (i = 0; i < xs.shape[0]; i++) {
			vertex(node1.x + xsArray[i], node1.y + ysArray[i]);
		}
		endShape();
	}

	const sinSumArray = sinSum.dataSync();

	// plot fourier approximation of curve
	stroke(colours[1]);
	beginShape();
	for (i = 0; i < xs.shape[0]; i++) {
		vertex(node1.x + xsArray[i], node1.y + sinSumArray[i]);
	}
	endShape();

	t += 1
}


function getSin(n, xs) {
	let a_n = tf.scalar(2 * amp / ((n * PI) ** 2 * a * (1-a)));
	a_n = a_n.mul(tf.sin(n * PI * a));
	let sins = tf.mul(xs, n * PI / L).sin();
	return tf.mul(a_n, sins)
}

function mouseDragged() {
	// do not update if mouse is outside of canvas, or if not left click
	if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > width) {return false}
	if (mouseButton !== LEFT) {return false}

	a = (mouseX - node1.x) / L;
	if (a > aMax) {
		a = aMax
	} else if (a < aMin) {
		a = aMin
	}

	amp = (mouseY - node1.y);
	return false
}


function updateLabels(x, y){
  var xLabel = document.getElementById('x-label');
	xLabel.innerHTML = 'X: ' + x;

	var yLabel = document.getElementById('y-label');
	yLabel.innerHTML = 'Y: ' + y;
}