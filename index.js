const broker = 'wss://test.mosquitto.org:8081';
const topic = 'chorro';

const TAU = 6.28318530

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'Annoying_Dog_sprite.webp';

const setaObj = [
	-0.1, -0.2,
	-0.1,  0.1,
	-0.3,  0.1,
	 0.0,  0.4,
	 0.3,  0.1,
	 0.1,  0.1,
	 0.1, -0.2,
]


// canvas.width  = 900
// canvas.height = 900

// console.log(img.height);
// console.log(img.width);

const tamanhoRelativoChorro = 0.20;

const doggo = {
	width:  img.width  * tamanhoRelativoChorro,
	height: img.height * tamanhoRelativoChorro,
	x: 0,
	y: 0,
};

const safezone = {
	width:  canvas.width  / 2 - 200,
	height: canvas.height / 2 - 200,

	x: canvas.width,
	y: canvas.height,
};

safezone.x = canvas.width  / 2 - safezone.width / 2;
safezone.y = canvas.height / 2 - safezone.height / 2;


// Set the initial position to the middle of the safezone but offset by -20
const initialX = safezone.x + safezone.width  / 2 - doggo.width  / 2;
const initialY = safezone.y + safezone.height / 2 - doggo.height / 2;


const client = mqtt.connect(broker);

// Subscribe to the topic
client.on('connect', () => {
	client.subscribe(topic, (err) => {
		if (err) {
			console.error('Error subscribing to topic:', err);
		} else {
			console.log('Subscribed to topic:', topic);
		}
	});
});

client.on('message', (receivedTopic, message) => {
	const mensagem = message.toString();
	// console.log('Received message:', mensagem);

	interpretaMensagem(mensagem);

	// Parse the message JSON
	// try {
	// 	parsaMensagem(mensagem);
	// } catch (error) {
	// 	console.error('Error parsing message:', error);
	// }
});

function interpretaMensagem(message) {
	
	// console.log(`mensagem: '${message}'`);

	// Check if the message object contains 'msg' property
	const ehN = message.startsWith('n');
	const ehR = message.startsWith('r');
	const deuCerto = message && (ehN || ehR);
	if (!deuCerto) {
		console.log("deu bosta");
		return;
	}

	// Extract x and y coordinates from the message
	const match = message.match(/.x(-?\d+\.\d+)y(-?\d+\.\d+)/);

	const matchouORegexoSexo = match && match.length === 3;
	if (!matchouORegexoSexo) {
		console.log("deu bosta no regex");
		return;
	}

	const x = parseFloat(match[1]);
	const y = parseFloat(match[2]);

	doggo.x = x / 100 * canvas.width  + (canvas.width  * 0.5) - doggo.width  * 0.5;
	doggo.y = y / 100 * canvas.height + (canvas.height * 0.5) - doggo.height * 0.5;

	if (ehR) {
		console.log(`TODO: precisa fazer o reset pra ${x}, ${y}`);
		return;
	}

	// seta
	if (doggo.x > 110) {
		
	}

	if (doggo.x < -110) {
	}

	// doggo.x

	window.requestAnimationFrame(render);
}

const seta = {
	desenha: false,
	x: 0,
	y: 0,
}



const desenhaSetaEstranha = () => {
	ctx.fillStyle = 'red';
	const arrowLength = 20;
	const arrowAngle = Math.atan2(doggo.y - (safezone.y + safezone.height / 2), doggo.x - (safezone.x + safezone.width / 2));

	ctx.beginPath();
	ctx.moveTo(safezone.x + safezone.width  / 2 + Math.cos(arrowAngle) * (safezone.width / 2 + arrowLength),
						 safezone.y + safezone.height / 2 + Math.sin(arrowAngle) * (safezone.height / 2 + arrowLength));

	ctx.lineTo(safezone.x + safezone.width  / 2 + Math.cos(arrowAngle - Math.PI * 0.75) * arrowLength,
						 safezone.y + safezone.height / 2 + Math.sin(arrowAngle - Math.PI * 0.75) * arrowLength);

	ctx.lineTo(safezone.x + safezone.width  / 2 + Math.cos(arrowAngle + Math.PI * 0.75) * arrowLength,
						 safezone.y + safezone.height / 2 + Math.sin(arrowAngle + Math.PI * 0.75) * arrowLength);

	ctx.fill();
}

const render = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = 'green';

	const safeX = canvas.width  * 0.25;
	const safeY = canvas.height * 0.25;
	ctx.fillRect(safeX, safeY, canvas.width * 0.5, canvas.height * 0.5);
	
	// desenhaSetaEstranha();
	
	
	ctx.fillStyle = 'blue';

	let diffX = doggo.x + doggo.width /2 - canvas.width  / 2
	let diffY = doggo.y + doggo.height/2 - canvas.height / 2

	
	const ang = Math.atan2(diffY, diffX) - TAU * 1/4
	console.log(` ${diffX.toFixed(2)}, ${diffY.toFixed(2)}  a ${ang}`);
	const cos = Math.cos(ang)
	const sin = Math.sin(ang)

	ctx.beginPath();
	for (let i = 0; i < setaObj.length; i += 2) {
		const x = setaObj[i + 0]
		const y = setaObj[i + 1]

		const rotX = cos * x - sin * y
		const rotY = sin * x + cos * y

		const scaledX = rotX * 150 + canvas.width  / 2
		const scaledY = rotY * 150 + canvas.height / 2

		ctx.lineTo(scaledX, scaledY)
		
	}
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = 'black';
	ctx.beginPath();
	ctx.arc(canvas.width * 0.5, canvas.height * 0.5, 4, 0, 6.28318530)
	ctx.fill()

	ctx.drawImage(img, doggo.x, doggo.y, doggo.width, doggo.height);
}


img.onload = () => {
	const aspect = img.width / img.height
	canvas.width  = 900 * aspect
	canvas.height = 900

	doggo.width  = img.width  * tamanhoRelativoChorro
	doggo.height = img.height * tamanhoRelativoChorro

	doggo.x = canvas.width  * 0.5 - doggo.width  * 0.5
	doggo.y = canvas.height * 0.5 - doggo.height * 0.5


	safezone.width  = canvas.width  / 2 - 200
	safezone.height = canvas.height / 2 - 200
	
	window.requestAnimationFrame(render);
	// x: canvas.width,
	// y: canvas.height,
};

