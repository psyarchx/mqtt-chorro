const broker = 'wss://test.mosquitto.org:8081';
const topic = 'chorro';

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'Annoying_Dog_sprite.webp';

canvas.width  = 900
canvas.height = 900

// console.log(img.height);
// console.log(img.width);

const tamanhoRelativoChorro = 0.10;

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

	doggo.x = x;
	doggo.y = y;

	if (ehR) {
		console.log(`TODO: precisa fazer o reset pra ${x}, ${y}`);
	}	else if (ehN) {
		console.log(`TODO: nova posicao ${x}, ${y}`);
	}

	// remove esse lixo aqui, faz ele em outro lugar

	if (x >= safezone.x && x <= safezone.x + safezone.width && y >= safezone.y && y <= safezone.y + safezone.height) {
		// checa isso no render, ao invés de x e y, usa doggo.x e doggo.y

		// Draw the image at the new coordinates (x, y) within the safe zone
	} else {

		// NAO DESENHA A SETA AQUI DESENHA NO RENDER

	}
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
	ctx.fillRect(safezone.x, safezone.y, safezone.width, safezone.height);

	desenhaSetaEstranha();

	ctx.drawImage(img, initialX, initialY, doggo.width, doggo.height);
}


img.onload = () => {
	doggo.width  = img.width  * tamanhoRelativoChorro
	doggo.height = img.height * tamanhoRelativoChorro
	
	window.requestAnimationFrame(render);
};

