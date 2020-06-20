var amp = 100,
	a = 0.5,
	t = 0,
	held = false;

const nodeX = 50,
	L = 300,
	aMax = 0.99,
	aMin = 0.01,
	timeScale = 2,
	damping = 0.005,
	v = 2; // velocity of propagation of wave

const node1 = {x:nodeX, y:200},
  node2 = {x:nodeX+L, y:200};

const xs = tf.linspace(0, L, 50),
		xsArray = xs.dataSync();

// var ys = tf.zeros()

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
	canvas.parent("stringDiv");
	noFill()
}

function draw() {
	background(220);
	// tf.tidy() deletes tensors from memory after use


	const slider = document.getElementById("numFourier");
	const sliderLabel = document.getElementById("numFourierLabel");
	const showModes = document.getElementById("showModes").checked;

	let Ns = parseInt(slider.value, 10);
	sliderLabel.innerText = "Number of Fourier Terms = " + Ns;

	if (!mouseIsPressed) {held=false}
	// start counting time only if string was released
	if (held) {t = 0}

	// draw string if being held
	if (held) {
		strokeWeight(4);
		stroke(colours[0]);
		beginShape();
		vertex(node1.x, node1.y);
		vertex(node1.x + a * L, node1.y + amp);
		vertex(node2.x, node2.y);
		endShape();
	}

	tf.tidy(() => {
	let sinSum = tf.zerosLike(xs);

	// draw each fourier term as a separate sine wave
  // if released, multiply by time dependency

	strokeWeight(2);
	for (let n = 1; n < Ns + 1; n++) {
		let ys = getSin(n, xs);
		const freq = (n * v) / (2 * L);
		let timeArray = tf.mul(2 * PI * n * timeScale * t * freq, tf.onesLike(ys));
		timeArray = tf.mul(tf.exp(-damping * timeScale * t), tf.cos(timeArray));

		if (!held) {
			ys = ys.mul(timeArray)
		}
		const ysArray = ys.dataSync();
		sinSum = sinSum.add(ys);
		const strokeColour = min(n + 1, colours.length - 1);
		stroke(colours[strokeColour]);
		if (held || showModes) {
			beginShape();
			for (i = 0; i < xs.shape[0]; i++) {
				vertex(node1.x + xsArray[i], node1.y + ysArray[i]);
			}
			endShape()
		}
	}

	const sinSumArray = sinSum.dataSync();

	// plot fourier approximation of curve
	stroke(colours[1]);
	beginShape();
	for (let i = 0; i < xs.shape[0]; i++) {
		vertex(node1.x + xsArray[i], node1.y + sinSumArray[i]);
	}
	endShape();

	t += 1

	});
}


function getSin(n) {
	let a_n = tf.scalar(2 * amp / ((n * PI) ** 2 * a * (1-a)));
	a_n = a_n.mul(tf.sin(n * PI * a));
	let sins = tf.mul(xs, n * PI / L).sin();
	return tf.mul(a_n, sins)
}

function mouseDragged() {
	// do not update if mouse is outside of canvas, or if not left click
	if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > width) {held=false}
	else if (mouseButton !== LEFT) {}
	else {
		held = true;
		a = (mouseX - node1.x) / L;
		if (a > aMax) {
			a = aMax
		} else if (a < aMin) {
			a = aMin
		}

		amp = (mouseY - node1.y);
	}
}